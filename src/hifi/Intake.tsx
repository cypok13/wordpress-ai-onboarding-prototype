import { useState } from 'react'
import { Button } from '@wordpress/components'
import { Icon, arrowUp, chevronRight } from '@wordpress/icons'
import { INTAKE } from './content'

interface IntakeProps {
  onSubmit: (intent: string) => void
  // Non-AI detour — skip the assistant and open the "what are you building?"
  // type-picker, which routes per intent (website → editor, others → stub).
  onPickYourself: () => void
}

// Step 1 — the flow's entry (mixed-intent order, the design spec): a WP logo, a centered
// serif title, a calm prompt card. No Back — this is the start. The AI-first
// draft path is the wired demo; method alternatives survive as a quiet sticky card.
export function Intake({ onSubmit, onPickYourself }: IntakeProps) {
  const [intent, setIntent] = useState('')
  // B7 — brief exit before handing off to Discovery: the whole intake fades and
  // the prompt card glides DOWN, reading as "the input is moving to the bottom".
  // Honors reduced-motion (skips the delay, hands off instantly).
  const [leaving, setLeaving] = useState(false)

  const canSubmit = intent.trim().length > 0

  const submit = () => {
    const text = intent.trim()
    if (!text || leaving) return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onSubmit(text)
      return
    }
    setLeaving(true)
    window.setTimeout(() => onSubmit(text), 260)
  }

  return (
    <main className={`ik${leaving ? ' ik--leaving' : ''}`}>
      <header className="ik__masthead">
        <span className="ik__logo" aria-hidden="true" />
      </header>

      <section className="ik__center">
        <h1 className="ik__title">{INTAKE.title}</h1>

        <div className="ik__prompt">
          <img className="ik__sparkle" src="/icon-big-sky.svg" alt="" width={22} height={22} />

          <label htmlFor="ik-intent" className="hf-sr">
            Describe what you want to make
          </label>
          <textarea
            id="ik-intent"
            className="ik__input"
            rows={2}
            placeholder={INTAKE.placeholder}
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
          />
          <Button
            className="ik__submit"
            variant="primary"
            icon={arrowUp}
            iconSize={18}
            onClick={submit}
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            label={INTAKE.cta}
          />
        </div>

        {/* Quiet inline detour for the decided/expert user — skip the assistant
            and open the "what are you building?" type-picker, which routes per
            intent (not straight to the site editor). The lead-in is plain muted
            text; only "Pick what you're building." is an interactive link. */}
        <p className="ik__skiprow">
          <span className="ik__skiplead">{INTAKE.skipLead}</span>{' '}
          <Button className="ik__skiplink" variant="link" onClick={onPickYourself}>
            {INTAKE.skipLink}
          </Button>
        </p>
      </section>

      {/* Method-level alternatives — a sticky-bottom card (real WP pattern).
          Visible-only: the wired demo path is the AI prompt above. */}
      <button type="button" className="ik__alt" aria-label={`${INTAKE.altTitle} ${INTAKE.altSub}`}>
        <span className="ik__alttext">
          <span className="ik__alttitle">{INTAKE.altTitle}</span>
          <span className="ik__altsub">{INTAKE.altSub}</span>
        </span>
        <span className="ik__altchevron" aria-hidden="true">
          <Icon icon={chevronRight} size={16} />
        </span>
      </button>
    </main>
  )
}
