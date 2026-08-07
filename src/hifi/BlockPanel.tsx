import { Button, Icon } from '@wordpress/components'
import {
  chevronDown,
  cover,
  heading,
  image,
  paragraph,
  plus,
} from '@wordpress/icons'
import { BLOCK_LABELS, type BlockId } from './content'

interface BlockPanelProps {
  blockId: BlockId | null
  // Legacy AI-toolbar props are no longer used by the native inspector; kept
  // optional so existing call sites stay green without changes.
  provenance?: unknown
  currentTone?: unknown
  actions?: unknown
}

// The block's icon + name + one-line description shown in the inspector header.
const BLOCK_META: Record<BlockId, { icon: typeof paragraph; desc: string }> = {
  hero: { icon: cover, desc: 'A big title with a background, to open your page.' },
  about: { icon: paragraph, desc: 'Start with the basic building block of all narrative.' },
  classes: { icon: heading, desc: 'Introduce new sections and help organize content.' },
  schedule: { icon: paragraph, desc: 'Start with the basic building block of all narrative.' },
  testimonials: { icon: paragraph, desc: 'Start with the basic building block of all narrative.' },
  contact: { icon: paragraph, desc: 'Start with the basic building block of all narrative.' },
  subscribe: { icon: image, desc: 'Add a media element to draw attention.' },
}

// A collapsed collapsible row with a trailing affordance (+ or ▾) — the real
// inspector shows these for Dimensions / Border / Elements / Attributes /
// Advanced. Rendered as a static, non-interactive row.
function CollapsedRow({ label, affordance }: { label: string; affordance: 'plus' | 'chevronDown' }) {
  return (
    <div className="hf-bi-collapsed">
      <span className="hf-bi-collapsed__label">{label}</span>
      <Button
        className="hf-bi-collapsed__toggle"
        icon={affordance === 'plus' ? plus : chevronDown}
        label={`Expand ${label}`}
        size="small"
      />
    </div>
  )
}

// The Block-tab content, rebuilt to visually match the native Gutenberg block
// inspector. STATIC, NON-INTERACTIVE mock: every control is a real DS component
// so it reads as the true inspector, but nothing is wired to handlers — the live
// block edits live in the floating hover toolbar now.
export function BlockPanel({ blockId }: BlockPanelProps) {
  if (!blockId) {
    return (
      <div className="hf-blockpanel hf-blockpanel--empty" role="status">
        <p className="hf-blockpanel__empty">No block selected.</p>
      </div>
    )
  }

  const label = BLOCK_LABELS[blockId] ?? 'Paragraph'
  const meta = BLOCK_META[blockId] ?? BLOCK_META.about

  return (
    <div className="hf-blockpanel hf-blockinspector">
      {/* Block header — icon + name + one-line description */}
      <div className="hf-bi-head">
        <span className="hf-bi-head__icon" aria-hidden="true">
          <Icon icon={meta.icon} size={24} />
        </span>
        <div className="hf-bi-head__text">
          <span className="hf-bi-head__name">{label}</span>
          <span className="hf-bi-head__desc">{meta.desc}</span>
        </div>
      </div>

      {/* Collapsed collapsible sections with a + affordance */}
      <CollapsedRow label="Dimensions" affordance="plus" />
      <CollapsedRow label="Border" affordance="plus" />
      <CollapsedRow label="Elements" affordance="plus" />
      <CollapsedRow label="Attributes" affordance="plus" />

      {/* Advanced — collapsible with a ▾ affordance */}
      <CollapsedRow label="Advanced" affordance="chevronDown" />
    </div>
  )
}
