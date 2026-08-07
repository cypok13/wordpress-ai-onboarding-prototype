import { useCallback, useLayoutEffect, type RefObject } from 'react'

// Auto-grow a <textarea> to fit its content: internal scrolling is forbidden, so
// the whole composer grows instead. Resets height to 'auto' then sets it to
// scrollHeight on every value change (and on mount). CSS supplies the ~2-row
// min-height and `overflow-y: hidden`.
export function useAutoGrow(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string,
) {
  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [ref])

  // Layout effect so the height is corrected before paint (no flicker).
  useLayoutEffect(() => {
    resize()
  }, [resize, value])

  return resize
}
