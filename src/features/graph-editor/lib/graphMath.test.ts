import { describe, expect, it } from 'vitest'
import {
  DEFAULT_AXIS_CONFIG,
  buildRenderedFunctionGraphs,
  buildRenderedProjectionMarkers,
  compileFormula,
  getHorizontalAxisSvgY,
  getVerticalAxisSvgX,
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

  it('samples only inside a function x-domain', () => {
    const axis = {
      ...DEFAULT_AXIS_CONFIG,
      xMin: -2,
      xMax: 2,
    }
    const graph = sampleFunctionGraph(compileFormula('x'), axis, 4, {
      xMin: -1,
      xMax: 1,
    })
    const segment = graph.segments[0]

    expect(segment[0].x).toBeCloseTo(toSvgPoint({ x: -1, y: -1 }, axis).x)
    expect(segment.at(-1)?.x).toBeCloseTo(toSvgPoint({ x: 1, y: 1 }, axis).x)
  })

  it('clamps a function x-domain to the visible axis range', () => {
    const axis = {
      ...DEFAULT_AXIS_CONFIG,
      xMin: -2,
      xMax: 2,
    }
    const graph = sampleFunctionGraph(compileFormula('x'), axis, 3, {
      xMin: -10,
      xMax: 1,
    })
    const segment = graph.segments[0]

    expect(segment[0].x).toBeCloseTo(toSvgPoint({ x: -2, y: -2 }, axis).x)
    expect(segment.at(-1)?.x).toBeCloseTo(toSvgPoint({ x: 1, y: 1 }, axis).x)
  })

  it('returns an empty graph when a function x-domain is outside the axis range', () => {
    const graph = sampleFunctionGraph(
      compileFormula('x'),
      {
        ...DEFAULT_AXIS_CONFIG,
        xMin: -2,
        xMax: 2,
      },
      4,
      {
        xMin: 3,
        xMax: 4,
      },
    )

    expect(graph).toEqual({ segments: [], skippedPointCount: 0 })
  })

  it('rejects an inverted function x-domain', () => {
    expect(() =>
      sampleFunctionGraph(compileFormula('x'), DEFAULT_AXIS_CONFIG, 4, {
        xMin: 1,
        xMax: 1,
      }),
    ).toThrow('시작 x')
  })
})

describe('buildRenderedFunctionGraphs', () => {
  it('keeps valid graphs renderable when another formula fails', () => {
    const result = buildRenderedFunctionGraphs(
      [
        {
          id: 'valid',
          formula: 'x',
          xMin: -1,
          xMax: 1,
          stroke: '#2563eb',
          strokeWidth: 3,
          error: null,
        },
        {
          id: 'invalid',
          formula: 'y=x',
          xMin: -1,
          xMax: 1,
          stroke: '#dc2626',
          strokeWidth: 3,
          error: null,
        },
      ],
      DEFAULT_AXIS_CONFIG,
    )
    const validGraph = result.graphs.find((graph) => graph.id === 'valid')
    const invalidGraph = result.graphs.find((graph) => graph.id === 'invalid')

    expect(result.axisError).toBeNull()
    expect(validGraph?.error).toBeNull()
    expect(validGraph?.graph.segments.length).toBeGreaterThan(0)
    expect(invalidGraph?.error).toBeTruthy()
    expect(invalidGraph?.graph).toEqual({ segments: [], skippedPointCount: 0 })
  })
})

describe('buildRenderedProjectionMarkers', () => {
  it('builds guide endpoints from a numeric point to the axes', () => {
    const axis = {
      ...DEFAULT_AXIS_CONFIG,
      xMin: -2,
      xMax: 5,
      yMin: -1,
      yMax: 4,
    }
    const [marker] = buildRenderedProjectionMarkers(
      [
        {
          id: 'marker-1',
          x: 4,
          y: 3,
          pointLabel: '',
          xLabel: '4',
          yLabel: '3a',
          showPoint: true,
          showXGuide: true,
          showYGuide: true,
          stroke: '#737373',
          error: null,
        },
      ],
      axis,
    )
    const point = toSvgPoint({ x: 4, y: 3 }, axis)

    expect(marker.isVisible).toBe(true)
    expect(marker.point?.x).toBeCloseTo(point.x)
    expect(marker.point?.y).toBeCloseTo(point.y)
    expect(marker.xGuideEnd).toEqual({
      x: point.x,
      y: getHorizontalAxisSvgY(axis),
    })
    expect(marker.yGuideEnd).toEqual({
      x: getVerticalAxisSvgX(axis),
      y: point.y,
    })
  })

  it('keeps numeric coordinates separate from display labels', () => {
    const [marker] = buildRenderedProjectionMarkers(
      [
        {
          id: 'marker-1',
          x: 4,
          y: 3,
          pointLabel: 'P',
          xLabel: '4',
          yLabel: '3a',
          showPoint: true,
          showXGuide: true,
          showYGuide: true,
          stroke: '#737373',
          error: null,
        },
      ],
      DEFAULT_AXIS_CONFIG,
    )

    expect(marker.y).toBe(3)
    expect(marker.yLabel).toBe('3a')
    expect(marker.pointLabel).toBe('P')
  })

  it('hides markers outside the visible axis range', () => {
    const [marker] = buildRenderedProjectionMarkers(
      [
        {
          id: 'marker-1',
          x: 20,
          y: 3,
          pointLabel: '',
          xLabel: '20',
          yLabel: '3',
          showPoint: true,
          showXGuide: true,
          showYGuide: true,
          stroke: '#737373',
          error: null,
        },
      ],
      DEFAULT_AXIS_CONFIG,
    )

    expect(marker.isVisible).toBe(false)
    expect(marker.point).toBeNull()
    expect(marker.error).toContain('화면 밖')
  })
})

describe('toSvgPoint', () => {
  it('maps the origin to the center for a symmetric axis range', () => {
    const point = toSvgPoint({ x: 0, y: 0 }, DEFAULT_AXIS_CONFIG)

    expect(point.x).toBeCloseTo(480)
    expect(point.y).toBeCloseTo(300)
  })
})
