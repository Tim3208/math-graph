import { forwardRef } from 'react'
import {
  CANVAS_HEIGHT,
  CANVAS_PADDING,
  CANVAS_WIDTH,
  buildSvgPath,
  getAxisTicks,
  getHorizontalAxisSvgY,
  getVerticalAxisSvgX,
  toSvgPoint,
} from '../lib/graphMath'
import type {
  AxisConfig,
  RenderedFunctionGraph,
  RenderedProjectionMarker,
} from '../model/graphObjects'

export type GraphSvgVariant = 'editor' | 'export'

interface GraphSvgProps {
  axisConfig: AxisConfig
  graphs: RenderedFunctionGraph[]
  markers: RenderedProjectionMarker[]
  variant: GraphSvgVariant
}

const mathLabelStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'italic',
} as const

export const GraphSvg = forwardRef<SVGSVGElement, GraphSvgProps>(
  function GraphSvg({ axisConfig, graphs, markers, variant }, ref) {
    const isEditor = variant === 'editor'
    const { xTicks, yTicks } = getAxisTicks(axisConfig)
    const plotLeft = CANVAS_PADDING
    const plotRight = CANVAS_WIDTH - CANVAS_PADDING
    const plotTop = CANVAS_PADDING
    const plotBottom = CANVAS_HEIGHT - CANVAS_PADDING
    const xAxisY = getHorizontalAxisSvgY(axisConfig)
    const yAxisX = getVerticalAxisSvgX(axisConfig)

    return (
      <svg
        aria-label={isEditor ? '그래프 편집 캔버스' : '그래프 출력 이미지'}
        className={isEditor ? 'h-full min-h-[520px] w-full' : undefined}
        height={CANVAS_HEIGHT}
        ref={ref}
        role="img"
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        width={CANVAS_WIDTH}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ffffff" />

        {isEditor ? (
          <>
            <rect
              x={plotLeft}
              y={plotTop}
              width={plotRight - plotLeft}
              height={plotBottom - plotTop}
              fill="#fafaf9"
              stroke="#d6d3d1"
              strokeWidth="1.5"
            />

            {xTicks.map((tick) => {
              const { x } = toSvgPoint({ x: tick, y: 0 }, axisConfig)

              return (
                <g key={`x-${tick}`}>
                  <line
                    x1={x}
                    x2={x}
                    y1={plotTop}
                    y2={plotBottom}
                    stroke="#e7e5e4"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={plotBottom + 24}
                    fill="#737373"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {tick}
                  </text>
                </g>
              )
            })}

            {yTicks.map((tick) => {
              const { y } = toSvgPoint({ x: 0, y: tick }, axisConfig)

              return (
                <g key={`y-${tick}`}>
                  <line
                    x1={plotLeft}
                    x2={plotRight}
                    y1={y}
                    y2={y}
                    stroke="#e7e5e4"
                    strokeWidth="1"
                  />
                  <text
                    x={plotLeft - 14}
                    y={y + 4}
                    fill="#737373"
                    fontSize="12"
                    textAnchor="end"
                  >
                    {tick}
                  </text>
                </g>
              )
            })}
          </>
        ) : null}

        <line
          x1={plotLeft}
          x2={plotRight}
          y1={xAxisY}
          y2={xAxisY}
          stroke="#262626"
          strokeWidth="2"
        />
        <line
          x1={yAxisX}
          x2={yAxisX}
          y1={plotBottom}
          y2={plotTop}
          stroke="#262626"
          strokeWidth="2"
        />
        <path d={`M ${plotRight} ${xAxisY} l -10 -6 v 12 z`} fill="#262626" />
        <path d={`M ${yAxisX} ${plotTop} l -6 10 h 12 z`} fill="#262626" />
        <text
          x={plotRight + 16}
          y={xAxisY + 6}
          fill="#262626"
          fontSize="28"
          style={mathLabelStyle}
        >
          x
        </text>
        <text
          x={yAxisX - 8}
          y={plotTop - 14}
          fill="#262626"
          fontSize="28"
          style={mathLabelStyle}
        >
          y
        </text>

        {graphs.flatMap((graph) =>
          graph.graph.segments.map((segment, index) => (
            <path
              d={buildSvgPath(segment)}
              fill="none"
              key={`${graph.id}-${index}`}
              stroke={graph.stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={graph.strokeWidth}
            />
          )),
        )}

        {markers.map((marker) => {
          if (!marker.isVisible || !marker.point) {
            return null
          }

          return (
            <g key={marker.id}>
              {marker.showYGuide && marker.yGuideEnd ? (
                <line
                  x1={marker.yGuideEnd.x}
                  x2={marker.point.x}
                  y1={marker.point.y}
                  y2={marker.point.y}
                  stroke={marker.stroke}
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              ) : null}

              {marker.showXGuide && marker.xGuideEnd ? (
                <line
                  x1={marker.point.x}
                  x2={marker.point.x}
                  y1={marker.point.y}
                  y2={marker.xGuideEnd.y}
                  stroke={marker.stroke}
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              ) : null}

              {marker.showPoint ? (
                <circle
                  cx={marker.point.x}
                  cy={marker.point.y}
                  fill={marker.stroke}
                  r="4"
                />
              ) : null}

              {marker.pointLabel ? (
                <text
                  x={marker.point.x + 10}
                  y={marker.point.y - 10}
                  fill="#262626"
                  fontSize="22"
                  style={mathLabelStyle}
                >
                  {marker.pointLabel}
                </text>
              ) : null}

              {marker.xLabel ? (
                <text
                  x={marker.point.x}
                  y={xAxisY + 30}
                  fill="#262626"
                  fontSize="28"
                  style={mathLabelStyle}
                  textAnchor="middle"
                >
                  {marker.xLabel}
                </text>
              ) : null}

              {marker.yLabel ? (
                <text
                  x={yAxisX - 14}
                  y={marker.point.y + 8}
                  fill="#262626"
                  fontSize="28"
                  style={mathLabelStyle}
                  textAnchor="end"
                >
                  {marker.yLabel}
                </text>
              ) : null}
            </g>
          )
        })}

        {isEditor ? (
          <g transform={`translate(${plotLeft + 12} ${plotTop + 20})`}>
            {graphs.map((graph, index) => (
              <g key={graph.id} transform={`translate(0 ${index * 22})`}>
                <line
                  x1="0"
                  x2="22"
                  y1="0"
                  y2="0"
                  stroke={graph.stroke}
                  strokeLinecap="round"
                  strokeWidth={graph.strokeWidth}
                />
                <text x="30" y="4" fill="#404040" fontSize="14">
                  y = {graph.formula}
                </text>
              </g>
            ))}
          </g>
        ) : null}
      </svg>
    )
  },
)
