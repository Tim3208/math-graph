export type GraphObject =
  | PointObject
  | LineObject
  | PolylineObject
  | LabelObject

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

export interface Coordinate {
  x: number
  y: number
}

export type StrokeStyle = 'solid' | 'dashed'
