import { useRef, useState } from 'react'
import { Snackbar } from '@wordpress/components'
import './hifi.css'
import { CHAT_INPUT_PLACEHOLDER, CHAT_SUGGESTIONS } from './content'
import { Canvas } from './Canvas'
import { BlockPanel } from './BlockPanel'
import { Discovery } from './Discovery'
import { Generating } from './Generating'
import { Shell } from './Shell'
import { SubPage } from './SubPage'
import type { AssistantPanelHandle } from './AssistantPanel'
import { Publish } from './Publish'
import { Intake } from './Intake'
import { TypeDestination, TypePicker } from './TypePicker'
import { useEditor } from './useEditor'
import { detectGoals, detectMissing, type BuildType } from './content'
import {
  appendClosing,
  appendDiscoveryQA,
  appendDiscoverySummary,
  appendEditorGreeting,
  emptyThread,
  threadFromDiscoveryPrompt,
  type Thread,
} from './chatThread'

type Step = 'intake' | 'typepicker' | 'typedest' | 'discovery' | 'generating' | 'editor' | 'publish'

// The clickable mini-flow (design spec, revision 3): intake (prompt, full-screen) →
// discovery (full-screen CHAT: history + question-widget-above-composer) →
// generating (full-screen, BLOCKING) → editor → claim. Intake, Discovery,
// Generating and Claim are standalone full-screen steps; only the Editor uses the
// persistent <Shell>.
//
// The thread is owned here and stays CONTINUOUS: the intake prompt seeds it, each
// discovery Q&A pair is appended as history, and the editor renders the very same
// thread in its right rail — never reset, only appended-to. The prompt also seeds
// discovery's pre-checked goals (detectGoals) and pre-selected clarify answers
// (detectMissing); the confirmed goals+answers compose the draft (subscribe block
// + greeting) and the editor's opening greeting.
export function Flow({ start = 'intake' }: { start?: Step }) {
  const [step, setStep] = useState<Step>(start)
  const [thread, setThread] = useState<Thread>(() => seedThread(start))
  // The typed prompt + the goals confirmed in discovery. Threaded down so the
  // draft composes from the combined intents.
  const [prompt, setPrompt] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  // The type chosen in the non-AI detour — drives which destination stub renders.
  // 'website' never lands here (it routes straight to the editor).
  const [destType, setDestType] = useState<Exclude<BuildType, 'website'>>('store')
  // Bumped on "start over" to force a clean remount of the persistent shell,
  // clearing all editor state and the seeded greeting.
  const [flowKey, setFlowKey] = useState(0)

  const updateThread = (updater: (t: Thread) => Thread) => setThread(updater)

  // Open the blank site editor with the default draft — no discovery answers, no
  // goals (so no Subscribe block), seeding the same closing + default greeting as a
  // direct editor deep-link. Shared by the "Website" non-AI route.
  const openBlankEditor = () => {
    setPrompt('')
    setGoals([])
    setThread(seedThread('editor'))
    setStep('editor')
  }

  // WP logo → return to the start of the flow (the prompt), fresh.
  const startOver = () => {
    setThread(emptyThread())
    setPrompt('')
    setGoals([])
    setFlowKey((k) => k + 1)
    setStep('intake')
  }

  if (step === 'intake') {
    return (
      <Intake
        onSubmit={(intent) => {
          setPrompt(intent)
          setGoals(detectGoals(intent))
          setThread(threadFromDiscoveryPrompt(intent))
          setStep('discovery')
        }}
        // Non-AI detour: skip the assistant and open the "what are you building?"
        // type-picker, which routes per intent (website → editor, others → stub).
        onPickYourself={() => setStep('typepicker')}
      />
    )
  }
  if (step === 'typepicker') {
    return (
      <TypePicker
        onBack={() => setStep('intake')}
        // Single click routes. Website lands in the blank site editor (the old
        // skip-to-editor path, reused exactly); the others go to their stub.
        onPick={(type) => {
          if (type === 'website') {
            openBlankEditor()
            return
          }
          setDestType(type)
          setStep('typedest')
        }}
      />
    )
  }
  if (step === 'typedest') {
    return <TypeDestination type={destType} onBack={() => setStep('typepicker')} />
  }
  if (step === 'discovery') {
    return (
      <Discovery
        key={flowKey}
        thread={thread}
        initialGoals={detectGoals(prompt)}
        prefilled={detectMissing(prompt)}
        onStartOver={startOver}
        // Each answered question appends its Q&A pair to the SHARED thread — the
        // history the user scrolls above the composer, carried into the editor.
        onAnswer={(key, answer) => setThread((t) => appendDiscoveryQA(t, key, answer))}
        // Finalized intent: record the confirmed goals, write the resolved summary
        // + closing into the same thread, then move to the blocking generation.
        onDone={(goalIds, answers) => {
          setGoals(goalIds)
          setThread((t) => appendClosing(appendDiscoverySummary(t, goalIds, answers)))
          setStep('generating')
        }}
      />
    )
  }
  if (step === 'generating') {
    // Full-screen BLOCKING generation: no chat, no composer, no navigation. When
    // the stages finish, append the editor greeting to the same thread and open
    // the editor — the right rail already carries the full discovery history.
    return (
      <Generating
        key={flowKey}
        onStartOver={startOver}
        onDone={() => {
          setThread((t) => appendEditorGreeting(t, goals))
          setStep('editor')
        }}
      />
    )
  }
  if (step === 'publish') {
    // The Publish paywall flexes by the goals carried from discovery — presence
    // (default) or newsletter (if the 'newsletter' goal is present). A `?intent=`
    // override forces a variant for demo determinism (read inside Publish).
    return <Publish onBack={() => setStep('editor')} goals={goals} />
  }

  return (
    <ShellFlow
      key={flowKey}
      thread={thread}
      goals={goals}
      updateThread={updateThread}
      onLaunch={() => setStep('publish')}
      onStartOver={startOver}
    />
  )
}

