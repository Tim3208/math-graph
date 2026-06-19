import type {
  AxisConfig,
  FunctionGraphInputState,
  RenderedFunctionGraph,
} from '../model/graphObjects'

interface PropertiesPanelProps {
  axisConfig: AxisConfig
  axisError: string | null
  graphs: RenderedFunctionGraph[]
  onAxisConfigChange: (axisConfig: AxisConfig) => void
  onAddGraph: () => void
  onGraphChange: (
    id: string,
    updates: Partial<Omit<FunctionGraphInputState, 'id'>>,
  ) => void
  onGraphRemove: (id: string) => void
}

const axisFields = [
  { key: 'xMin', label: 'x 최소값' },
  { key: 'xMax', label: 'x 최대값' },
  { key: 'xTick', label: 'x 눈금' },
  { key: 'yMin', label: 'y 최소값' },
  { key: 'yMax', label: 'y 최대값' },
  { key: 'yTick', label: 'y 눈금' },
] as const

export function PropertiesPanel({
  axisConfig,
  axisError,
  graphs,
  onAxisConfigChange,
  onAddGraph,
  onGraphChange,
  onGraphRemove,
}: PropertiesPanelProps) {
  const canRemoveGraph = graphs.length > 1

  return (
    <aside className="bg-white p-4">
      <h2 className="text-sm font-semibold text-neutral-900">그래프 설정</h2>
      <div className="mt-4 space-y-5 text-sm text-neutral-600">
        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-medium text-neutral-700">함수 그래프</h3>
            <button
              className="rounded-md bg-neutral-950 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
              type="button"
              onClick={onAddGraph}
            >
              그래프 추가
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {graphs.map((graph, index) => (
              <div
                className="rounded-md border border-neutral-200 bg-neutral-50 p-3"
                key={graph.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: graph.stroke }}
                    />
                    <span className="truncate font-medium text-neutral-800">
                      그래프 {index + 1}
                    </span>
                  </div>
                  <button
                    className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!canRemoveGraph}
                    type="button"
                    onClick={() => onGraphRemove(graph.id)}
                  >
                    삭제
                  </button>
                </div>

                <label className="mt-3 block">
                  <span className="font-medium text-neutral-700">y =</span>
                  <input
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 font-mono text-sm"
                    placeholder="x^2"
                    type="text"
                    value={graph.formula}
                    onChange={(event) =>
                      onGraphChange(graph.id, { formula: event.target.value })
                    }
                  />
                </label>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-neutral-500">x 시작</span>
                    <input
                      className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2"
                      step="any"
                      type="number"
                      value={graph.xMin}
                      onChange={(event) =>
                        onGraphChange(graph.id, { xMin: Number(event.target.value) })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-neutral-500">x 끝</span>
                    <input
                      className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2"
                      step="any"
                      type="number"
                      value={graph.xMax}
                      onChange={(event) =>
                        onGraphChange(graph.id, { xMax: Number(event.target.value) })
                      }
                    />
                  </label>
                </div>

                <label className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-500">색상</span>
                  <input
                    className="h-8 w-10 rounded border border-neutral-300 bg-white p-1"
                    type="color"
                    value={graph.stroke}
                    onChange={(event) =>
                      onGraphChange(graph.id, { stroke: event.target.value })
                    }
                  />
                </label>

                {graph.error ? (
                  <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {graph.error}
                  </p>
                ) : (
                  <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {graph.graph.segments.length > 0
                      ? `렌더링됨${
                          graph.graph.skippedPointCount > 0
                            ? `, 제외된 점 ${graph.graph.skippedPointCount}개`
                            : ''
                        }`
                      : '현재 화면과 겹치는 구간이 없습니다.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-medium text-neutral-700">좌표 범위와 눈금</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {axisFields.map((field) => (
              <label className="block" key={field.key}>
                <span className="text-xs font-medium text-neutral-500">
                  {field.label}
                </span>
                <input
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
                  step="any"
                  type="number"
                  value={axisConfig[field.key]}
                  onChange={(event) =>
                    onAxisConfigChange({
                      ...axisConfig,
                      [field.key]: Number(event.target.value),
                    })
                  }
                />
              </label>
            ))}
          </div>

          {axisError ? (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {axisError}
            </p>
          ) : null}
        </section>
      </div>
    </aside>
  )
}
