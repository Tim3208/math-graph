import { useMemo, useState } from 'react'
import { GraphCanvas } from './components/GraphCanvas'
import { PropertiesPanel } from './components/PropertiesPanel'
import { ToolPanel } from './components/ToolPanel'
import {
  DEFAULT_AXIS_CONFIG,
  buildRenderedFunctionGraphs,
  buildRenderedProjectionMarkers,
} from './lib/graphMath'
import type {
  AxisConfig,
  FunctionGraphInputState,
  ProjectionMarkerInputState,
} from './model/graphObjects'

const GRAPH_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2']

export function GraphEditorPage() {
  const [functionGraphs, setFunctionGraphs] = useState<FunctionGraphInputState[]>([
    createFunctionGraph('function-1', 'x^2', DEFAULT_AXIS_CONFIG, GRAPH_COLORS[0]),
  ])
  const [projectionMarkers, setProjectionMarkers] = useState<ProjectionMarkerInputState[]>([])
  const [nextGraphId, setNextGraphId] = useState(2)
  const [nextMarkerId, setNextMarkerId] = useState(1)
  const [axisConfig, setAxisConfig] = useState<AxisConfig>(DEFAULT_AXIS_CONFIG)

  const graphResult = useMemo(
    () => buildRenderedFunctionGraphs(functionGraphs, axisConfig),
    [axisConfig, functionGraphs],
  )
  const renderedMarkers = useMemo(
    () => buildRenderedProjectionMarkers(projectionMarkers, axisConfig),
    [axisConfig, projectionMarkers],
  )

  const updateFunctionGraph = (
    id: string,
    updates: Partial<Omit<FunctionGraphInputState, 'id'>>,
  ) => {
    setFunctionGraphs((graphs) =>
      graphs.map((graph) =>
        graph.id === id
          ? {
              ...graph,
              ...updates,
              error: null,
            }
          : graph,
      ),
    )
  }

  const addFunctionGraph = () => {
    setFunctionGraphs((graphs) => [
      ...graphs,
      createFunctionGraph(
        `function-${nextGraphId}`,
        'x',
        axisConfig,
        GRAPH_COLORS[(nextGraphId - 1) % GRAPH_COLORS.length],
      ),
    ])
    setNextGraphId((id) => id + 1)
  }

  const removeFunctionGraph = (id: string) => {
    setFunctionGraphs((graphs) =>
      graphs.length === 1 ? graphs : graphs.filter((graph) => graph.id !== id),
    )
  }

  const updateProjectionMarker = (
    id: string,
    updates: Partial<Omit<ProjectionMarkerInputState, 'id'>>,
  ) => {
    setProjectionMarkers((markers) =>
      markers.map((marker) =>
        marker.id === id
          ? {
              ...marker,
              ...updates,
              error: null,
            }
          : marker,
      ),
    )
  }

  const addProjectionMarker = () => {
    setProjectionMarkers((markers) => [
      ...markers,
      createProjectionMarker(`marker-${nextMarkerId}`, axisConfig),
    ])
    setNextMarkerId((id) => id + 1)
  }

  const removeProjectionMarker = (id: string) => {
    setProjectionMarkers((markers) => markers.filter((marker) => marker.id !== id))
  }

  return (
    <main className="min-h-screen bg-stone-100 text-neutral-950">
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-neutral-200 bg-white px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold">math-graph</h1>
              <p className="text-sm text-neutral-500">
                수학 문제용 그래프 제작 도구
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                저장
              </button>
              <button className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800">
                내보내기
              </button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <ToolPanel />
          <section className="min-h-[560px] border-y border-neutral-200 bg-stone-200/70 p-4 lg:border-x lg:border-y-0">
            <GraphCanvas
              axisConfig={axisConfig}
              graphs={graphResult.graphs}
              markers={renderedMarkers}
            />
          </section>
          <PropertiesPanel
            axisConfig={axisConfig}
            axisError={graphResult.axisError}
            graphs={graphResult.graphs}
            markers={renderedMarkers}
            onAxisConfigChange={setAxisConfig}
            onAddGraph={addFunctionGraph}
            onAddMarker={addProjectionMarker}
            onGraphChange={updateFunctionGraph}
            onGraphRemove={removeFunctionGraph}
            onMarkerChange={updateProjectionMarker}
            onMarkerRemove={removeProjectionMarker}
          />
        </div>
      </div>
    </main>
  )
}

function createProjectionMarker(
  id: string,
  axisConfig: AxisConfig,
): ProjectionMarkerInputState {
  const x = getDefaultCoordinate(axisConfig.xMin, axisConfig.xMax)
  const y = getDefaultCoordinate(axisConfig.yMin, axisConfig.yMax)

  return {
    id,
    x,
    y,
    pointLabel: '',
    xLabel: String(x),
    yLabel: String(y),
    showPoint: true,
    showXGuide: true,
    showYGuide: true,
    stroke: '#737373',
    error: null,
  }
}

function getDefaultCoordinate(min: number, max: number) {
  if (min <= 0 && max >= 0) {
    return 0
  }

  return Math.round(((min + max) / 2) * 1000) / 1000
}

function createFunctionGraph(
  id: string,
  formula: string,
  axisConfig: AxisConfig,
  stroke: string,
): FunctionGraphInputState {
  return {
    id,
    formula,
    xMin: axisConfig.xMin,
    xMax: axisConfig.xMax,
    stroke,
    strokeWidth: 3,
    error: null,
  }
}
