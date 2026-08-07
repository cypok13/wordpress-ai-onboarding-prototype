import {
  ABOUT_BY_TONE,
  ABOUT_SHORT_BY_TONE,
  HERO_BY_TONE,
  INITIAL_TONE,
  type BlockId,
  type Provenance,
  type Tone,
} from './content'

// The full editable document. Only Hero + About carry tone-reactive text;
// every block carries provenance so ownership can flip per-block.

export interface DocState {
  tone: Tone
  heroHeadline: string
  heroSubhead: string
  aboutHeading: string
  aboutBody: string
  // Testimonials is a structural block the assistant adds on request.
  testimonialsAdded: boolean
  // The block render order. Reordered by Move up/down; iterated by Canvas.
  order: BlockId[]
  // Blocks the user has deleted (non-destructive — undo restores them).
  deleted: BlockId[]
  provenance: Record<BlockId, Provenance>
  // per-block cosmetic variant, cycled by "Try another version"
  styleVariant: Record<BlockId, number>
}

// Build the initial draft from the confirmed goals. When the "newsletter" intent
// is selected, the composed draft includes a real Subscribe section (before
// Contact) — the multi-intent → one-composed-draft proof.
export function initialDoc(goals: string[] = []): DocState {
  const hero = HERO_BY_TONE[INITIAL_TONE]
  const about = ABOUT_BY_TONE[INITIAL_TONE]
  const wantsSubscribe = goals.includes('newsletter')
  const order: BlockId[] = wantsSubscribe
    ? ['hero', 'about', 'classes', 'schedule', 'testimonials', 'subscribe', 'contact']
    : ['hero', 'about', 'classes', 'schedule', 'testimonials', 'contact']
  return {
    tone: INITIAL_TONE,
    heroHeadline: hero.headline,
    heroSubhead: hero.subhead,
    aboutHeading: about.heading,
    aboutBody: about.body,
    testimonialsAdded: false,
    order,
    deleted: [],
    provenance: {
      hero: 'ai',
      about: 'ai',
      classes: 'ai',
      schedule: 'ai',
      testimonials: 'ai',
      contact: 'ai',
      subscribe: 'ai',
    },
    styleVariant: {
      hero: 0,
      about: 0,
      classes: 0,
      schedule: 0,
      testimonials: 0,
      contact: 0,
      subscribe: 0,
    },
  }
}

// A history entry: a human-readable label + the doc snapshot it produced.
// This is the native global history the top-bar undo/redo drives.
export interface HistoryEntry {
  label: string
  doc: DocState
}

export interface History {
  entries: HistoryEntry[]
  index: number // points at the current entry
}

export function initialHistory(doc: DocState): History {
  return { entries: [{ label: 'Draft generated', doc }], index: 0 }
}

export function current(history: History): DocState {
  return history.entries[history.index].doc
}

// Push a new snapshot, truncating any redo tail (standard editor semantics).
export function push(history: History, label: string, doc: DocState): History {
  const kept = history.entries.slice(0, history.index + 1)
  const entries = [...kept, { label, doc }]
  return { entries, index: entries.length - 1 }
}

export function canUndo(history: History): boolean {
  return history.index > 0
}

export function canRedo(history: History): boolean {
  return history.index < history.entries.length - 1
}

export function undo(history: History): History {
  return canUndo(history) ? { ...history, index: history.index - 1 } : history
}

export function redo(history: History): History {
  return canRedo(history) ? { ...history, index: history.index + 1 } : history
}

// --- Reducers that produce the next doc immutably (no in-place mutation) ---

export function applyTone(doc: DocState, tone: Tone): DocState {
  const hero = HERO_BY_TONE[tone]
  const about = ABOUT_BY_TONE[tone]
  return {
    ...doc,
    tone,
    heroHeadline: hero.headline,
    heroSubhead: hero.subhead,
    aboutHeading: about.heading,
    aboutBody: about.body,
    provenance: { ...doc.provenance, hero: 'edited', about: 'edited' },
  }
}

export function applyHeroEdit(doc: DocState, headline: string): DocState {
  return {
    ...doc,
    heroHeadline: headline,
    provenance: { ...doc.provenance, hero: 'edited' },
  }
}

export function applyAboutEdit(doc: DocState, body: string): DocState {
  return {
    ...doc,
    aboutBody: body,
    provenance: { ...doc.provenance, about: 'edited' },
  }
}

export function applyAboutShorten(doc: DocState): DocState {
  return {
    ...doc,
    aboutBody: ABOUT_SHORT_BY_TONE[doc.tone],
    provenance: { ...doc.provenance, about: 'edited' },
  }
}

export function applyAddTestimonials(doc: DocState): DocState {
  // A structural personalization the user asked for → their authorship.
  return {
    ...doc,
    testimonialsAdded: true,
    provenance: { ...doc.provenance, testimonials: 'edited' },
  }
}

export function applyTryAnotherVersion(doc: DocState, block: BlockId): DocState {
  // Regenerates the block's presentation from the same intent. Cosmetic variant
  // cycle; text unchanged. Provenance stays as-is (an AI action, not authorship).
  return {
    ...doc,
    styleVariant: {
      ...doc.styleVariant,
      [block]: (doc.styleVariant[block] + 1) % 2,
    },
  }
}

export function applyDeleteBlock(doc: DocState, block: BlockId): DocState {
  if (doc.deleted.includes(block)) return doc
  return { ...doc, deleted: [...doc.deleted, block] }
}

export function applyRestoreBlock(doc: DocState, block: BlockId): DocState {
  return { ...doc, deleted: doc.deleted.filter((b) => b !== block) }
}

// Move a block one slot up/down among the visible (non-deleted) blocks. No-op at
// the ends. Swaps immutably against the visible neighbor so hidden blocks in the
// underlying order don't create dead moves.
export function applyMoveBlock(doc: DocState, block: BlockId, dir: 'up' | 'down'): DocState {
  const visible = doc.order.filter((b) => !doc.deleted.includes(b))
  const vIndex = visible.indexOf(block)
  if (vIndex === -1) return doc
  const neighbor = dir === 'up' ? visible[vIndex - 1] : visible[vIndex + 1]
  if (neighbor === undefined) return doc

  const i = doc.order.indexOf(block)
  const j = doc.order.indexOf(neighbor)
  const order = [...doc.order]
  order[i] = neighbor
  order[j] = block
  return { ...doc, order }
}
