import { useEffect, useRef, useState } from 'react'

interface ChipProps {
  kind: string
  label: string
  onChange: (value: string) => void
  onRemove: () => void
}

// Editable, removable chip: click the label to edit it inline; × removes it.
export function Chip({ kind, label, onChange, onRemove }: ChipProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(label)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commit = () => {
    const next = draft.trim()
    if (next) onChange(next)
    else setDraft(label)
    setEditing(false)
  }

  return (
    <span className="lf-chip">
      <span className="lf-chip__kind">{kind}</span>
      {editing ? (
        <input
          ref={inputRef}
          className="lf-chip__input"
          aria-label={`Edit ${kind}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') {
              setDraft(label)
              setEditing(false)
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="lf-chip__label"
          aria-label={`Edit ${kind}: ${label}`}
          onClick={() => {
            setDraft(label)
            setEditing(true)
          }}
        >
          {label}
        </button>
      )}
      <button
        type="button"
        className="lf-chip__x"
        aria-label={`Remove ${kind}`}
        onClick={onRemove}
      >
        ×
      </button>
    </span>
  )
}

interface ToggleChipProps {
  label: string
  on: boolean
  onToggle: () => void
}

// The "Sells online" chip — a toggle, not free text.
export function ToggleChip({ label, on, onToggle }: ToggleChipProps) {
  return (
    <button
      type="button"
      className="lf-chip lf-chip--toggle"
      aria-pressed={on}
      onClick={onToggle}
    >
      {label}
    </button>
  )
}
