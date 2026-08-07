import { Button } from '@wordpress/components'
import {
  arrowUpLeft,
  desktop,
  drawerRight,
  external,
  help,
  Icon,
  listView,
  moreVertical,
  plus,
  redo,
  undo,
} from '@wordpress/icons'
import { IconJetpack } from './icons'
import { PAGES, type PageId } from './content'

interface TopBarProps {
  // Undo/redo are live only in the editor; the Clarify shell omits them.
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  // Launch is disabled during Discovery/Generating (nothing to launch yet).
  launchDisabled?: boolean
  onLaunch?: () => void
  // Click the WP logo → return to the start of the flow (fresh prompt).
  onStartOver?: () => void
  // The document pill names the page being edited and opens the palette.
  currentPage?: PageId
  paletteOpen?: boolean
  onOpenPalette?: () => void
}

// The Gutenberg editor top bar, shared by the draft editor (HiFi) and the
// Clarify placeholder shell so both read as the same product surface. Only the
// wired controls differ (Clarify has no history and a disabled Launch).
//
// All controls are @wordpress/components <Button> + @wordpress/icons glyphs, so
// icon rendering, sizing, and border-radius come from the real Gutenberg DS
// (this fixes a glyph and radius drift found in review). The only bespoke
// primitive kept is the WP-logo start-over button: its black square + cross-fade
// to a back-arrow + tooltip is a custom interaction with no DS equivalent.
export function TopBar({
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  launchDisabled = false,
  onLaunch,
  onStartOver,
  currentPage = 'home',
  paletteOpen = false,
  onOpenPalette,
}: TopBarProps) {
  const page = PAGES.find((p) => p.id === currentPage) ?? PAGES[0]

  return (
    <header className="hf-topbar">
      <div className="hf-tb-left">
        <button
          type="button"
          className="hf-tb-logo"
          aria-label="Start over"
          onClick={onStartOver}
        >
          <span className="hf-tb-logo__mark" aria-hidden="true" />
          <span className="hf-tb-logo__back" aria-hidden="true">
            <Icon icon={arrowUpLeft} size={24} />
          </span>
          <span className="hf-tb-logo__tip" role="tooltip">
            Start over
          </span>
        </button>
        <Button
          className="hf-tb-inserter"
          icon={plus}
          iconSize={24}
          label="Add block"
        />
        <div className="hf-tb-group">
          <Button
            className="hf-tb-btn"
            icon={undo}
            iconSize={24}
            label="Undo"
            onClick={onUndo}
            disabled={!canUndo}
          />
          <Button
            className="hf-tb-btn"
            icon={redo}
            iconSize={24}
            label="Redo"
            onClick={onRedo}
            disabled={!canRedo}
          />
          <Button
            className="hf-tb-btn"
            icon={listView}
            iconSize={24}
            label="List view"
          />
        </div>
      </div>

      {/* Center doc pill — matches the real site-editor pill: no leading icon,
          regular-weight title, no chevron. It opens the command palette; the
          affordance is the ⌘K badge and the grey hover fill. */}
      <Button
        className="hf-tb-docpill"
        label="Open command palette"
        aria-haspopup="dialog"
        aria-expanded={paletteOpen}
        onClick={onOpenPalette}
      >
        <span className="hf-tb-docpill__name">{page.title}</span>
        <span className="hf-tb-docpill__sep">·</span>
        <span className="hf-tb-docpill__meta">{page.kind}</span>
        <span className="hf-tb-docpill__kbd">⌘K</span>
      </Button>

      <div className="hf-tb-right">
        {/* Right cluster order matches the real editor:
            external → desktop → Jetpack → help → sidebar-toggle.
            No fullscreen / dark-mode toggles live in this cluster. */}
        <div className="hf-tb-cluster">
          <Button className="hf-tb-btn" icon={external} iconSize={24} label="View site" />
          <Button className="hf-tb-btn" icon={desktop} iconSize={24} label="Preview device" />
          <Button
            className="hf-tb-btn hf-tb-btn--jetpack"
            icon={<IconJetpack size={24} />}
            label="Jetpack"
          />
          <Button className="hf-tb-btn" icon={help} iconSize={24} label="Help" />
          <Button
            className="hf-tb-btn"
            icon={drawerRight}
            iconSize={24}
            label="Toggle sidebar"
            isPressed
          />
        </div>
        <Button className="hf-tb-save" variant="tertiary" disabled>
          Save
        </Button>
        <Button
          className="hf-tb-launch"
          variant="primary"
          onClick={onLaunch}
          disabled={launchDisabled}
        >
          Launch
        </Button>
        <Button className="hf-tb-btn" icon={moreVertical} iconSize={24} label="Options" />
      </div>
    </header>
  )
}
