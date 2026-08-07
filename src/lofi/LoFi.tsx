import { useEffect, useRef, useState } from 'react'
import './lofi.css'
import { COPY, HERO_TONE_VARIANTS, INITIAL_SECTIONS } from './copy'
import type { SectionData, SectionId, Tone } from './copy'
import { SectionCard } from './SectionCard'
import type { Provenance } from './SectionCard'
import { AssistantPanel } from './AssistantPanel'
import { LaunchModal } from './LaunchModal'
import { IntakeScreen } from './IntakeScreen'
import { IntentPanel } from './IntentPanel'
import { IntentBar } from './IntentBar'
import type { IntentObject } from './intent'

type Phase = 'intake' | 'streaming' | 'draft' | 'success'

const DEFAULT_TEXT: Record<SectionId, string> = {
  hero: 'Bold headline',
  about: 'About paragraph — one or two short lines in your brand voice.',
  services: 'Three services, each a title and a one-line description.',
  contact: '',
  gallery: '',
}

interface SectionState {
  provenance: Provenance
  text: string
  regenerating: boolean
  errored: boolean
  previousText: string | null
}

function initSectionState(sections: SectionData[]): Record<string, SectionState> {
  return Object.fromEntries(
    sections.map((s) => [
      s.id,
      {
        provenance: 'ai' as Provenance,
        text: DEFAULT_TEXT[s.id],
        regenerating: false,
        errored: false,
        previousText: null,
      },
    ]),
  )
}

