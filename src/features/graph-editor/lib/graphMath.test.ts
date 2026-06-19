import { describe, expect, it } from 'vitest'
import {
  DEFAULT_AXIS_CONFIG,
  compileFormula,
  sampleFunctionGraph,
  toSvgPoint,
  validateAxisConfig,
} from './graphMath'

describe('compileFormula', () => {
  it('evaluates a valid y=f(x) expression', () => {
    const formula = compileFormula('x^2')

    expect(formula.evaluate(3)).toBe(9)
  })

  it('supports common math functions', () => {
    const formula = compileFormula('sin(x)')

    expect(formula.evaluate(Math.PI / 2)).toBeCloseTo(1)
  })

  it('rejects formulas that include y=', () => {
    expect(() => compileFormula('y=x^2')).toThrow('우변만 입력')
  })

  it('supports implicit multiplication', () => {
    expect(compileFormula('x^3 - 4x^2').evaluate(2)).toBe(-8)
    expect(compileFormula('2(x+1)').evaluate(2)).toBe(6)
    expect(compileFormula('(x+1)(x-1)').evaluate(2)).toBe(3)
    expect(compileFormula('x(x+1)').evaluate(2)).toBe(6)
  })

  it('returns NaN for non-renderable values', () => {
    const formula = compileFormula('1/x')

    expect(formula.evaluate(0)).toBeNaN()
  })
})

describe('validateAxisConfig', () => {
  it('accepts the default axis config', () => {
    expect(validateAxisConfig(DEFAULT_AXIS_CONFIG)).toEqual({
      isValid: true,
      error: null,
    })
  })

  it('rejects an inverted x range', () => {
    expect(
      validateAxisConfig({
        ...DEFAULT_AXIS_CONFIG,
        xMin: 5,
        xMax: 5,
      }).error,
    ).toContain('x 최소값')
  })

  it('rejects a non-positive tick interval', () => {
    expect(
      validateAxisConfig({
        ...DEFAULT_AXIS_CONFIG,
        yTick: 0,
      }).error,
    ).toContain('눈금 간격')
  })
})

describe('sampleFunctionGraph', () => {
  it('samples a quadratic graph into a renderable segment', () => {
    const graph = sampleFunctionGraph(
      compileFormula('x^2'),
      {
        ...DEFAULT_AXIS_CONFIG,
        xMin: -2,
        xMax: 2,
        yMin: -1,
        yMax: 5,
      },
      20,
    )

    expect(graph.segments.length).toBe(1)
    expect(graph.segments[0].length).toBeGreaterThan(10)
  })

  it('splits a graph around non-renderable discontinuities', () => {
    const graph = sampleFunctionGraph(
      compileFormula('1/x'),
      {
        ...DEFAULT_AXIS_CONFIG,
        xMin: -1,
        xMax: 1,
        yMin: -10,
        yMax: 10,
      },
      40,
    )

    expect(graph.segments.length).toBeGreaterThan(1)
    expect(graph.skippedPointCount).toBeGreaterThan(0)
  })
})

describe('toSvgPoint', () => {
  it('maps the origin to the center for a symmetric axis range', () => {
    const point = toSvgPoint({ x: 0, y: 0 }, DEFAULT_AXIS_CONFIG)

    expect(point.x).toBeCloseTo(480)
    expect(point.y).toBeCloseTo(300)
  })
})
