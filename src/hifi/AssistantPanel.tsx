import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Button } from '@wordpress/components'
import { arrowUp, plus } from '@wordpress/icons'
import { GREETING_PAGE_CHIPS, type ChatMessage, type PageId } from './content'
import { EDITOR_GREETING_ID, type Thread } from './chatThread'
import { AiMessage, UserMessage } from './Message'
import { useAutoGrow } from './useAutoGrow'

// Imperative handle so the Clarify "Other" flow can focus the single shared
// chat input (the sole text-entry surface across all stages).
export interface AssistantPanelHandle {
  focusInput: () => void
}

interface AssistantPanelProps {
  thread: Thread
  thinking: boolean
  inputPlaceholder: string
  onSend: (text: string) => void
  // Editor-only suggested prompts (omit during Discovery/Generating).
  suggestions?: readonly string[]
  // Disable the input while discovery/generation own the interaction (the
  // discovery card in the centre is the input surface for that stage).
  inputDisabled?: boolean
  // Editor-only: makes the page names in the opening greeting clickable, so the
  // message that promises five pages can actually reach them.
  pageChips?: { current: PageId; onSelect: (page: PageId) => void }
}

// The ONE assistant panel. A single instance stays mounted across Discovery →
// Generating → Editor; only its props change. It renders the shared thread with
// the SAME message component everywhere and a single "Ask anything…" input at the
// bottom — the editor's text-entry surface.
export const AssistantPanel = forwardRef<AssistantPanelHandle, AssistantPanelProps>(
  function AssistantPanel(
    {
      thread,
      thinking,
      inputPlaceholder,
      onSend,
      suggestions,
      inputDisabled = false,
      pageChips,
    },
    ref,
  ) {
    const [draft, setDraft] = useState('')
    const threadRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    useAutoGrow(inputRef, draft)

    useImperativeHandle(ref, () => ({
      focusInput: () => inputRef.current?.focus(),
    }))

    // Keep the newest message in view as the thread grows or the assistant thinks.
    useEffect(() => {
      const el = threadRef.current
      if (el) el.scrollTop = el.scrollHeight
    }, [thread.messages.length, thinking])

    const submit = () => {
      if (inputDisabled) return
      const text = draft.trim()
      if (!text) return
      onSend(text)
      setDraft('')
    }

    return (
      <div className="hf-chatbody">
        <div className="hf-chat__thread" ref={threadRef} aria-live="polite">
          {thread.messages.map((m: ChatMessage) =>
            m.role === 'user' ? (
              <UserMessage key={m.id}>{thread.bodies[m.id]}</UserMessage>
            ) : (
              <AiMessage key={m.id}>
                {m.id === EDITOR_GREETING_ID && pageChips
                  ? withPageChips(thread.bodies[m.id], pageChips)
                  : thread.bodies[m.id]}
              </AiMessage>
            ),
          )}

          {thinking && (
            <div className="hf-msg hf-msg--ai" role="status" aria-label="Thinking…">
              <div className="hf-thinking" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        {suggestions && suggestions.length > 0 && (
          <div className="hf-chat__suggestions" aria-label="Suggested prompts">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="hf-suggest"
                onClick={() => onSend(s)}
                disabled={thinking}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="hf-chat__inputcard">
          <label htmlFor="hf-chat-input" className="hf-sr">
            Tell the assistant what to change
          </label>
          <textarea
            id="hf-chat-input"
            ref={inputRef}
            className="hf-chat__input"
            rows={2}
            placeholder={inputPlaceholder}
            value={draft}
            disabled={inputDisabled}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
          />
          <div className="hf-chat__inputfooter">
            <div className="hf-chat__inputtools">
              {/* A "Build ▾" pill used to sit here, carried over from the real
                  composer without a defined job. Removed rather than given an
                  invented one: an unexplained control contradicts the flow's own
                  argument. */}
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
              onClick={submit}
              disabled={!draft.trim() || thinking || inputDisabled}
            />
          </div>
        </div>
      </div>
    )
  },
)

// Turns the page names the greeting promises into chips that switch the canvas —
// the same action the palette rows run. Everything else stays plain text.
// The page names in the greeting are plain inline links, not chips: this is a
// sentence mentioning pages, not a navigation control, so it should not carry
// selected/unselected state. The DS link Button is the same affordance the rest
// of the product uses for inline navigation.
function withPageChips(
  text: string,
  { onSelect }: { current: PageId; onSelect: (page: PageId) => void },
): ReactNode[] {
  const pattern = new RegExp(`\\b(${GREETING_PAGE_CHIPS.map((c) => c.word).join('|')})\\b`, 'g')
  const out: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const link = GREETING_PAGE_CHIPS.find((c) => c.word === match?.[0])
    if (!link) continue
    if (match.index > last) out.push(text.slice(last, match.index))
    // An anchor, not a DS Button: a <button> is an atomic inline box, so the
    // punctuation after it becomes a line-break opportunity and commas wrap onto
    // the next line. It also is a link — it navigates.
    const page = link.page
    out.push(
      <a
        key={`${page}-${match.index}`}
        href={`?page=${page}`}
        className="components-button is-link hf-pagelink"
        onClick={(e) => {
          e.preventDefault()
          onSelect(page)
        }}
      >
        {match[0]}
      </a>,
    )
    last = match.index + match[0].length
  }
  out.push(text.slice(last))
  return out
}
