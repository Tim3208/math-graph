const tools = ['선분', '꺾은선', '점', '라벨', '점선', '삭제']

export function ToolPanel() {
  return (
    <aside className="bg-white p-4">
      <h2 className="text-sm font-semibold text-neutral-900">도구</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
        {tools.map((tool) => (
          <button
            className="rounded-md border border-neutral-300 px-3 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            key={tool}
            type="button"
          >
            {tool}
          </button>
        ))}
      </div>
    </aside>
  )
}
