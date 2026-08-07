import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CLARIFY,
  DISCOVERY,
  GOAL,
  type ChatMessage,
  type ClarifyQuestion,
  type ClarifyQuestionId,
} from './content'
import type { Thread } from './chatThread'
import { Button } from '@wordpress/components'
import { arrowUp, plus } from '@wordpress/icons'
import { AiMessage, UserMessage } from './Message'
import { IconCheck } from './icons'
import { useAutoGrow } from './useAutoGrow'

type QuestionKey = 'goals' | ClarifyQuestionId

// Sentinel key for the inline "Write your own…" row (Lovable style): the row is
// its own selection control + an inline text input. Its value is the typed text.
const OTHER = '__other__'

interface DiscoveryProps {
  // The shared, continuous thread (prompt + opener already seeded). Discovery
  // renders it full-screen as history and the editor later shows the same thread.
  thread: Thread
  // AI-read goal ids (detectGoals) — pre-checked on the goals question.
  initialGoals: string[]
  // AI-read clarify answers (detectMissing) — pre-selected on their questions and
  // marked "from your description" until the user changes them.
  prefilled: Partial<Record<ClarifyQuestionId, string>>
  onStartOver: () => void
  // Append an answered question (Q + chosen answer) to the shared thread as the
  // user advances — so the history above the composer grows.
  onAnswer: (key: QuestionKey, answer: string) => void
  // Finalize: the confirmed goals + resolved clarify answers → generation.
  onDone: (
    goalIds: string[],
    answers: { chipKey: string; value: string }[],
  ) => void
}

const DIMENSIONS = CLARIFY.questions

