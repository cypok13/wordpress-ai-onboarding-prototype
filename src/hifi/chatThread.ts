import {
  buildGreeting,
  CLARIFY,
  DISCOVERY,
  DISCOVERY_QUESTION_PROMPTS,
  GOAL,
  type ChatMessage,
} from './content'

// One continuous assistant thread carried across Discovery → Generating → Editor.
// A message is the render token (id + role, as the editor ChatPanel expects); the
// body text lives in a parallel map so the existing `bodyOf` lookup keeps working.
export interface Thread {
  messages: ChatMessage[]
  bodies: Record<string, string>
}

// Stable ids so appends are idempotent across re-renders / re-entered states.
export const INTAKE_PROMPT_ID = 'intake-prompt'
export const CLARIFY_INTRO_ID = 'clarify-intro'
export const DISCOVERY_OPENER_ID = 'discovery-opener'
export const DISCOVERY_SUMMARY_ID = 'discovery-summary'
export const CLARIFY_CLOSING_ID = 'clarify-closing'
export const EDITOR_GREETING_ID = 'seed-1'

// Per-question ids for the discovery Q&A history (stable per question key).
export function discoveryQuestionId(key: string): string {
  return `discovery-q-${key}`
}
export function discoveryAnswerId(key: string): string {
  return `discovery-a-${key}`
}

export function emptyThread(): Thread {
  return {
    messages: [{ id: CLARIFY_INTRO_ID, role: 'ai' }],
    bodies: { [CLARIFY_INTRO_ID]: CLARIFY.intro },
  }
}

// The prompt seeds the thread, followed by the assistant's discovery opener. This
// is the SAME thread discovery renders full-screen and the editor later shows in
// its right rail — one continuous conversation, appended-to, never reset.
export function threadFromDiscoveryPrompt(prompt: string): Thread {
  return {
    messages: [
      { id: INTAKE_PROMPT_ID, role: 'user' },
      { id: DISCOVERY_OPENER_ID, role: 'ai' },
    ],
    bodies: {
      [INTAKE_PROMPT_ID]: prompt,
      [DISCOVERY_OPENER_ID]: DISCOVERY.opener,
    },
  }
}

// Append one answered discovery question to the shared thread as a Q&A pair: the
// question as an AI turn, the chosen answer as the user's turn. Called as the user
// advances through discovery, so the history above the composer accumulates.
export function appendDiscoveryQA(
  thread: Thread,
  key: 'goals' | 'size' | 'goal' | 'look',
  answer: string,
): Thread {
  const withQ = appendMessage(
    thread,
    discoveryQuestionId(key),
    'ai',
    DISCOVERY_QUESTION_PROMPTS[key],
  )
  return appendMessage(withQ, discoveryAnswerId(key), 'user', answer)
}

// The resolved discovery answers, written into the thread as ONE readable AI
// summary when the user hits Build — so the editor's right rail carries what was
// agreed (not a frozen per-turn transcript; the editable card WAS the record).
export function appendDiscoverySummary(
  thread: Thread,
  goalIds: string[],
  answers: { chipKey: string; value: string }[],
): Thread {
  const goalTitles = GOAL.options
    .filter((o) => goalIds.includes(o.id))
    .map((o) => o.title.replace(/^(Build a |Open an |Start a |Launch a |Create a )/, ''))
  const goalText =
    goalTitles.length === 0
      ? 'a website'
      : goalTitles.length === 1
        ? goalTitles[0]
        : `${goalTitles.slice(0, -1).join(', ')} and ${goalTitles[goalTitles.length - 1]}`
  const detailText = answers.map((a) => `${a.chipKey}: ${a.value}`).join(' · ')
  const body = detailText
    ? `Building ${goalText} — ${detailText}.`
    : `Building ${goalText}.`
  return appendMessage(thread, DISCOVERY_SUMMARY_ID, 'ai', body)
}

// Immutable append — returns a new thread, never mutates the input.
export function appendMessage(
  thread: Thread,
  id: string,
  role: ChatMessage['role'],
  body: string,
): Thread {
  if (thread.messages.some((m) => m.id === id)) return thread
  return {
    messages: [...thread.messages, { id, role }],
    bodies: { ...thread.bodies, [id]: body },
  }
}

export function appendClosing(thread: Thread): Thread {
  return appendMessage(thread, CLARIFY_CLOSING_ID, 'ai', CLARIFY.closing)
}

export function appendEditorGreeting(thread: Thread, goals: string[] = []): Thread {
  return appendMessage(thread, EDITOR_GREETING_ID, 'ai', buildGreeting(goals))
}
