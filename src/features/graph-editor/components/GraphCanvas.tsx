import type { GraphObject } from '../model/graphObjects'

const placeholderObjects: GraphObject[] = []

export function GraphCanvas() {
  return (
    <div className="flex h-full min-h-[520px] items-center justify-center">
      <div className="h-full w-full max-w-5xl overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm">
        <svg
          aria-label="그래프 편집 캔버스"
          className="h-full min-h-[520px] w-full"
          role="img"
          viewBox="0 0 960 600"
        >
          <defs>
            <pattern
              id="minor-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="#e7e5e4"
                strokeWidth="1"
              />
            </pattern>
            <pattern
              id="major-grid"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <rect width="120" height="120" fill="url(#minor-grid)" />
              <path
                d="M 120 0 L 0 0 0 120"
                fill="none"
                stroke="#d6d3d1"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>

          <rect width="960" height="600" fill="url(#major-grid)" />
          <line x1="80" y1="520" x2="900" y2="520" stroke="#262626" strokeWidth="2" />
          <line x1="80" y1="540" x2="80" y2="80" stroke="#262626" strokeWidth="2" />
          <path d="M 900 520 l -10 -6 v 12 z" fill="#262626" />
          <path d="M 80 80 l -6 10 h 12 z" fill="#262626" />
          <text x="910" y="526" className="fill-neutral-800 text-lg font-semibold">
            x
          </text>
          <text x="72" y="68" className="fill-neutral-800 text-lg font-semibold">
            y
          </text>
          <text x="63" y="540" className="fill-neutral-500 text-base">
            O
          </text>

          {placeholderObjects.map((object) => (
            <g key={object.id} data-graph-object={object.kind} />
          ))}
        </svg>
      </div>
    </div>
  )
}
