import { useState } from 'react'
import type { IntentObject } from './intent'

interface IntentPanelProps {
  intent: IntentObject | null
}

// Docked bottom-left, collapsed by default. Shows the LIVE intent object as
// pretty-printed JSON — the same state every surface reads, intake → draft.
export function IntentPanel({ intent }: IntentPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`lf-intent${open ? ' lf-intent--open' : ''}`}>
      <button
        type="button"
        className="lf-btn lf-btn--icon lf-intent__toggle"
        aria-expanded={open}
        aria-controls="lf-intent-body"
        onClick={() => setOpen((v) => !v)}
      >
        {'{ }'} intent
      </button>
      {open && (
        <pre id="lf-intent-body" className="lf-intent__body" aria-label="Live intent object">
          {intent
            ? JSON.stringify(intent, null, 2)
            : '// not captured yet\n// finish intake to populate'}
        </pre>
      )}
    </div>
  )
}
