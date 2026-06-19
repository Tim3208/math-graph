export type GraphObject =
  | PointObject
  | LineObject
  | PolylineObject
  | LabelObject
  | FunctionGraphObject

export interface PointObject {
  id: string
  kind: 'point'
  x: number
  y: number
  label?: string
}

export interface LineObject {
  id: string
  kind: 'line'
  from: Coordinate
  to: Coordinate
  strokeStyle: StrokeStyle
  label?: string
}

export interface PolylineObject {
  id: string
  kind: 'polyline'
  points: Coordinate[]
  strokeStyle: StrokeStyle
  label?: string
}

export interface LabelObject {
  id: string
  kind: 'label'
  position: Coordinate
  text: string
}

export interface FunctionGraphObject {
  id: string
  kind: 'function'
  formula: string
  xMin: number
  xMax: number
  stroke: string
  strokeWidth: number
}

export interface Coordinate {
  x: number
  y: number
}

export type StrokeStyle = 'solid' | 'dashed'

export interface AxisConfig {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  xTick: number
  yTick: number
}

export interface FunctionGraphInputState {
  id: string
  formula: string
  xMin: number
  xMax: number
  stroke: string
  strokeWidth: number
  error: string | null
}

export interface RenderedFunctionGraph extends FunctionGraphInputState {
  graph: SampledFunctionGraph
}

export interface ProjectionMarkerInputState {
  id: string
  x: number
  y: number
  pointLabel: string
  xLabel: string
  yLabel: string
  showPoint: boolean
  showXGuide: boolean
  showYGuide: boolean
  stroke: string
  error: string | null
}

export interface RenderedProjectionMarker extends ProjectionMarkerInputState {
  isVisible: boolean
  point: SvgPoint | null
  xGuideEnd: SvgPoint | null
  yGuideEnd: SvgPoint | null
}

export interface SvgPoint {
  x: number
  y: number
}

export interface SampledFunctionGraph {
  segments: SvgPoint[][]
  skippedPointCount: number
}
