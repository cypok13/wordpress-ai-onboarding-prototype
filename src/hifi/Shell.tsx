import { forwardRef, useEffect, useState, type ReactNode } from 'react'
import { AssistantPanel, type AssistantPanelHandle } from './AssistantPanel'
import { CommandPalette } from './CommandPalette'
import { Sidebar, type SidebarTab } from './Sidebar'
import { TopBar } from './TopBar'
import type { Thread } from './chatThread'
import type { PageId } from './content'

// The ONE persistent editor shell. Flow renders a single <Shell> across
// Clarify → Generating → Editor; only its props change, so React keeps the same
// AssistantPanel instance mounted (no remount, no thread reset, no flicker). The
// CANVAS (left) is passed in and swaps per stage; the assistant panel (right)
// stays put.
interface ShellProps {
  canvas: ReactNode
  // Assistant panel
  thread: Thread
  thinking: boolean
  inputPlaceholder: string
  onSend: (text: string) => void
  suggestions?: readonly string[]
  inputDisabled?: boolean
  // Sidebar / top bar
  sidebarTab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  showBlockTab: boolean
  block?: ReactNode
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  launchDisabled?: boolean
  onLaunch?: () => void
  onStartOver?: () => void
  announce?: string
  extras?: ReactNode
  // Which page of the draft the canvas is showing, and how to switch.
  currentPage: PageId
  onSelectPage: (page: PageId) => void
}

export const Shell = forwardRef<AssistantPanelHandle, ShellProps>(function Shell(
  {
    canvas,
    thread,
    thinking,
    inputPlaceholder,
    onSend,
    suggestions,
    inputDisabled,
    sidebarTab,
    onTabChange,
    showBlockTab,
    block,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    launchDisabled,
    onLaunch,
    onStartOver,
    announce,
    extras,
    currentPage,
    onSelectPage,
  },
  ref,
) {
  const [paletteOpen, setPaletteOpen] = useState(false)

  // ⌘K / Ctrl+K anywhere in the editor toggles the palette, matching the real
  // shortcut the WordPress.com AI-builder docs point users to.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="hf">
      <TopBar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        launchDisabled={launchDisabled}
        onLaunch={onLaunch}
        onStartOver={onStartOver}
        currentPage={currentPage}
        paletteOpen={paletteOpen}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <div className="hf-shell">
        {canvas}

        <Sidebar
          tab={sidebarTab}
          onTabChange={onTabChange}
          showBlockTab={showBlockTab}
          assistant={
            <AssistantPanel
              ref={ref}
              thread={thread}
              thinking={thinking}
              inputPlaceholder={inputPlaceholder}
              onSend={onSend}
              suggestions={suggestions}
              inputDisabled={inputDisabled}
              pageChips={{ current: currentPage, onSelect: onSelectPage }}
            />
          }
          block={block}
        />
      </div>

      <div className="hf-sr" role="status" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      {extras}

      {paletteOpen && (
        <CommandPalette
          currentPage={currentPage}
          onSelectPage={onSelectPage}
          onLaunch={launchDisabled ? undefined : onLaunch}
          onUndo={canUndo ? onUndo : undefined}
          onRedo={canRedo ? onRedo : undefined}
          sidebarTab={sidebarTab}
          onTabChange={onTabChange}
          showBlockTab={showBlockTab}
          onClose={() => setPaletteOpen(false)}
        />
      )}
    </div>
  )
})
