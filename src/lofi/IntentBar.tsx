import { COPY } from './copy'
import type { Tone } from './copy'
import type { IntentObject } from './intent'

interface IntentBarProps {
  intent: IntentObject
  tone: Tone
  onToggleTone: () => void
  onUndoTone: () => void
  toneEdited: boolean
}

// Slim, grayscale intent bar docked at the top of the draft canvas. Reuses the
// lo-fi chip look. The tone chip is a cycle toggle (Calm ↔ Energetic).
export function IntentBar({ intent, tone, onToggleTone, onUndoTone, toneEdited }: IntentBarProps) {
  return (
    <div className="lf-intentbar">
      <span className="lf-intentbar__label">{COPY.intentBarLabel}</span>
      <div className="lf-chips lf-intentbar__chips" role="group" aria-label={COPY.intentBarLabel}>
        <span className="lf-chip lf-chip--static">
          <span className="lf-chip__kind">type</span>
          <span className="lf-chip__value">{intent.type}</span>
        </span>
        <span className="lf-chip lf-chip--static">
          <span className="lf-chip__kind">field</span>
          <span className="lf-chip__value">{intent.field}</span>
        </span>
        <button
          type="button"
          className="lf-chip lf-chip--cycle"
          aria-label={`Tone: ${tone}. Change tone.`}
          onClick={onToggleTone}
        >
          <span className="lf-chip__kind">{COPY.toneChipKind}</span>
          <span className="lf-chip__value">{tone}</span>
          <span className="lf-chip__cyclehint" aria-hidden>
            ⇄
          </span>
        </button>
        {toneEdited && (
          <button type="button" className="lf-btn lf-btn--ghost lf-btn--icon" onClick={onUndoTone}>
            ↶ {COPY.toneUndo}
          </button>
        )}
      </div>
      <p className="lf-help lf-intentbar__caption">{COPY.intentBarCaption}</p>
    </div>
  )
}
