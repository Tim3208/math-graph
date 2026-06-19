import { compile } from 'mathjs'
import type {
  AxisConfig,
  FunctionGraphInputState,
  RenderedFunctionGraph,
  SampledFunctionGraph,
  SvgPoint,
} from '../model/graphObjects'

export const CANVAS_WIDTH = 960
export const CANVAS_HEIGHT = 600
export const CANVAS_PADDING = 64

export const DEFAULT_AXIS_CONFIG: AxisConfig = {
  xMin: -5,
  xMax: 5,
  yMin: -5,
  yMax: 5,
  xTick: 1,
  yTick: 1,
}

const EMPTY_GRAPH: SampledFunctionGraph = { segments: [], skippedPointCount: 0 }

export interface ValidationResult {
  isValid: boolean
  error: string | null
}

export interface CompiledFormula {
  evaluate: (x: number) => number
}

export interface FunctionDomain {
  xMin: number
  xMax: number
}

interface MathCompiledExpression {
  evaluate: (scope: { x: number }) => unknown
}

export function validateAxisConfig(axis: AxisConfig): ValidationResult {
  const entries = Object.entries(axis)

  for (const [key, value] of entries) {
    if (!Number.isFinite(value)) {
      return {
        isValid: false,
        error: `${axisLabel(key)} 값은 유효한 숫자여야 합니다.`,
      }
    }
  }

  if (axis.xMin >= axis.xMax) {
    return {
      isValid: false,
      error: 'x 최소값은 x 최대값보다 작아야 합니다.',
    }
  }

  if (axis.yMin >= axis.yMax) {
    return {
      isValid: false,
      error: 'y 최소값은 y 최대값보다 작아야 합니다.',
    }
  }

  if (axis.xTick <= 0 || axis.yTick <= 0) {
    return {
      isValid: false,
      error: '눈금 간격은 0보다 커야 합니다.',
    }
  }

  return { isValid: true, error: null }
}

export function compileFormula(input: string): CompiledFormula {
  const formula = input.trim()

  if (formula.length === 0) {
    throw new Error('수식을 입력하세요.')
  }

  if (/[=;]/.test(formula)) {
    throw new Error('수식은 y= 없이 우변만 입력하세요.')
  }

  let code: MathCompiledExpression

  try {
    code = compile(normalizeFormulaInput(formula)) as MathCompiledExpression
  } catch {
    throw new Error('수식을 해석할 수 없습니다.')
  }

  return {
    evaluate: (x: number) => {
      try {
        const value = code.evaluate({ x })
        const numericValue = Number(value)

        if (!Number.isFinite(numericValue)) {
          return Number.NaN
        }

        return numericValue
      } catch {
        return Number.NaN
      }
    },
  }
}

export function buildRenderedFunctionGraphs(
  functionGraphs: FunctionGraphInputState[],
  axis: AxisConfig,
): { graphs: RenderedFunctionGraph[]; axisError: string | null } {
  const axisValidation = validateAxisConfig(axis)

  if (!axisValidation.isValid) {
    return {
      graphs: functionGraphs.map((functionGraph) => ({
        ...functionGraph,
        graph: EMPTY_GRAPH,
      })),
      axisError: axisValidation.error,
    }
  }

  return {
    graphs: functionGraphs.map((functionGraph) => {
      try {
        const compiledFormula = compileFormula(functionGraph.formula)

        return {
          ...functionGraph,
          graph: sampleFunctionGraph(compiledFormula, axis, 480, {
            xMin: functionGraph.xMin,
            xMax: functionGraph.xMax,
          }),
          error: null,
        }
      } catch (error) {
        return {
          ...functionGraph,
          graph: EMPTY_GRAPH,
          error: error instanceof Error ? error.message : '수식을 해석할 수 없습니다.',
        }
      }
    }),
    axisError: null,
  }
}

