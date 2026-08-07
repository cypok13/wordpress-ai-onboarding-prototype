import { useEffect, useRef, useState } from 'react'
import {
  BLOCK_LABELS,
  matchIntent,
  pageTitle,
  scopedAskReply,
  type BlockId,
  type PageId,
  type RewriteOption,
  type Tone,
} from './content'
import { appendMessage, type Thread } from './chatThread'
import {
  applyAboutEdit,
  applyAboutShorten,
  applyAddTestimonials,
  applyDeleteBlock,
  applyHeroEdit,
  applyMoveBlock,
  applyRestoreBlock,
  applyTone,
  canRedo,
  canUndo,
  current,
  initialDoc,
  initialHistory,
  push,
  redo,
  undo,
  type DocState,
  type History,
} from './state'
import type { BlockActions } from './BlockFrame'
import type { SidebarTab } from './Sidebar'

const THINKING_MS = 700

export interface Toast {
  message: string
  onUndo?: () => void
}

// All editor state + handlers, extracted from the old HiFi component so Flow can
// drive the persistent Shell in the editor stage without mounting a second
// shell. `active` gates the effects/thinking so the editor stays inert until its
// stage is reached (the hook is always called — hooks can't be conditional).
export function useEditor(
  updateThread: (updater: (t: Thread) => Thread) => void,
  active: boolean,
  goals: string[] = [],
) {
  const [history, setHistory] = useState<History>(() => initialHistory(initialDoc(goals)))
  const [selected, setSelected] = useState<BlockId | null>(null)

  // The shell mounts at Discovery, before the goals are finalized on the card, so
  // the lazy `initialDoc(goals)` above captures only the pre-detected goals. When
  // the editor first becomes active the goals are final — rebuild the draft once
  // from them so the composed sections (e.g. the Subscribe block for a newsletter
  // goal) are present.
  const seeded = useRef(false)
  useEffect(() => {
    if (active && !seeded.current) {
      seeded.current = true
      setHistory(initialHistory(initialDoc(goals)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
  // Which page of the draft the canvas shows. Kept OUT of the document history:
  // navigating between pages is not a document edit, so undo must not rewind it.
  const [currentPage, setCurrentPage] = useState<PageId>('home')
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('assistant')
  const [editing, setEditing] = useState<'hero' | 'about' | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [announce, setAnnounce] = useState('')
  const [thinking, setThinking] = useState(false)

  const [hovered, setHovered] = useState<BlockId | null>(null)
  const hoverCloseTimer = useRef<number | undefined>(undefined)

  const doc = current(history)

  const hoverBlock = (id: BlockId) => {
    window.clearTimeout(hoverCloseTimer.current)
    setHovered(id)
  }
  const unhoverBlock = () => {
    window.clearTimeout(hoverCloseTimer.current)
    hoverCloseTimer.current = window.setTimeout(() => setHovered(null), 150)
  }
  useEffect(() => () => window.clearTimeout(hoverCloseTimer.current), [])

  useEffect(() => {
    if (selected === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selected])

  useEffect(() => {
    // Selecting a block opens the Block tab; deselecting returns to Assistant.
    setSidebarTab(selected !== null ? 'block' : 'assistant')
  }, [selected])

  const deselectAll = () => setSelected(null)

  const goToPage = (page: PageId) => {
    setSelected(null)
    setEditing(null)
    setCurrentPage(page)
    setAnnounce(`Now editing the ${pageTitle(page)} page.`)
  }

  const commit = (label: string, nextDoc: DocState, message?: string) => {
    setHistory((h) => push(h, label, nextDoc))
    if (message) setAnnounce(message)
  }

  const startEdit = (id: 'hero' | 'about') => {
    setSelected(id)
    setEditing(id)
  }

  const commitEdit = (id: 'hero' | 'about', value: string) => {
    setEditing(null)
    if (!value) return
    const currentText = id === 'hero' ? doc.heroHeadline : doc.aboutBody
    if (value === currentText) return
    const nextDoc = id === 'hero' ? applyHeroEdit(doc, value) : applyAboutEdit(doc, value)
    commit(`Edit ${id} text`, nextDoc, `${id === 'hero' ? 'Hero' : 'About'} text updated.`)
  }

  const doUndo = () => {
    if (!canUndo(history)) return
    setHistory((h) => undo(h))
    setEditing(null)
    setAnnounce('Change undone')
  }

  const doRedo = () => {
    if (!canRedo(history)) return
    setHistory((h) => redo(h))
    setAnnounce('Change redone')
  }

  const changeTone = (tone: Tone) => {
    if (tone === doc.tone) {
      setToast({ message: `Already in a ${tone} tone` })
      return
    }
    commit(`Tone → ${tone}`, applyTone(doc, tone), `Tone changed to ${tone}. Hero and About updated.`)
    setToast({ message: `Tone changed to ${tone}`, onUndo: doUndo })
  }

  const rewrite = (id: BlockId, option: RewriteOption) => {
    if (id === 'about' && option === 'Shorter') {
      commit('Shorten About', applyAboutShorten(doc), 'About text shortened')
      setToast({ message: 'About text shortened', onUndo: doUndo })
      return
    }
    setToast({ message: `“${option}” isn’t wired in this prototype` })
  }

  const replaceImage = () => {
    setToast({ message: 'Image swap isn’t wired in this prototype.' })
  }

  const duplicate = () => {
    setToast({ message: 'Duplicating a block isn’t wired in this prototype.' })
  }

  const moveBlock = (id: BlockId, dir: 'up' | 'down') => {
    const next = applyMoveBlock(doc, id, dir)
    if (next === doc) return
    const label = BLOCK_LABELS[id]
    commit(`Move ${label} ${dir}`, next, `${label} block moved ${dir}.`)
    setToast({ message: `${label} moved ${dir}`, onUndo: doUndo })
  }

  const deleteBlock = (id: BlockId) => {
    commit(`Delete ${BLOCK_LABELS[id]}`, applyDeleteBlock(doc, id))
    setAnnounce(`${BLOCK_LABELS[id]} block deleted`)
    setSelected(null)
    setToast({
      message: `${BLOCK_LABELS[id]} block deleted`,
      onUndo: () => {
        setHistory((h) => push(h, `Restore ${BLOCK_LABELS[id]}`, applyRestoreBlock(current(h), id)))
        setAnnounce(`${BLOCK_LABELS[id]} block restored.`)
      },
    })
  }

  const askAi = (id: BlockId, request: string) => {
    if (thinking) return
    const label = BLOCK_LABELS[id]
    const userId = `u-${Date.now()}`
    updateThread((t) => appendMessage(t, userId, 'user', `${label} → ${request}`))
    setThinking(true)
    window.setTimeout(() => {
      const aiId = `a-${Date.now()}`
      updateThread((t) => appendMessage(t, aiId, 'ai', scopedAskReply(label, request)))
      setThinking(false)
      setAnnounce(`${label} block updated.`)
    }, THINKING_MS)
  }

  const actionsFor = (id: BlockId): BlockActions => ({
    onAskAi: (request) => askAi(id, request),
    onRewrite: (option) => rewrite(id, option),
    onChangeTone: (tone) => changeTone(tone),
    onReplaceImage: replaceImage,
    onDuplicate: duplicate,
    onMoveUp: () => moveBlock(id, 'up'),
    onMoveDown: () => moveBlock(id, 'down'),
    onDelete: () => deleteBlock(id),
  })

  const sendMessage = (text: string) => {
    if (thinking) return
    const userId = `u-${Date.now()}`
    updateThread((t) => appendMessage(t, userId, 'user', text))
    setThinking(true)

    const { action, reply } = matchIntent(text)

    window.setTimeout(() => {
      if (action.kind === 'tone' && action.tone !== doc.tone) {
        commit(
          `Tone → ${action.tone}`,
          applyTone(doc, action.tone),
          `Tone changed to ${action.tone}. Hero and About updated.`,
        )
      } else if (action.kind === 'shorten-about') {
        commit('Shorten About', applyAboutShorten(doc), 'About text shortened')
      } else if (action.kind === 'add-testimonials' && !doc.testimonialsAdded) {
        commit(
          'Add testimonials',
          applyAddTestimonials(doc),
          'Testimonials section added after the schedule.',
        )
      }

      const aiId = `a-${Date.now()}`
      updateThread((t) => appendMessage(t, aiId, 'ai', reply))
      setThinking(false)
    }, THINKING_MS)
  }

  return {
    doc,
    history,
    selected,
    setSelected,
    currentPage,
    goToPage,
    sidebarTab,
    setSidebarTab,
    editing,
    hovered,
    toast,
    setToast,
    announce: active ? announce : '',
    thinking: active ? thinking : false,
    canUndo: canUndo(history),
    canRedo: canRedo(history),
    doUndo,
    doRedo,
    startEdit,
    commitEdit,
    hoverBlock,
    unhoverBlock,
    deselectAll,
    actionsFor,
    sendMessage,
  }
}
