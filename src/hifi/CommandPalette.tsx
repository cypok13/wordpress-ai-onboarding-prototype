import { useEffect, useRef, useState } from 'react'
import { Composite, Modal, TextHighlight } from '@wordpress/components'
import {
  Icon,
  blockDefault,
  comment as commentIcon,
  page as pageIcon,
  redo as redoIcon,
  search,
  styles,
  undo as undoIcon,
  upload,
} from '@wordpress/icons'
import { PAGES, PALETTE, type PageId } from './content'
import type { SidebarTab } from './Sidebar'

// The command palette the top-bar document pill opens (and ⌘K / Ctrl+K).
//
// @wordpress/commands — the package that ships Gutenberg's real palette — is
// deliberately NOT used: it only works through a @wordpress/data store and
// would drag a second editor store into a prototype that has none (the same
// failure mode as the block-editor POC in the design-system audit). So the palette is assembled
// from the DS primitives we already have — Modal, SearchControl, Composite,
// TextHighlight, @wordpress/icons — with structure, spacing and colours ported
// from packages/commands/src (see hifi.css).

interface PaletteItem {
  id: string
  label: string
  icon: typeof pageIcon
  tag: string
  onSelect: () => void
}

interface PaletteGroup {
  heading: string
  items: PaletteItem[]
}

interface CommandPaletteProps {
  currentPage: PageId
  onSelectPage: (page: PageId) => void
  onLaunch?: () => void
  onUndo?: () => void
  onRedo?: () => void
  sidebarTab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  showBlockTab: boolean
  onClose: () => void
}

export function CommandPalette({
  currentPage,
  onSelectPage,
  onLaunch,
  onUndo,
  onRedo,
  sidebarTab,
  onTabChange,
  showBlockTab,
  onClose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const searchRef = useRef<HTMLInputElement>(null)

  // The search field owns the keyboard, so it takes focus on open.
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  const run = (action: () => void) => {
    onClose()
    action()
  }

  const groups = ((): PaletteGroup[] => {
    const pages: PaletteItem[] = PAGES.map((p) => ({
      id: `page-${p.id}`,
      label: p.title,
      icon: pageIcon,
      tag: p.id === currentPage ? PALETTE.currentTag : PALETTE.pageTag,
      onSelect: () => run(() => onSelectPage(p.id)),
    }))

    // Only commands that already do something in this prototype, and only in the
    // states where they do it — undo and redo appear when there is something to
    // undo, the block panel when a block is selected. A palette row that opens a
    // dead end is worse than an absent one. "Go to: X" is Gutenberg's own label
    // shape for moving between the editor's panels.
    const cmd = (id: string, label: string, icon: typeof pageIcon, action: () => void) => ({
      id,
      label,
      icon,
      tag: PALETTE.commandTag,
      onSelect: () => run(action),
    })

    const commands: PaletteItem[] = []
    if (onUndo) commands.push(cmd('command-undo', PALETTE.undo, undoIcon, onUndo))
    if (onRedo) commands.push(cmd('command-redo', PALETTE.redo, redoIcon, onRedo))
    if (sidebarTab !== 'assistant') {
      commands.push(cmd('command-assistant', PALETTE.goAssistant, commentIcon, () => onTabChange('assistant')))
    }
    if (showBlockTab && sidebarTab !== 'block') {
      commands.push(cmd('command-block', PALETTE.goBlock, blockDefault, () => onTabChange('block')))
    }
    if (sidebarTab !== 'design') {
      commands.push(cmd('command-design', PALETTE.goDesign, styles, () => onTabChange('design')))
    }
    if (onLaunch) commands.push(cmd('command-launch', PALETTE.launch, upload, onLaunch))

    const matches = (item: PaletteItem) =>
      item.label.toLowerCase().includes(query.trim().toLowerCase())

    return [
      { heading: PALETTE.pagesGroup, items: pages.filter(matches) },
      { heading: PALETTE.commandsGroup, items: commands.filter(matches) },
    ].filter((g) => g.items.length > 0)
  })()

  const flat = groups.flatMap((g) => g.items)
  const active = flat.some((i) => i.id === activeId) ? activeId : (flat[0]?.id ?? null)

  const move = (delta: number) => {
    if (flat.length === 0) return
    const index = flat.findIndex((i) => i.id === active)
    const next = flat[(index + delta + flat.length) % flat.length]
    setActiveId(next.id)
    itemRefs.current[next.id]?.scrollIntoView({ block: 'nearest' })
  }

  // Arrow keys and Enter are handled on the input so focus stays in the search
  // field while the list moves — the behaviour of the real palette.
  const onSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      move(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      move(-1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      flat.find((i) => i.id === active)?.onSelect()
    }
  }

  return (
    <Modal
      className="hf-cmd"
      overlayClassName="hf-cmd__overlay"
      contentLabel={PALETTE.label}
      onRequestClose={onClose}
      size="medium"
      __experimentalHideHeader
    >
      {/* A bare input, not the DS SearchControl. The real palette does the same
          (cmdk renders a plain input): SearchControl fixes its container to the
          40px control height and insets its own prefix, and stripping that is a
          pile of overrides against DS internals — the failure mode the design-system audit records. */}
      <div className="hf-cmd__header">
        <Icon className="hf-cmd__searchicon" icon={search} size={24} />
        <input
          ref={searchRef}
          className="hf-cmd__search"
          type="text"
          aria-label={PALETTE.placeholder}
          placeholder={PALETTE.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onSearchKeyDown}
        />
      </div>

      {flat.length === 0 ? (
        <p className="hf-cmd__empty">{PALETTE.empty}</p>
      ) : (
        <Composite
          virtualFocus
          focusLoop
          className="hf-cmd__list"
          activeId={active}
          setActiveId={(id) => setActiveId(id ?? null)}
        >
          {groups.map((group) => (
            <Composite.Group key={group.heading} className="hf-cmd__group">
              <Composite.GroupLabel className="hf-cmd__grouplabel">
                {group.heading}
              </Composite.GroupLabel>
              {group.items.map((item) => (
                <Composite.Item
                  key={item.id}
                  id={item.id}
                  className="hf-cmd__item"
                  ref={(el) => {
                    itemRefs.current[item.id] = el
                  }}
                  onClick={item.onSelect}
                  onMouseEnter={() => setActiveId(item.id)}
                >
                  <span className="hf-cmd__itemicon" aria-hidden="true">
                    <Icon icon={item.icon} size={24} />
                  </span>
                  <span className="hf-cmd__itemlabel">
                    <TextHighlight text={item.label} highlight={query.trim()} />
                  </span>
                  <span className="hf-cmd__itemtag">{item.tag}</span>
                </Composite.Item>
              ))}
            </Composite.Group>
          ))}
        </Composite>
      )}
    </Modal>
  )
}
