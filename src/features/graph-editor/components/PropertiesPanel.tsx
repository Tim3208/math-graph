export function PropertiesPanel() {
  return (
    <aside className="bg-white p-4">
      <h2 className="text-sm font-semibold text-neutral-900">속성</h2>
      <div className="mt-4 space-y-4 text-sm text-neutral-600">
        <label className="block">
          <span className="font-medium text-neutral-700">선 스타일</span>
          <select className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2">
            <option>실선</option>
            <option>점선</option>
          </select>
        </label>
        <label className="block">
          <span className="font-medium text-neutral-700">라벨</span>
          <input
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2"
            placeholder="예: (2, 3)"
            type="text"
          />
        </label>
      </div>
    </aside>
  )
}
