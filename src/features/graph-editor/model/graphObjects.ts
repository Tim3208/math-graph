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

export interface FormulaInputState {
  formula: string
  error: string | null
}

export interface SvgPoint {
  x: number
  y: number
}

export interface SampledFunctionGraph {
  segments: SvgPoint[][]
  skippedPointCount: number
}
