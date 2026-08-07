const GRAY = '#a7aaad'
const GRAY_MUTED = '#cdd0d4'
const BLUE = '#3858e9'

export function ArrowRight({ color = GRAY, width = 40 }: { color?: string; width?: number }) {
  return (
    <svg width={width} height={20} viewBox={`0 0 ${width} 20`} fill="none" aria-hidden>
      <path d={`M2 10 H${width - 8}`} stroke={color} strokeWidth={1.5} />
      <path d={`M${width - 2} 10 L${width - 10} 6 L${width - 10} 14 Z`} fill={color} />
    </svg>
  )
}

export function ArrowDown({ color = GRAY, height = 40 }: { color?: string; height?: number }) {
  return (
    <svg width={20} height={height} viewBox={`0 0 20 ${height}`} fill="none" aria-hidden>
      <path d={`M10 2 V${height - 8}`} stroke={color} strokeWidth={1.5} />
      <path d={`M10 ${height - 2} L6 ${height - 10} L14 ${height - 10} Z`} fill={color} />
    </svg>
  )
}

/* Converging fan: several sources on the left collapse into one point on the right. */
export function ConvergeArrows() {
  return (
    <svg width={44} height={280} viewBox="0 0 44 280" fill="none" aria-hidden>
      <path d="M2 40 C24 40 20 140 40 140" stroke={GRAY} strokeWidth={1.5} fill="none" />
      <path d="M2 100 C24 100 22 140 40 140" stroke={GRAY} strokeWidth={1.5} fill="none" />
      <path d="M2 180 C24 180 22 140 40 140" stroke={GRAY} strokeWidth={1.5} fill="none" />
      <path d="M2 240 C24 240 20 140 40 140" stroke={GRAY} strokeWidth={1.5} fill="none" />
      <path d="M43 140 L35 136 L35 144 Z" fill={GRAY} />
    </svg>
  )
}

/* Branch: one point at top splits into two down-arrows. */
export function BranchArrows() {
  return (
    <svg width={520} height={44} viewBox="0 0 520 44" fill="none" aria-hidden>
      <path d="M260 2 C260 22 130 20 130 38" stroke={GRAY} strokeWidth={1.5} fill="none" />
      <path d="M260 2 C260 22 390 20 390 38" stroke={GRAY} strokeWidth={1.5} fill="none" />
      <path d="M130 43 L126 35 L134 35 Z" fill={GRAY} />
      <path d="M390 43 L386 35 L394 35 Z" fill={GRAY} />
    </svg>
  )
}

export function ForkGlyph({ color = '#fff' }: { color?: string }) {
  return (
    <svg width={18} height={16} viewBox="0 0 18 16" fill="none" aria-hidden className="dg-fork">
      <path d="M2 8 H8" stroke={color} strokeWidth={1.4} />
      <path d="M8 8 C13 8 11 3 16 3" stroke={color} strokeWidth={1.4} fill="none" />
      <path d="M8 8 C13 8 11 13 16 13" stroke={color} strokeWidth={1.4} fill="none" />
      <circle cx="2" cy="8" r="1.6" fill={color} />
      <circle cx="16" cy="3" r="1.6" fill={color} />
      <circle cx="16" cy="13" r="1.6" fill={color} />
    </svg>
  )
}

export { BLUE, GRAY, GRAY_MUTED }
