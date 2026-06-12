import type { AxisConfig } from '../model/graphObjects'

interface PropertiesPanelProps {
  axisConfig: AxisConfig
  error: string | null
  formula: string
  skippedPointCount: number
  onAxisConfigChange: (axisConfig: AxisConfig) => void
  onFormulaChange: (formula: string) => void
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
  error,
  formula,
  skippedPointCount,
  onAxisConfigChange,
  onFormulaChange,
}: PropertiesPanelProps) {
  return (
    <aside className="bg-white p-4">
      <h2 className="text-sm font-semibold text-neutral-900">수식 그래프</h2>
      <div className="mt-4 space-y-5 text-sm text-neutral-600">
        <label className="block">
          <span className="font-medium text-neutral-700">y =</span>
          <input
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm"
            placeholder="x^2"
            type="text"
            value={formula}
            onChange={(event) => onFormulaChange(event.target.value)}
          />
        </label>

        <div>
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
        </div>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            그래프가 렌더링되었습니다.
            {skippedPointCount > 0 ? ` 제외된 점 ${skippedPointCount}개` : ''}
          </p>
        )}
      </div>
    </aside>
  )
}
