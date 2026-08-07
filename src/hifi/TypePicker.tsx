import { useMemo, useRef, useState } from 'react'
import { Icon, chevronLeft, envelope, image, page, pencil, store } from '@wordpress/icons'
import {
  TYPE_DESTINATIONS,
  TYPE_DEST_BACK,
  TYPE_PICKER,
  type BuildType,
  type TypeOption,
} from './content'

// Leading icon per build type. All names verified to exist in @wordpress/icons
// v15.2. Nearest-match notes: newsletter → `envelope` (no dedicated "mail"),
// blog → `pencil` (authoring; `post` also exists but `pencil` reads as "write"),
// portfolio → `image` (closest to a gallery/showcase; `gallery` also exists).
const TYPE_ICON: Record<BuildType, typeof page> = {
  website: page,
  store,
  newsletter: envelope,
  blog: pencil,
  portfolio: image,
}

interface TypePickerProps {
  // Back to the intake (the prompt screen).
  onBack: () => void
  // Single click routes: pick a type → its destination (editor for website,
  // stub for the rest). Not a multi-select.
  onPick: (type: BuildType) => void
}

// The non-AI detour (design spec). A standalone
// full-screen step in the same chrome family as Intake (WP masthead + logo,
// centered column, Back). Five stacked selectable rows (WP-assistant list
// pattern, reused from Discovery's row look): leading icon + label + one-line
// description. Reached only by the muted inline link under the prompt, so it stays
// a voluntary detour — never a co-equal front door.
export function TypePicker({ onBack, onPick }: TypePickerProps) {
  return (
    <main className="ik tp">
      <header className="ik__masthead">
        <span className="ik__logo" aria-hidden="true" />
        <button type="button" className="ik__back" onClick={onBack}>
          <Icon icon={chevronLeft} size={20} />
          {TYPE_PICKER.back}
        </button>
      </header>

      <section className="ik__center tp__center">
        <h1 className="ik__title tp__title">{TYPE_PICKER.title}</h1>
        <p className="tp__sub">{TYPE_PICKER.sub}</p>

        <TypeRows options={TYPE_PICKER.options} onPick={onPick} />
      </section>
    </main>
  )
}

// A roving-tabindex list of buttons (WP-assistant stacked rows). One tab stop;
// arrow keys move focus; Enter/Space (native button) activates and routes. Not a
// radio group — a single click IS the route, so each row is a plain button.
function TypeRows({
  options,
  onPick,
}: {
  options: TypeOption[]
  onPick: (type: BuildType) => void
}) {
  const [focusIndex, setFocusIndex] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const activeIndex = useMemo(
    () => Math.min(focusIndex, options.length - 1),
    [focusIndex, options.length],
  )

  const move = (from: number, dir: 1 | -1) => {
    const next = (from + dir + options.length) % options.length
    setFocusIndex(next)
    refs.current[next]?.focus()
  }

  const onArrow = (i: number) => (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      move(i, 1)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      move(i, -1)
    }
  }

  return (
    <div className="dq__rows tp__rows" role="list" aria-label={TYPE_PICKER.title}>
      {options.map((o, i) => (
        <button
          key={o.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="button"
          role="listitem"
          tabIndex={i === activeIndex ? 0 : -1}
          className="dq__row tp__row"
          onClick={() => onPick(o.id)}
          onFocus={() => setFocusIndex(i)}
          onKeyDown={onArrow(i)}
        >
          <span className="tp__rowicon" aria-hidden="true">
            <Icon icon={TYPE_ICON[o.id]} size={24} />
          </span>
          <span className="dq__rowtext">
            <span className="dq__rowtitle">{o.title}</span>
            <span className="dq__rowdesc">{o.description}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

interface TypeDestinationProps {
  // The non-website type this stub stands in for.
  type: Exclude<BuildType, 'website'>
  // Back returns to the picker.
  onBack: () => void
}

// A labeled destination STUB (design-shape, non-interactive endpoint), reused for
// every non-website type via the `type` param (DRY). Same chrome as the picker
// (WP masthead + Back); the copy names the real WordPress.com prepared flow it
// would continue into. It demonstrates correct routing, not a built flow.
export function TypeDestination({ type, onBack }: TypeDestinationProps) {
  const dest = TYPE_DESTINATIONS[type]
  return (
    <main className="ik tp tp--dest">
      <header className="ik__masthead">
        <span className="ik__logo" aria-hidden="true" />
        <button type="button" className="ik__back" onClick={onBack}>
          <Icon icon={chevronLeft} size={20} />
          {TYPE_DEST_BACK}
        </button>
      </header>

      <section className="ik__center tp__center">
        <h1 className="ik__title tp__title">{dest.title}</h1>
        <p className="tp__sub tp__destline">{dest.line}</p>
      </section>
    </main>
  )
}