export function LoFi() {
  const [phase, setPhase] = useState<Phase>('intake')
  const [intent, setIntent] = useState<IntentObject | null>(null)
  const [milestonesDone, setMilestonesDone] = useState(0)
  const [sections] = useState<SectionData[]>(INITIAL_SECTIONS)
  const [sectionState, setSectionState] = useState(() => initSectionState(INITIAL_SECTIONS))
  const [selected, setSelected] = useState<SectionId | null>(null)
  const [hintDismissed, setHintDismissed] = useState(false)
  const [globalRefreshing, setGlobalRefreshing] = useState(false)
  const [showRefreshConfirm, setShowRefreshConfirm] = useState(false)
  const [showLaunch, setShowLaunch] = useState(false)
  const [messageCap, setMessageCap] = useState(false)
  const [tone, setTone] = useState<Tone>('Calm')
  const [heroSubhead, setHeroSubhead] = useState(HERO_TONE_VARIANTS.Calm.subhead)
  const [heroPrevTone, setHeroPrevTone] = useState<{
    tone: Tone
    headline: string
    subhead: string
    provenance: Provenance
  } | null>(null)
  const timers = useRef<number[]>([])

  // Streaming → draft, auto-advance with milestone announcements
  useEffect(() => {
    if (phase !== 'streaming') return
    const ids: number[] = []
    COPY.milestones.forEach((_, i) => {
      ids.push(window.setTimeout(() => setMilestonesDone(i + 1), 700 * (i + 1)))
    })
    ids.push(window.setTimeout(() => setPhase('draft'), 700 * (COPY.milestones.length + 1)))
    timers.current = ids
    return () => ids.forEach(window.clearTimeout)
  }, [phase])

  const editedCount = Object.values(sectionState).filter((s) => s.provenance === 'edited').length

  const updateSection = (id: SectionId, patch: Partial<SectionState>) => {
    setSectionState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  const commitEdit = (id: SectionId, value: string) => {
    updateSection(id, { text: value, provenance: 'edited' })
    setSelected(null)
    setHintDismissed(true)
  }

  const regenerate = (id: SectionId) => {
    setHintDismissed(true)
    updateSection(id, { regenerating: true, previousText: sectionState[id].text })
    const t = window.setTimeout(() => updateSection(id, { regenerating: false }), 4000)
    timers.current.push(t)
  }

  const undoRegenerate = (id: SectionId) => {
    const prev = sectionState[id].previousText
    updateSection(id, {
      regenerating: false,
      ...(prev !== null ? { text: prev } : {}),
      previousText: null,
    })
  }

  const triggerError = (id: SectionId) => {
    updateSection(id, { errored: true })
    // move focus to the alert (WAI-ARIA / doc E)
    const t = window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>('.lf-alert[tabindex]')
      el?.focus()
    }, 0)
    timers.current.push(t)
  }

  const clearError = (id: SectionId) => updateSection(id, { errored: false })

  const writeItYourself = (id: SectionId) => {
    updateSection(id, { errored: false, text: '', provenance: 'edited' })
    setSelected(id)
  }

  const refreshAll = () => {
    if (editedCount >= 1) {
      setShowRefreshConfirm(true)
      return
    }
    runGlobalRefresh()
  }

  const runGlobalRefresh = () => {
    setShowRefreshConfirm(false)
    setGlobalRefreshing(true)
    const t = window.setTimeout(() => setGlobalRefreshing(false), 1500)
    timers.current.push(t)
  }

  const keepEditsRefresh = () => {
    setShowRefreshConfirm(false)
    setGlobalRefreshing(true)
    const t = window.setTimeout(() => setGlobalRefreshing(false), 1500)
    timers.current.push(t)
  }

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const startGeneration = (chosen: IntentObject) => {
    setIntent(chosen)
    setMilestonesDone(0)
    // Seed the Hero from the calm tone variant so the draft opens as an AI draft.
    const calm = HERO_TONE_VARIANTS.Calm
    setTone('Calm')
    setHeroSubhead(calm.subhead)
    setHeroPrevTone(null)
    updateSection('hero', { text: calm.headline, provenance: 'ai', previousText: null })
    setPhase('streaming')
  }

  const changeTone = () => {
    const next: Tone = tone === 'Calm' ? 'Energetic' : 'Calm'
    const variant = HERO_TONE_VARIANTS[next]
    // Snapshot the current Hero so Undo is fully non-destructive.
    setHeroPrevTone({
      tone,
      headline: sectionState.hero.text,
      subhead: heroSubhead,
      provenance: sectionState.hero.provenance,
    })
    setTone(next)
    setHeroSubhead(variant.subhead)
    updateSection('hero', { text: variant.headline, provenance: 'edited' })
    setHintDismissed(true)
  }

  const undoTone = () => {
    if (!heroPrevTone) return
    setTone(heroPrevTone.tone)
    setHeroSubhead(heroPrevTone.subhead)
    updateSection('hero', {
      text: heroPrevTone.headline,
      provenance: heroPrevTone.provenance,
    })
    setHeroPrevTone(null)
  }

  // ---- Intake (first state) ----
  if (phase === 'intake') {
    return (
      <div className="lofi">
        <TopBar onLaunch={() => {}} launchDisabled />
        <IntakeScreen onGenerate={startGeneration} onIntentChange={setIntent} />
        <IntentPanel intent={intent} />
      </div>
    )
  }

  // ---- Success ----
  if (phase === 'success') {
    return (
      <div className="lofi">
        <TopBar onLaunch={() => {}} />
        <div style={{ padding: 40, maxWidth: 520 }}>
          <div className="lf-section" role="status">
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>{COPY.launchSuccess}</h2>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="button" className="lf-btn lf-btn--strong">
                Visit your site
              </button>
              <button
                type="button"
                className="lf-btn"
                onClick={() => setPhase('draft')}
              >
                Keep editing
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const streaming = phase === 'streaming'

  return (
    <div className="lofi">
      <TopBar onLaunch={() => setShowLaunch(true)} launchDisabled={streaming} />

      <div className="lf-shell">
        <main
          className={`lf-canvas${globalRefreshing ? ' lf-canvas--dim' : ''}`}
          aria-label="Draft canvas"
        >
          {globalRefreshing && (
            <div className="lf-status" role="status" aria-live="polite">
              {COPY.disabledRefresh}
            </div>
          )}

          {streaming ? (
            <StreamingCanvas />
          ) : (
            <>
              {!hintDismissed && (
                <div className="lf-hint">
                  <span>{COPY.firstRunHint}</span>
                  <button
                    type="button"
                    className="lf-btn lf-btn--icon lf-hint__x"
                    aria-label="Dismiss hint"
                    onClick={() => setHintDismissed(true)}
                  >
                    ×
                  </button>
                </div>
              )}

              {intent && (
                <IntentBar
                  intent={intent}
                  tone={tone}
                  onToggleTone={changeTone}
                  onUndoTone={undoTone}
                  toneEdited={heroPrevTone !== null}
                />
              )}

              <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                <button type="button" className="lf-btn" onClick={refreshAll}>
                  ↻ Refresh site
                </button>
              </div>

              {sections.map((s) => (
                <SectionCard
                  key={s.id}
                  section={s}
                  provenance={sectionState[s.id].provenance}
                  text={sectionState[s.id].text}
                  selected={selected === s.id}
                  regenerating={sectionState[s.id].regenerating}
                  errored={sectionState[s.id].errored}
                  onSelect={() => setSelected(selected === s.id ? null : s.id)}
                  onCommitEdit={(v) => commitEdit(s.id, v)}
                  onRegenerate={() => regenerate(s.id)}
                  onUndoRegenerate={() => undoRegenerate(s.id)}
                  onRetry={() => clearError(s.id)}
                  onErrorRetry={() => clearError(s.id)}
                  onWriteItYourself={() => writeItYourself(s.id)}
                  sells={s.id === 'hero' ? intent?.sells : undefined}
                  heroSubhead={s.id === 'hero' ? heroSubhead : undefined}
                />
              ))}

              <p className="lf-transfer">{COPY.controlTransfer}</p>
            </>
          )}
        </main>

        <AssistantPanel
          streaming={streaming}
          milestonesDone={milestonesDone}
          messageCap={messageCap}
          onUpgrade={() => setMessageCap(false)}
        />
      </div>

      {/* streaming-complete polite announcement (I-5) */}
      {!streaming && (
        <span className="lf-sr" role="status" aria-live="polite" aria-atomic="true">
          {COPY.streamingComplete}
        </span>
      )}

      {/* Debug affordances — reach the harder-to-trigger states */}
      {!streaming && (
        <div className="lf-debug">
          <span className="lf-debug__label">Debug:</span>
          <button
            type="button"
            className="lf-btn lf-btn--icon"
            onClick={() => triggerError('services')}
          >
            Simulate error (Services)
          </button>
          <button
            type="button"
            className="lf-btn lf-btn--icon"
            onClick={() => setMessageCap(true)}
          >
            Hit message cap
          </button>
          <button
            type="button"
            className="lf-btn lf-btn--icon"
            onClick={() => {
              setPhase('streaming')
              setMilestonesDone(0)
            }}
          >
            Replay streaming
          </button>
          <span>edited sections: {editedCount}</span>
        </div>
      )}

      {showRefreshConfirm && (
        <div className="lf-overlay" role="dialog" aria-modal="true" aria-label={COPY.refreshAllTitle}>
          <div className="lf-modal">
            <h2>{COPY.refreshAllTitle}</h2>
            <p>
              You've edited {editedCount} section{editedCount === 1 ? '' : 's'}. Refresh
              everything, or keep your edits and only redo the AI ones?
            </p>
            <div className="lf-modal__actions">
              <button type="button" className="lf-btn lf-btn--strong" onClick={keepEditsRefresh}>
                Keep my edits
              </button>
              <button type="button" className="lf-btn" onClick={runGlobalRefresh}>
                Refresh all
              </button>
            </div>
          </div>
        </div>
      )}

      {showLaunch && (
        <LaunchModal
          onClose={() => setShowLaunch(false)}
          onLaunched={() => {
            setShowLaunch(false)
            setPhase('success')
          }}
        />
      )}

      <IntentPanel intent={intent} />
    </div>
  )
}

function TopBar({
  onLaunch,
  launchDisabled = false,
}: {
  onLaunch: () => void
  launchDisabled?: boolean
}) {
  return (
    <header className="lf-topbar">
      <span className="lf-logo" aria-label="Logo placeholder">
        W
      </span>
      <button type="button" className="lf-btn lf-btn--icon lf-btn--ghost" aria-label="Undo">
        undo
      </button>
      <button type="button" className="lf-btn lf-btn--icon lf-btn--ghost" aria-label="Redo">
        redo
      </button>
      <span className="lf-topbar__spacer" />
      <button type="button" className="lf-btn">
        Save
      </button>
      <button
        type="button"
        className="lf-btn lf-btn--strong"
        onClick={onLaunch}
        disabled={launchDisabled}
      >
        Launch
      </button>
    </header>
  )
}

function StreamingCanvas() {
  return (
    <div aria-label="Site building">
      <div className="lf-section">
        <div className="lf-section__label">Hero</div>
        <div className="lf-skel lf-skel--title" />
        <div className="lf-skel lf-skel--wide" />
        <div className="lf-imgbox">image</div>
      </div>
      <div className="lf-section">
        <div className="lf-section__label">About</div>
        <div className="lf-skel lf-skel--wide" />
        <div className="lf-skel lf-skel--mid" />
      </div>
      <div className="lf-section">
        <div className="lf-section__label">Services</div>
        <div className="lf-skel lf-skel--block" />
      </div>
    </div>
  )
}
