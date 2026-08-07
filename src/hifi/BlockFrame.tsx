import { forwardRef, useRef, useState, type ReactNode } from 'react'
import {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  DropdownMenu,
  MenuGroup,
  MenuItem,
  Icon,
} from '@wordpress/components'
import {
  chevronUp,
  chevronDown,
  chevronRight,
  moreVertical,
  dragHandle,
} from '@wordpress/icons'
import {
  BLOCK_SOURCE_PROMPT,
  REWRITE_OPTIONS,
  TONE_OPTIONS,
  type BlockId,
  type Provenance,
  type RewriteOption,
  type Tone,
} from './content'
import { IconAi, IconEdited, IconRegenerate, IconSparkle } from './icons'

// Provenance chip — hover/focus-gated (Round 5). Icon + label, a11y-exposed.
export function ProvenanceChip({ provenance }: { provenance: Provenance }) {
  const edited = provenance === 'edited'
  return (
    <span className={`hf-prov${edited ? ' hf-prov--edited' : ''}`}>
      {edited ? <IconEdited /> : <IconAi />}
      {edited ? 'Edited by you' : 'AI draft'}
    </span>
  )
}

export interface BlockActions {
  onAskAi: (request: string) => void
  onRewrite: (option: RewriteOption) => void
  onChangeTone: (tone: Tone) => void
  onReplaceImage?: () => void
  onDuplicate: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

// Custom sparkle glyph for the "Edit with AI" ✦ button — no DS equivalent
// (@wordpress/icons has no sparkles/ai/magic/wand). FLAGGED custom SVG.
// Sized to the DS icon grid so it sits flush with the native glyphs.
function IconSparkle24() {
  return <IconSparkle size={24} />
}

// The Gutenberg-style contextual toolbar, rebuilt on the native DS Toolbar
// family so it reads as the real block toolbar (compact grouped icon buttons
// with dividers from ToolbarGroup). Our AI actions collapse behind the ✦
// button; native block options live behind ⋮. Revealed on hover/focus (CSS).
function BlockToolbar({
  blockId,
  currentTone,
  actions,
  canMoveUp,
  canMoveDown,
}: {
  blockId: BlockId
  currentTone: Tone
  actions: BlockActions
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  return (
    <div className="hf-tb" onClick={(e) => e.stopPropagation()}>
      <Toolbar label="Block actions">
        {/* Group 1 — block manipulation: drag handle + up/down movers, one
            logical section. A true vertical ↕ BlockMover only exists in
            @wordpress/block-editor, which requires a full BlockEditorProvider +
            block store + its 143KB global stylesheet (collides with our toolbar
            and dropdowns) — POC-proven NO-GO for a mock. So the movers are two
            plain DS ToolbarButtons inline beside the drag handle: native sizing,
            even padding, side-by-side rather than stacked. Each disables at its
            run end. The block-type switcher was dropped (useless in this mock). */}
        <ToolbarGroup className="hf-tb-gdrag">
          <ToolbarButton
            icon={dragHandle}
            label="Drag"
            className="hf-tb-drag"
            onClick={() => {}}
          />
        </ToolbarGroup>
        {/* Mover — its OWN DS ToolbarGroup (never a raw div: that corrupts
            ariakit's roving store & breaks the dropdowns) turned into a vertical
            column so up stacks over down (the real Gutenberg ↕). Kept at the 36px
            button rhythm (NOT a narrow 24px group — that was the padding bug). */}
        <ToolbarGroup className="hf-tb-mover">
          <ToolbarButton
            icon={chevronUp}
            label="Move up"
            className="hf-tb-move__up"
            disabled={!canMoveUp}
            onClick={actions.onMoveUp}
          />
          <ToolbarButton
            icon={chevronDown}
            label="Move down"
            className="hf-tb-move__down"
            disabled={!canMoveDown}
            onClick={actions.onMoveDown}
          />
        </ToolbarGroup>

        {/* Group 2 — AI actions, collapsed behind the ✦ "Edit with AI" button.
            Custom sparkle glyph (flagged). Keeps the existing wiring:
            ask-AI, change-tone, rewrite, try-another. */}
        <ToolbarGroup>
          <ToolbarDropdownAi
            blockId={blockId}
            currentTone={currentTone}
            actions={actions}
          />
        </ToolbarGroup>

        {/* Group 3 — ⋮ more options: the static native block menu. */}
        <ToolbarGroup>
          <DropdownMenu
            icon={moreVertical}
            label="Options"
            className="hf-tb-more"
            popoverProps={{ placement: 'bottom-start' }}
          >
            {() => (
              <>
                {/* No trailing icons — the real Gutenberg block menu shows
                    label + shortcut only (A#9). Shortcuts retained. */}
                <MenuGroup>
                  <MenuItem shortcut="⌘C" onClick={() => {}}>
                    Copy
                  </MenuItem>
                  <MenuItem shortcut="⌥⌘T" onClick={() => {}}>
                    Add before
                  </MenuItem>
                  <MenuItem shortcut="⌥⌘Y" onClick={() => {}}>
                    Add after
                  </MenuItem>
                  <MenuItem shortcut="⌥⌘M" onClick={() => {}}>
                    Add note
                  </MenuItem>
                </MenuGroup>
                <MenuGroup>
                  <MenuItem shortcut="⌥⌘R" onClick={() => {}}>
                    Rename
                  </MenuItem>
                  {/* "Delete" — wired to the real delete + undo-toast behavior.
                      Destructive-red styling kept; ⌫ backspace shortcut. */}
                  <MenuItem shortcut="⌫" isDestructive onClick={actions.onDelete}>
                    Delete
                  </MenuItem>
                </MenuGroup>
              </>
            )}
          </DropdownMenu>
        </ToolbarGroup>
      </Toolbar>

      {/* "from: …" transparency — the original intent that made this block. */}
      <p className="hf-tbfrom">from: {BLOCK_SOURCE_PROMPT[blockId]}</p>
    </div>
  )
}

// The ✦ "Edit with AI" dropdown — houses all four AI actions. Change-tone
// opens a nested submenu; the rest fire directly. Existing handlers preserved.
function ToolbarDropdownAi({
  blockId,
  currentTone,
  actions,
}: {
  blockId: BlockId
  currentTone: Tone
  actions: BlockActions
}) {
  return (
    <DropdownMenu
      icon={<IconSparkle24 />}
      label="Edit with AI"
      className="hf-tb-ai"
      popoverProps={{ placement: 'bottom-start', className: 'hf-tb-ai-pop' }}
    >
      {({ onClose }) => (
        <>
          <MenuGroup>
            <MenuItem
              icon={<IconSparkle size={24} />}
              onClick={() => {
                actions.onAskAi(`Refine the ${blockId} section`)
                onClose()
              }}
            >
              Edit with AI
            </MenuItem>
            <ToneSubmenu
              currentTone={currentTone}
              onPick={(t) => {
                actions.onChangeTone(t)
                onClose()
              }}
            />
            <MenuItem
              icon={<IconRegenerate size={24} />}
              onClick={() => {
                actions.onRewrite(REWRITE_OPTIONS[0])
                onClose()
              }}
            >
              Rewrite
            </MenuItem>
          </MenuGroup>
        </>
      )}
    </DropdownMenu>
  )
}

// Change-tone as a HOVER side-flyout (not a click submenu). The row carries no
// leading icon (consistent with the other AI items) and a trailing chevron ›
// to signal the nested menu. Hovering the row reveals the tone options as a
// popover beside it; a small close delay keeps it open while the pointer
// travels between the row and the flyout. Current tone shown first + selected.
function ToneSubmenu({
  currentTone,
  onPick,
}: {
  currentTone: Tone
  onPick: (tone: Tone) => void
}) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 240)
  }

  return (
    <div
      className="hf-tb-tone"
      onMouseEnter={() => {
        cancelClose()
        setOpen(true)
      }}
      onMouseLeave={scheduleClose}
    >
      <MenuItem
        // No leading icon; trailing chevron via suffix signals the submenu.
        suffix={<Icon icon={chevronRight} size={20} />}
        aria-haspopup="menu"
        aria-expanded={open}
        // Hover-triggered; the click just toggles for keyboard/touch parity.
        onClick={() => setOpen((v) => !v)}
      >
        Change tone
      </MenuItem>
      {open && (
        <div
          className="hf-tb-tone__flyout"
          role="menu"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <MenuGroup label={`Current: ${currentTone}`}>
            {TONE_OPTIONS.map((t) => (
              <MenuItem
                key={t}
                isSelected={t === currentTone}
                onClick={() => {
                  onPick(t)
                  setOpen(false)
                }}
              >
                {t}
              </MenuItem>
            ))}
          </MenuGroup>
        </div>
      )}
    </div>
  )
}