// Standalone FULL-SCREEN discovery CHAT (design spec, revision 3), the Lovable layout:
// a scrollable chat column showing the prompt + each answered Q&A pair as history,
// with the CURRENT question rendered as a widget floating just above a chat
// composer at the bottom. One question at a time (goals → size → goal → look),
// forward-only, with a visible "N of M" counter. Every question is pre-selected
// from the prompt where detected ("from your description"). The last option row is
// an INLINE "Write your own…" field (control + text input as one option). NOT
// inside the editor Shell; NO canvas. The thread here is the one the editor continues.
export function Discovery({
  thread,
  initialGoals,
  prefilled,
  onStartOver,
  onAnswer,
  onDone,
}: DiscoveryProps) {
  // Step 0 = goals; steps 1..3 map to DIMENSIONS[step - 1].
  const [step, setStep] = useState(0)
  const total = 1 + DIMENSIONS.length

  const [goals, setGoals] = useState<Set<string>>(() => new Set(initialGoals))
  const [answers, setAnswers] = useState<Record<ClarifyQuestionId, string | undefined>>(() => ({
    size: prefilled.size,
    goal: prefilled.goal,
    look: prefilled.look,
  }))
  // Which dimensions still hold the AI's guess (drives "from your description").
  const [aiFilled, setAiFilled] = useState<Set<ClarifyQuestionId>>(
    () => new Set(Object.keys(prefilled) as ClarifyQuestionId[]),
  )
  // The inline "Write your own…" text, per question key. For goals it's a free-form
  // note recorded alongside checked goals; for a dimension it's that dimension's
  // value when the "write your own" row is the selection.
  const [otherText, setOtherText] = useState<Record<QuestionKey, string>>({
    goals: '',
    size: '',
    goal: '',
    look: '',
  })
  // Composer stays a PLAIN chat input — never used to answer the widget.
  const [composer, setComposer] = useState('')

  // B7 — entrance: on first mount (arriving from Intake) the seeded messages
  // reveal ONE AFTER ANOTHER from the top, the composer slides up from below and
  // the widget descends. `revealCount` gates how many thread messages are shown;
  // `entered` flips the dock from its "arriving" transform to rest.
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const initialMsgCount = useRef(thread.messages.length).current
  const [revealCount, setRevealCount] = useState(reduceMotion ? initialMsgCount : 0)
  const [entered, setEntered] = useState(reduceMotion)

  // B8 — question switch: after Continue/Skip appends the Q&A, the answered widget
  // flies UP into the history and the next question rises IN from below. `switching`
  // gates the exit→enter swap so both halves of the motion play.
  const [switching, setSwitching] = useState(false)

  const threadRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)
  useAutoGrow(composerRef, composer)

  // B7 — drive the staggered entrance once, on mount. Reveal each seeded message
  // ~150ms apart (prompt → opener), then settle the dock (composer up, widget in).
  useEffect(() => {
    if (reduceMotion) return
    const timers: number[] = []
    for (let i = 1; i <= initialMsgCount; i++) {
      timers.push(window.setTimeout(() => setRevealCount(i), i * 150))
    }
    timers.push(window.setTimeout(() => setEntered(true), initialMsgCount * 150 + 40))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the newest message pinned into view: whenever the thread grows or the
  // question advances, scroll the history to the bottom so the user's latest
  // answer sits just above the current-question widget (never hidden behind it).
  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [thread.messages.length, step, revealCount])

  const isGoals = step === 0
  const dimension = isGoals ? null : DIMENSIONS[step - 1]
  const currentKey: QuestionKey = isGoals ? 'goals' : (dimension as ClarifyQuestion).id
  const currentOther = otherText[currentKey]

  const toggleGoal = (id: string) => {
    setGoals((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const chooseDimension = (id: ClarifyQuestionId, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setAiFilled((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  // Dimension: "write your own" is selected when the dimension value equals its
  // sentinel; the resolved value is the typed text. Mutually exclusive with presets.
  const dimOtherSelected = !isGoals && answers[currentKey as ClarifyQuestionId] === OTHER
  const selectDimOther = () => {
    if (isGoals) return
    const id = currentKey as ClarifyQuestionId
    // Toggle: clicking the control when already selected clears the selection.
    if (answers[id] === OTHER) chooseDimension(id, '')
    else chooseDimension(id, OTHER)
  }
  const setDimOtherText = (text: string) => {
    if (isGoals) return
    const id = currentKey as ClarifyQuestionId
    setOtherText((prev) => ({ ...prev, [id]: text }))
    // Typing auto-selects the row (mutually exclusive with presets).
    if (text) chooseDimension(id, OTHER)
  }

  const finish = (
    finalGoals: Set<string>,
    finalAnswers: Record<ClarifyQuestionId, string | undefined>,
    finalOther: Record<QuestionKey, string>,
  ) => {
    const goalIds = GOAL.options.filter((o) => finalGoals.has(o.id)).map((o) => o.id)
    const resolved = DIMENSIONS.filter((q) => finalAnswers[q.id]).map((q) => {
      const raw = finalAnswers[q.id] as string
      return { chipKey: q.chipKey, value: raw === OTHER ? finalOther[q.id] : raw }
    })
    onDone(goalIds, resolved)
  }

  // Record this question's Q&A into the shared thread, then advance (or finish).
  // B8 — play the widget swap: the answered widget flies UP (into the freshly
  // appended Q&A above), then the next question rises IN from below. On the final
  // question we finish immediately (no next widget to animate in).
  const advanceWith = (answerText: string) => {
    const isLast = step >= total - 1
    if (isLast) {
      onAnswer(currentKey, answerText)
      finish(goals, answers, otherText)
      return
    }
    if (reduceMotion) {
      onAnswer(currentKey, answerText)
      setStep((s) => s + 1)
      return
    }
    // Fly the current widget up (150ms), append the Q&A + swap to the next step,
    // then let the incoming widget rise from below via the enter transition.
    setSwitching(true)
    window.setTimeout(() => {
      onAnswer(currentKey, answerText)
      setStep((s) => s + 1)
      setSwitching(false)
    }, 200)
  }

  // The readable answer text for the current question, given its selections.
  const goalsAnswerText = () => {
    const titles = GOAL.options.filter((o) => goals.has(o.id)).map((o) => o.title)
    return titles.length ? titles.join(', ') : CLARIFY.skip
  }
  const dimensionAnswerText = (id: ClarifyQuestionId) => {
    const raw = answers[id]
    if (!raw) return DISCOVERY.skippedAnswer
    return raw === OTHER ? otherText[id].trim() : raw
  }

  // Continue — carry the current widget selection into the thread and forward.
  const onContinue = () => {
    if (isGoals) advanceWith(goalsAnswerText())
    else advanceWith(dimensionAnswerText(currentKey as ClarifyQuestionId))
  }

  // Skip — advance recording a skip, keeping the widget selection unset.
  const onSkip = () => advanceWith(DISCOVERY.skippedAnswer)

  // Composer is a plain chat input — a submit posts the typed text as a user turn
  // and advances the current question (never dead), but it does NOT drive the widget.
  const onComposerSubmit = () => {
    const text = composer.trim()
    if (!text) return
    setComposer('')
    advanceWith(text)
  }

  // Continue is ALWAYS visible; only its disabled state changes. Single-select:
  // enabled when an option is selected, but a "write your own" selection needs
  // non-empty text. Goals: ≥1 selected, and a lone "write your own" needs text.
  const canContinue = isGoals
    ? goals.size > 0
    : dimOtherSelected
      ? currentOther.trim().length > 0
      : Boolean(answers[currentKey as ClarifyQuestionId])

  return (
    <main className="dq">
      <header className="dq__masthead">
        <button
          type="button"
          className="dq__logo"
          aria-label="Start over"
          onClick={onStartOver}
        />
      </header>

      <section className="dq__chat">
        <div className="dq__history" ref={threadRef} aria-live="polite">
          {thread.messages.map((m: ChatMessage, i: number) => {
            // B7 — the staggered reveal applies ONLY to the initial entrance batch
            // (prompt + opener). Anything appended AFTER entrance (every Q&A pair)
            // renders immediately — the cap must never hide later messages.
            if (i < initialMsgCount && i >= revealCount) return null
            return (
              <div key={m.id} className="dq__reveal">
                {m.role === 'user' ? (
                  <UserMessage>{thread.bodies[m.id]}</UserMessage>
                ) : (
                  <AiMessage>{thread.bodies[m.id]}</AiMessage>
                )}
              </div>
            )
          })}
        </div>

        <div className={`dq__dock${entered ? ' dq__dock--in' : ''}`}>
          <div
            key={currentKey}
            className={`dq__widget${switching ? ' dq__widget--up' : ' dq__widget--enter'}`}
            role="group"
            aria-label="Current question"
          >
            <div className="dq__widgethead">
              <span className="dq__counter" aria-live="polite">
                {step + 1} of {total}
              </span>
              <Button className="dq__skip" variant="tertiary" onClick={onSkip}>
                {CLARIFY.skip}
              </Button>
            </div>

            {isGoals ? (
              <GoalsQuestion
                key="goals"
                heading={initialGoals.length > 0 ? DISCOVERY.goalsHeading : DISCOVERY.goalsHeadingCold}
                goals={goals}
                onToggle={toggleGoal}
              />
            ) : (
              <DimensionQuestion
                key={(dimension as ClarifyQuestion).id}
                question={dimension as ClarifyQuestion}
                value={answers[(dimension as ClarifyQuestion).id]}
                fromDescription={aiFilled.has((dimension as ClarifyQuestion).id)}
                otherSelected={dimOtherSelected}
                otherText={currentOther}
                onChoose={(v) => chooseDimension((dimension as ClarifyQuestion).id, v)}
                onSelectOther={selectDimOther}
                onOtherText={setDimOtherText}
              />
            )}

            <div className="dq__widgetfoot">
              <Button
                className="dq__continue"
                variant="primary"
                onClick={onContinue}
                disabled={!canContinue}
                aria-disabled={!canContinue}
              >
                {step >= total - 1 ? DISCOVERY.cta : GOAL.cta}
              </Button>
            </div>
          </div>

          {/* Reuse the editor's DS chat composer (AssistantPanel) verbatim —
              same input card, tokens, placeholder color, focus ring and circular
              send button. It stays a PLAIN chat input; the widget's inline
              "Write your own…" row is the free-text answer path, not this. */}
          <div className="hf-chat__inputcard">
            <label htmlFor="dq-composer" className="hf-sr">
              Ask the assistant anything
            </label>
            <textarea
              id="dq-composer"
              ref={composerRef}
              className="hf-chat__input"
              rows={2}
              placeholder={DISCOVERY.composerPlaceholder}
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onComposerSubmit()
                }
              }}
            />
            <div className="hf-chat__inputfooter">
              <div className="hf-chat__inputtools">
                <Button
                  className="hf-chat__attach"
                  icon={plus}
                  iconSize={18}
                  label="Add files or images"
                />
              </div>
              <Button
                className="hf-chat__submit"
                variant="primary"
                icon={arrowUp}
                label="Send message"
                onClick={onComposerSubmit}
                disabled={!composer.trim()}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// Goals — multi-select. role=group of role=checkbox rows, aria-checked reflects
// state, arrow keys move focus. The last row is an inline "Write your own…" field.
function GoalsQuestion({
  heading,
  goals,
  onToggle,
}: {
  heading: string
  goals: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <div className="dq__q">
      <h2 className="dq__question">{heading}</h2>
      <RowGroup
        role="group"
        ariaLabel={heading}
        checkbox
        items={GOAL.options.map((o) => ({
          key: o.id,
          title: o.title,
          desc: o.description,
          selected: goals.has(o.id),
          disabled: o.enabled === false,
          onSelect: () => onToggle(o.id),
        }))}
      />
    </div>
  )
}

// One clarify dimension — single-select (radio). The AI-detected answer is
// pre-selected and, until changed, gets a "from your description" note. The last
// row is an inline "Write your own…" field, mutually exclusive with the presets.
function DimensionQuestion({
  question,
  value,
  fromDescription,
  otherSelected,
  otherText,
  onChoose,
  onSelectOther,
  onOtherText,
}: {
  question: ClarifyQuestion
  value: string | undefined
  fromDescription: boolean
  otherSelected: boolean
  otherText: string
  onChoose: (value: string) => void
  onSelectOther: () => void
  onOtherText: (text: string) => void
}) {
  // Drop the canned "Other" preset — the inline row below is the free-text path.
  const options = question.options.filter((o) => o.value !== CLARIFY.otherValue)
  // Inline custom only on open-ended questions (main goal). Closed spectrums
  // (size, look) show presets only — no "Write your own…" row.
  const allowCustom = question.allowCustom === true
  return (
    <div className="dq__q">
      <h2 className="dq__question">{question.heading}</h2>
      {value && value !== OTHER && fromDescription ? (
        <p className="dq__note">{DISCOVERY.prefilledNote}</p>
      ) : null}
      <RowGroup
        role="radiogroup"
        ariaLabel={question.heading}
        checkbox={false}
        items={options.map((o) => ({
          key: o.value,
          title: o.label,
          selected: value === o.value,
          onSelect: () => onChoose(o.value),
        }))}
        other={
          allowCustom
            ? {
                selected: otherSelected,
                text: otherText,
                onToggle: onSelectOther,
                onText: onOtherText,
              }
            : undefined
        }
      />
    </div>
  )
}

interface RowItem {
  key: string
  title: string
  desc?: string
  selected: boolean
  disabled?: boolean
  onSelect: () => void
}

interface OtherRow {
  selected: boolean
  text: string
  onToggle: () => void
  onText: (text: string) => void
}

// A roving-tabindex row group (WP-assistant stacked rows). One tab stop; arrow
// keys move focus; Enter/Space selects. role=group + role=checkbox (multi) or
// role=radiogroup + role=radio (single); aria-checked reflects state. The trailing
// `other` row is an inline "Write your own…" field: its control + text input act
// as one option in the group.
function RowGroup({
  role,
  ariaLabel,
  checkbox,
  items,
  other,
}: {
  role: 'group' | 'radiogroup'
  ariaLabel: string
  checkbox: boolean
  items: RowItem[]
  // Inline "Write your own…" row — omitted on closed-spectrum questions.
  other?: OtherRow
}) {
  const [focusIndex, setFocusIndex] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const otherIndex = items.length
  const rowCount = items.length + (other ? 1 : 0)

  const activeIndex = useMemo(() => {
    if (role === 'radiogroup') {
      const sel = items.findIndex((i) => i.selected)
      if (sel !== -1) return sel
      if (other?.selected) return otherIndex
    }
    return Math.min(focusIndex, rowCount - 1)
  }, [items, focusIndex, role, other, otherIndex, rowCount])

  const move = (from: number, dir: 1 | -1) => {
    const next = (from + dir + rowCount) % rowCount
    setFocusIndex(next)
    refs.current[next]?.focus()
  }

  const rowRole = role === 'radiogroup' ? 'radio' : 'checkbox'

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
    <div className="dq__rows" role={role} aria-label={ariaLabel}>
      {items.map((item, i) => (
        <button
          key={item.key}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="button"
          role={rowRole}
          aria-checked={item.selected}
          aria-disabled={item.disabled || undefined}
          tabIndex={i === activeIndex ? 0 : -1}
          className={`dq__row${item.selected ? ' dq__row--on' : ''}${item.disabled ? ' dq__row--off' : ''}`}
          onClick={item.disabled ? undefined : item.onSelect}
          onFocus={() => setFocusIndex(i)}
          onKeyDown={onArrow(i)}
        >
          <span
            className={checkbox ? 'dq__check' : 'dq__radio'}
            aria-hidden="true"
          >
            {checkbox && item.selected ? <IconCheck size={13} /> : null}
          </span>
          <span className="dq__rowtext">
            <span className="dq__rowtitle">{item.title}</span>
            {item.desc ? <span className="dq__rowdesc">{item.desc}</span> : null}
          </span>
        </button>
      ))}

      {/* Inline "Write your own…" row — control + text input as one option. The
          control toggles selection; typing auto-selects and captures the value.
          Only rendered on open-ended questions (goals, main goal). */}
      {other ? (
        <div
          className={`dq__row dq__row--other${other.selected ? ' dq__row--on' : ''}`}
        >
          <button
            type="button"
            role={rowRole}
            aria-checked={other.selected}
            aria-label={DISCOVERY.otherLabel}
            tabIndex={otherIndex === activeIndex ? 0 : -1}
            ref={(el) => {
              refs.current[otherIndex] = el
            }}
            className="dq__otherctl"
            onClick={other.onToggle}
            onFocus={() => setFocusIndex(otherIndex)}
            onKeyDown={onArrow(otherIndex)}
          >
            <span
              className={checkbox ? 'dq__check' : 'dq__radio'}
              aria-hidden="true"
            >
              {checkbox && other.selected ? <IconCheck size={13} /> : null}
            </span>
          </button>
          <input
            type="text"
            className="dq__otherinput"
            placeholder={DISCOVERY.otherLabel}
            aria-label={DISCOVERY.otherLabel}
            value={other.text}
            onChange={(e) => other.onText(e.target.value)}
          />
        </div>
      ) : null}
    </div>
  )
}
