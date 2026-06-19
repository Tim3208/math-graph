import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { GraphSvg } from './GraphSvg'
import {
  DEFAULT_AXIS_CONFIG,
  buildRenderedProjectionMarkers,
} from '../lib/graphMath'
import type { RenderedFunctionGraph } from '../model/graphObjects'

const renderedGraphs: RenderedFunctionGraph[] = [
  {
    id: 'graph-1',
    formula: 'x',
    xMin: -1,
    xMax: 1,
    stroke: '#262626',
    strokeWidth: 3,
    error: null,
    graph: {
      segments: [
        [
          { x: 64, y: 536 },
          { x: 896, y: 64 },
        ],
      ],
      skippedPointCount: 0,
    },
  },
]

const renderedMarkers = buildRenderedProjectionMarkers(
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
  DEFAULT_AXIS_CONFIG,
)

describe('GraphSvg export variant', () => {
  it('renders a white problem-sheet SVG with graph and marker labels', () => {
    const markup = renderToStaticMarkup(
      <GraphSvg
        axisConfig={DEFAULT_AXIS_CONFIG}
        graphs={renderedGraphs}
        markers={renderedMarkers}
        variant="export"
      />,
    )

    expect(markup).toContain('fill="#ffffff"')
    expect(markup).toContain('stroke="#262626"')
    expect(markup).toContain('d="M 64 536 L 896 64"')
    expect(markup).toContain('3a')
    expect(markup).toContain('4')
  })

  it('omits editor-only grid and graph legend', () => {
    const markup = renderToStaticMarkup(
      <GraphSvg
        axisConfig={DEFAULT_AXIS_CONFIG}
        graphs={renderedGraphs}
        markers={renderedMarkers}
        variant="export"
      />,
    )

    expect(markup).not.toContain('#e7e5e4')
    expect(markup).not.toContain('#fafaf9')
    expect(markup).not.toContain('y = x')
  })
})