export function sampleFunctionGraph(
  formula: CompiledFormula,
  axis: AxisConfig,
  sampleCount = 480,
  domain?: FunctionDomain,
): SampledFunctionGraph {
  const axisValidation = validateAxisConfig(axis)

  if (!axisValidation.isValid) {
    throw new Error(axisValidation.error ?? '축 설정이 올바르지 않습니다.')
  }

  const bounds = getSampleBounds(axis, domain)

  if (bounds === null) {
    return { segments: [], skippedPointCount: 0 }
  }

  const segments: SvgPoint[][] = []
  let currentSegment: SvgPoint[] = []
  let skippedPointCount = 0
  let lastValue: number | null = null
  const step = (bounds.xMax - bounds.xMin) / sampleCount
  const yRange = axis.yMax - axis.yMin

  for (let index = 0; index <= sampleCount; index += 1) {
    const x = bounds.xMin + step * index
    const y = formula.evaluate(x)
    const isRenderable =
      Number.isFinite(y) &&
      y >= axis.yMin &&
      y <= axis.yMax &&
      !crossesLikelyAsymptote(lastValue, y, yRange)

    if (!isRenderable) {
      skippedPointCount += 1
      lastValue = Number.isFinite(y) ? y : null

      if (currentSegment.length > 0) {
        segments.push(currentSegment)
        currentSegment = []
      }

      continue
    }

    currentSegment.push(toSvgPoint({ x, y }, axis))
    lastValue = y
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment)
  }

  return { segments, skippedPointCount }
}

export function toSvgPoint(point: { x: number; y: number }, axis: AxisConfig): SvgPoint {
  const plotWidth = CANVAS_WIDTH - CANVAS_PADDING * 2
  const plotHeight = CANVAS_HEIGHT - CANVAS_PADDING * 2
  const xRatio = (point.x - axis.xMin) / (axis.xMax - axis.xMin)
  const yRatio = (point.y - axis.yMin) / (axis.yMax - axis.yMin)

  return {
    x: CANVAS_PADDING + xRatio * plotWidth,
    y: CANVAS_HEIGHT - CANVAS_PADDING - yRatio * plotHeight,
  }
}

export function buildSvgPath(points: SvgPoint[]): string {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${round(point.x)} ${round(point.y)}`)
    .join(' ')
}

export function getAxisTicks(axis: AxisConfig): { xTicks: number[]; yTicks: number[] } {
  return {
    xTicks: buildTicks(axis.xMin, axis.xMax, axis.xTick),
    yTicks: buildTicks(axis.yMin, axis.yMax, axis.yTick),
  }
}

function buildTicks(min: number, max: number, tick: number): number[] {
  const ticks: number[] = []
  const firstTick = Math.ceil(min / tick) * tick

  for (let value = firstTick; value <= max + tick / 1000; value += tick) {
    ticks.push(round(value))
  }

  return ticks
}

function crossesLikelyAsymptote(lastValue: number | null, value: number, yRange: number) {
  return lastValue !== null && Math.abs(value - lastValue) > yRange * 0.9
}

function getSampleBounds(axis: AxisConfig, domain?: FunctionDomain) {
  if (!domain) {
    return { xMin: axis.xMin, xMax: axis.xMax }
  }

  if (!Number.isFinite(domain.xMin) || !Number.isFinite(domain.xMax)) {
    throw new Error('그래프 구간은 유효한 숫자여야 합니다.')
  }

  if (domain.xMin >= domain.xMax) {
    throw new Error('그래프 구간은 시작 x가 끝 x보다 작아야 합니다.')
  }

  const xMin = Math.max(axis.xMin, domain.xMin)
  const xMax = Math.min(axis.xMax, domain.xMax)

  if (xMin >= xMax) {
    return null
  }

  return { xMin, xMax }
}

function normalizeFormulaInput(formula: string) {
  return formula.replace(/\bx\s*(?=\()/g, 'x * ')
}

function axisLabel(key: string) {
  const labels: Record<string, string> = {
    xMin: 'x 최소값',
    xMax: 'x 최대값',
    yMin: 'y 최소값',
    yMax: 'y 최대값',
    xTick: 'x 눈금',
    yTick: 'y 눈금',
  }

  return labels[key] ?? key
}

function round(value: number) {
  return Math.round(value * 1000) / 1000
}
