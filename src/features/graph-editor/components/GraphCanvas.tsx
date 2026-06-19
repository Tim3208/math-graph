import { GraphSvg } from './GraphSvg'
import type {
  AxisConfig,
  RenderedFunctionGraph,
  RenderedProjectionMarker,
} from '../model/graphObjects'

interface GraphCanvasProps {
  axisConfig: AxisConfig
  graphs: RenderedFunctionGraph[]
  markers: RenderedProjectionMarker[]
}

export function GraphCanvas({ axisConfig, graphs, markers }: GraphCanvasProps) {
  return (
    <div className="flex h-full min-h-[520px] items-center justify-center">
      <div className="h-full w-full max-w-5xl overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm">
        <GraphSvg
          axisConfig={axisConfig}
          graphs={graphs}
          markers={markers}
          variant="editor"
        />
      </div>
    </div>
  )
}
