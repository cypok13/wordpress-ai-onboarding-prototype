// Bespoke inline glyphs with no `@wordpress/icons` equivalent (24px grid,
// currentColor). Standard chrome icons migrated to `@wordpress/icons`; only the
// brand/AI-provenance glyphs remain here.

type P = { size?: number }

export function IconSparkle({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.6 4.9L18.5 8l-4.9 1.6L12 14l-1.6-4.4L5.5 8l4.9-1.1L12 2zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" />
    </svg>
  )
}

export function IconAi({ size = 13 }: P) {
  // provenance "AI draft" glyph — a small sparkle outline
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l1.7 5L19 9.7 13.7 11.4 12 17l-1.7-5.6L5 9.7 10.3 8 12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconEdited({ size = 13 }: P) {
  // provenance "Edited by you" glyph — a pencil
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconRegenerate({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ fill: 'none' }} aria-hidden="true">
      <path
        d="M20 11a8 8 0 1 0-.6 4M20 5v4h-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Jetpack logo — no DS equivalent. Bespoke glyph matching the real mark: green
// round badge with the white Z-shaped "sails" (upper sail zig-zags top→left,
// lower sail zig-zags bottom→right). FLAGGED as a custom SVG.
export function IconJetpack({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#069e08" />
      <path d="M17 5v14h7L17 5z" fill="#fff" />
      <path d="M15 27V13H8l7 14z" fill="#fff" />
    </svg>
  )
}

export function IconCheck({ size = 15 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
