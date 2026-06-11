import { GraphCanvas } from './components/GraphCanvas'
import { PropertiesPanel } from './components/PropertiesPanel'
import { ToolPanel } from './components/ToolPanel'

export function GraphEditorPage() {
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
            <GraphCanvas />
          </section>
          <PropertiesPanel />
        </div>
      </div>
    </main>
  )
}