// The editor shell. Generation is now its own full-screen blocking step, so the
// shell owns only the editor stage: canvas (left) + the persistent AssistantPanel
// (right) rendering the continued thread — the full discovery history + greeting.
function ShellFlow({
  thread,
  goals,
  updateThread,
  onLaunch,
  onStartOver,
}: {
  thread: Thread
  goals: string[]
  updateThread: (updater: (t: Thread) => Thread) => void
  onLaunch: () => void
  onStartOver: () => void
}) {
  const panelRef = useRef<AssistantPanelHandle>(null)

  const editor = useEditor(updateThread, true, goals)

  const canvas =
    editor.currentPage === 'home' ? (
      <Canvas
        doc={editor.doc}
        selected={editor.selected}
        hovered={editor.hovered}
        editing={editor.editing}
        onSelect={editor.setSelected}
        onEditText={editor.startEdit}
        onCommitEdit={editor.commitEdit}
        onHoverBlock={editor.hoverBlock}
        onUnhoverBlock={editor.unhoverBlock}
        onDeselect={editor.deselectAll}
        actionsFor={editor.actionsFor}
      />
    ) : (
      <SubPage page={editor.currentPage} />
    )

  return (
    <Shell
      ref={panelRef}
      canvas={canvas}
      thread={thread}
      thinking={editor.thinking}
      inputPlaceholder={CHAT_INPUT_PLACEHOLDER}
      onSend={editor.sendMessage}
      suggestions={CHAT_SUGGESTIONS}
      inputDisabled={false}
      sidebarTab={editor.sidebarTab}
      onTabChange={editor.setSidebarTab}
      showBlockTab
      block={
        <BlockPanel blockId={editor.selected} />
      }
      currentPage={editor.currentPage}
      onSelectPage={editor.goToPage}
      canUndo={editor.canUndo}
      canRedo={editor.canRedo}
      onUndo={editor.doUndo}
      onRedo={editor.doRedo}
      launchDisabled={false}
      onLaunch={onLaunch}
      onStartOver={onStartOver}
      announce={editor.announce}
      extras={
        editor.toast ? (
          <div className="hf-snackbar-slot">
            <Snackbar
              onDismiss={() => editor.setToast(null)}
              actions={
                editor.toast.onUndo
                  ? [
                      {
                        label: 'Undo',
                        onClick: () => {
                          editor.toast?.onUndo?.()
                          editor.setToast(null)
                        },
                      },
                    ]
                  : []
              }
            >
              {editor.toast.message}
            </Snackbar>
          </div>
        ) : null
      }
    />
  )
}

// When the flow starts mid-way (deep link), pre-fill the thread so the persisted
// history still reads as one conversation rather than starting empty.
function seedThread(start: Step): Thread {
  let t = emptyThread()
  if (start === 'generating' || start === 'editor' || start === 'publish') {
    t = appendClosing(t)
  }
  if (start === 'editor' || start === 'publish') {
    // Deep-link seeds have no confirmed goals → the default website-only greeting.
    t = appendEditorGreeting(t, [])
  }
  return t
}