interface BlockProps {
  id: BlockId
  label: string
  provenance: Provenance
  selected: boolean
  hovered: boolean
  currentTone: Tone
  actions: BlockActions
  canMoveUp: boolean
  canMoveDown: boolean
  animKey?: string | number
  onSelect: () => void
  onHover: () => void
  onUnhover: () => void
  children: ReactNode
  className?: string
}

// A selectable, keyboard-focusable block region. Renders the provenance chip,
// the hover/focus-revealed toolbar, and animates its content on re-render.
// The toolbar is a child, so mouse enter/leave on the section span both the
// block and its toolbar — one hover group. A leave delay lives in the parent.
export const Block = forwardRef<HTMLDivElement, BlockProps>(function Block(
  { id, label, provenance, selected, hovered, currentTone, actions, canMoveUp, canMoveDown, animKey, onSelect, onHover, onUnhover, children, className },
  ref,
) {
  const revealed = selected || hovered
  return (
    <section
      ref={ref}
      id={`hf-block-${id}`}
      className={`hf-block${selected ? ' is-selected' : ''}${revealed ? ' is-revealed' : ''}${className ? ' ' + className : ''}`}
      tabIndex={0}
      role="group"
      aria-label={`${label} block — ${provenance === 'edited' ? 'edited by you' : 'AI draft'}`}
      aria-pressed={selected}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <BlockToolbar
        blockId={id}
        currentTone={currentTone}
        actions={actions}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />
      <ProvenanceChip provenance={provenance} />
      <div key={animKey} className="hf-anim">
        {children}
      </div>
    </section>
  )
})
