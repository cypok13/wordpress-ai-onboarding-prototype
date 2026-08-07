import { useEffect, useState } from 'react'
import { COPY } from './copy'
import { parseIntent } from './intent'
import type { IntentObject } from './intent'
import { Chip, ToggleChip } from './Chip'

type Sub = 'prompt' | 'chips'

interface ExtraChip {
  id: number
  kind: string
  label: string
}

interface IntakeScreenProps {
  onGenerate: (intent: IntentObject) => void
  onIntentChange?: (intent: IntentObject | null) => void
}

export function IntakeScreen({ onGenerate, onIntentChange }: IntakeScreenProps) {
  const [sub, setSub] = useState<Sub>('prompt')
  const [prompt, setPrompt] = useState('')
  const [intent, setIntent] = useState<IntentObject | null>(null)
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const [extras, setExtras] = useState<ExtraChip[]>([])
  const nextExtraId = useState(() => ({ v: 1 }))[0]

  useEffect(() => {
    onIntentChange?.(intent)
  }, [intent, onIntentChange])

  const proceedToChips = () => {
    if (!prompt.trim()) return
    setIntent(parseIntent(prompt))
    setHidden({})
    setExtras([])
    setSub('chips')
  }

  const patchIntent = (patch: Partial<IntentObject>) =>
    setIntent((prev) => (prev ? { ...prev, ...patch } : prev))

  const addDetail = () => {
    const id = nextExtraId.v++
    setExtras((prev) => [...prev, { id, kind: 'detail', label: 'New detail' }])
  }

  const updateExtra = (id: number, label: string) =>
    setExtras((prev) => prev.map((e) => (e.id === id ? { ...e, label } : e)))

  const removeExtra = (id: number) =>
    setExtras((prev) => prev.filter((e) => e.id !== id))

  // ---- Sub-step 1: prompt ----
  if (sub === 'prompt') {
    return (
      <div className="lf-intake">
        <div className="lf-intake__card">
          <h1 className="lf-intake__heading">{COPY.intakePromptHeading}</h1>
          <label className="lf-sr" htmlFor="intake-prompt">
            {COPY.intakePromptHeading}
          </label>
          <input
            id="intake-prompt"
            className="lf-intake__input"
            type="text"
            placeholder={COPY.intakePromptPlaceholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') proceedToChips()
            }}
          />
          <div className="lf-intake__actions">
            <button
              type="button"
              className="lf-btn lf-btn--strong"
              onClick={proceedToChips}
              disabled={!prompt.trim()}
            >
              {COPY.intakeContinue}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---- Sub-step 2: the intent object ----
  return (
    <div className="lf-intake">
      <div className="lf-intake__card">
        <button
          type="button"
          className="lf-btn lf-btn--ghost lf-btn--icon"
          onClick={() => setSub('prompt')}
        >
          {COPY.intakeBack}
        </button>

        <h1 className="lf-intake__heading" style={{ marginTop: 10 }}>
          {COPY.intakeUnderstoodHeading}
        </h1>
        <p className="lf-intake__quote">“{prompt}”</p>

        <div className="lf-chips" role="group" aria-label="What I understood">
          {intent && !hidden.type && (
            <Chip
              kind="type"
              label={intent.type}
              onChange={(v) => patchIntent({ type: v })}
              onRemove={() => setHidden((h) => ({ ...h, type: true }))}
            />
          )}
          {intent && !hidden.field && (
            <Chip
              kind="field"
              label={intent.field}
              onChange={(v) => patchIntent({ field: v })}
              onRemove={() => setHidden((h) => ({ ...h, field: true }))}
            />
          )}
          {intent && !hidden.tone && (
            <Chip
              kind="tone"
              label={intent.tone}
              onChange={(v) => patchIntent({ tone: v })}
              onRemove={() => setHidden((h) => ({ ...h, tone: true }))}
            />
          )}
          {intent && (
            <ToggleChip
              label={intent.sells ? COPY.intakeSellsYes : COPY.intakeSellsNo}
              on={intent.sells}
              onToggle={() => patchIntent({ sells: !intent.sells })}
            />
          )}
          {extras.map((e) => (
            <Chip
              key={e.id}
              kind={e.kind}
              label={e.label}
              onChange={(v) => updateExtra(e.id, v)}
              onRemove={() => removeExtra(e.id)}
            />
          ))}
          <button type="button" className="lf-chip lf-chip--add" onClick={addDetail}>
            {COPY.intakeAddDetail}
          </button>
        </div>

        <p className="lf-help lf-intake__caption">{COPY.intakeCaption}</p>

        <div className="lf-intake__actions">
          <button
            type="button"
            className="lf-btn lf-btn--strong"
            onClick={() => intent && onGenerate(intent)}
          >
            {COPY.intakeGenerate}
          </button>
        </div>
      </div>
    </div>
  )
}
