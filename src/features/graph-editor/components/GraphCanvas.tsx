import {
  CANVAS_HEIGHT,
  CANVAS_PADDING,
  CANVAS_WIDTH,
  buildSvgPath,
  getAxisTicks,
  toSvgPoint,
} from '../lib/graphMath'
import type { AxisConfig, RenderedFunctionGraph } from '../model/graphObjects'

interface GraphCanvasProps {
  axisConfig: AxisConfig
  graphs: RenderedFunctionGraph[]
}

export function GraphCanvas({ axisConfig, graphs }: GraphCanvasProps) {
  const { xTicks, yTicks } = getAxisTicks(axisConfig)
  const plotLeft = CANVAS_PADDING
  const plotRight = CANVAS_WIDTH - CANVAS_PADDING
  const plotTop = CANVAS_PADDING
  const plotBottom = CANVAS_HEIGHT - CANVAS_PADDING
  const xAxisY = getHorizontalAxisY(axisConfig)
  const yAxisX = getVerticalAxisX(axisConfig)

  return (
    <div className="flex h-full min-h-[520px] items-center justify-center">
      <div className="h-full w-full max-w-5xl overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm">
        <svg
          aria-label="그래프 편집 캔버스"
          className="h-full min-h-[520px] w-full"
          role="img"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        >
          <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ffffff" />
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
                  className="fill-neutral-500 text-xs"
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
                  className="fill-neutral-500 text-xs"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            )
          })}

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
            className="fill-neutral-800 text-lg font-semibold"
          >
            x
          </text>
          <text
            x={yAxisX - 8}
            y={plotTop - 14}
            className="fill-neutral-800 text-lg font-semibold"
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
                <text x="30" y="4" className="fill-neutral-700 text-sm">
                  y = {graph.formula}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}

function getHorizontalAxisY(axisConfig: AxisConfig) {
  if (axisConfig.yMin <= 0 && axisConfig.yMax >= 0) {
    return toSvgPoint({ x: 0, y: 0 }, axisConfig).y
  }

  return axisConfig.yMin > 0 ? CANVAS_HEIGHT - CANVAS_PADDING : CANVAS_PADDING
}

function getVerticalAxisX(axisConfig: AxisConfig) {
  if (axisConfig.xMin <= 0 && axisConfig.xMax >= 0) {
    return toSvgPoint({ x: 0, y: 0 }, axisConfig).x
  }

  return axisConfig.xMin > 0 ? CANVAS_PADDING : CANVAS_WIDTH - CANVAS_PADDING
}
