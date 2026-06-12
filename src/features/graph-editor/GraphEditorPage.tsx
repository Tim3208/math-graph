import { useMemo, useState } from 'react'
import { GraphCanvas } from './components/GraphCanvas'
import { PropertiesPanel } from './components/PropertiesPanel'
import { ToolPanel } from './components/ToolPanel'
import {
  DEFAULT_AXIS_CONFIG,
  compileFormula,
  sampleFunctionGraph,
  validateAxisConfig,
} from './lib/graphMath'
import type { AxisConfig, FormulaInputState } from './model/graphObjects'

export function GraphEditorPage() {
  const [formulaState, setFormulaState] = useState<FormulaInputState>({
    formula: 'x^2',
    error: null,
  })
  const [axisConfig, setAxisConfig] = useState<AxisConfig>(DEFAULT_AXIS_CONFIG)

  const graphResult = useMemo(() => {
    const axisValidation = validateAxisConfig(axisConfig)

    if (!axisValidation.isValid) {
      return {
        graph: { segments: [], skippedPointCount: 0 },
        error: axisValidation.error,
      }
    }

    try {
      const compiledFormula = compileFormula(formulaState.formula)

      return {
        graph: sampleFunctionGraph(compiledFormula, axisConfig),
        error: null,
      }
    } catch (error) {
      return {
        graph: { segments: [], skippedPointCount: 0 },
        error: error instanceof Error ? error.message : '수식을 해석할 수 없습니다.',
      }
    }
  }, [axisConfig, formulaState.formula])

  const formulaError = formulaState.error ?? graphResult.error

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
              formula={formulaState.formula}
              graph={graphResult.graph}
            />
          </section>
          <PropertiesPanel
            axisConfig={axisConfig}
            error={formulaError}
            formula={formulaState.formula}
            skippedPointCount={graphResult.graph.skippedPointCount}
            onAxisConfigChange={setAxisConfig}
            onFormulaChange={(formula) => setFormulaState({ formula, error: null })}
          />
        </div>
      </div>
    </main>
  )
}
