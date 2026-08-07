import type { ReactNode } from 'react'
import { Button, Icon, TabPanel } from '@wordpress/components'
import {
  brush,
  chevronRight,
  close,
  layout,
  navigation,
  page,
  styles,
  symbol,
} from '@wordpress/icons'

export type SidebarTab = 'assistant' | 'block' | 'design'

interface SidebarProps {
  tab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  assistant: ReactNode
  block: ReactNode
  // The "Block" tab only exists once a draft is generated (Editor). During
  // Clarify/Generating the sidebar shows the single "Assistant" tab.
  showBlockTab?: boolean
}

// Tabbed right sidebar. The tab strip is the real DS <TabPanel> so the active
// underline thickness/colour + typography come straight from the design system
// (2px #6e6e6e stroke, not the heavier near-black we hand-rolled before). The X
// close button sits outside TabPanel in the same row. TabPanel is used for the
// STRIP only — its per-tab render returns null and we keep our own persistent
// tabpanels below, so AssistantPanel (imperative handle + chat state) is never
// unmounted on tab switch.
export function Sidebar({
  tab,
  onTabChange,
  assistant,
  block,
  showBlockTab = true,
}: SidebarProps) {
  const tabs = [
    {
      name: 'assistant',
      title: (
        <>
          <img
            className="hf-sidebar__tabicon"
            src="/icon-big-sky.svg"
            alt=""
            width={16}
            height={16}
          />
          Assistant
        </>
      ) as unknown as string,
    },
    ...(showBlockTab ? [{ name: 'block', title: 'Block' as unknown as string }] : []),
    { name: 'design', title: 'Design' as unknown as string },
  ]

  return (
    <aside className="hf-sidebar" aria-label="Site assistant">
      <div className="hf-sidebar__tabrow">
        <TabPanel
          // DS TabPanel reads initialTabName ONLY at mount — it does NOT re-sync
          // when the prop changes. So a PROGRAMMATIC switch (selecting a block →
          // Block tab) moved our panels but left the underline on the old tab.
          // Keying on `tab` remounts the strip so the active underline always
          // matches the shown panel. (Remount on manual clicks is a no-op-cost
          // re-render; onSelect fires with the same tab → no loop.)
          key={tab}
          className="hf-sidebar__tabpanel"
          activeClass="is-active"
          tabs={tabs}
          initialTabName={tab}
          onSelect={(name) => onTabChange(name as SidebarTab)}
        >
          {/* The strip drives external state; persistent panels render below. */}
          {() => null}
        </TabPanel>
        <Button
          className="hf-sidebar__close"
          variant="tertiary"
          icon={close}
          iconSize={18}
          label="Close sidebar"
        />
      </div>

      <div
        id="hf-panel-assistant"
        role="tabpanel"
        aria-labelledby="hf-tab-assistant"
        hidden={tab !== 'assistant'}
        className="hf-sidebar__panel"
      >
        {assistant}
      </div>
      {showBlockTab && (
        <div
          id="hf-panel-block"
          role="tabpanel"
          aria-labelledby="hf-tab-block"
          hidden={tab !== 'block'}
          className="hf-sidebar__panel"
        >
          {block}
        </div>
      )}
      <div
        id="hf-panel-design"
        role="tabpanel"
        aria-labelledby="hf-tab-design"
        hidden={tab !== 'design'}
        className="hf-sidebar__panel"
      >
        <DesignPanel />
      </div>
    </aside>
  )
}

// A row in the Design mock: leading icon + label, optional trailing chevron.
// STATIC / NON-INTERACTIVE — no onClick, does not drill in. Styled to match the
// block-inspector collapsed rows so it reads consistently with the Block tab.
function DesignRow({
  icon,
  label,
  chevron = false,
}: {
  icon: typeof brush
  label: string
  chevron?: boolean
}) {
  return (
    <div className="hf-design__row">
      <span className="hf-design__rowicon" aria-hidden="true">
        <Icon icon={icon} size={24} />
      </span>
      <span className="hf-design__rowlabel">{label}</span>
      {chevron && (
        <span className="hf-design__rowchevron" aria-hidden="true">
          <Icon icon={chevronRight} size={20} />
        </span>
      )}
    </div>
  )
}

// The Design-tab content. STATIC, NON-INTERACTIVE mock (LIGHT theme) matching the
// block-inspector: a decorative back-arrow + "Design" header, a muted description,
// and a mock list of navigable-looking rows. Nothing is wired — no drill-in.
function DesignPanel() {
  return (
    <div className="hf-blockpanel hf-blockinspector hf-design">
      <p className="hf-design__desc">
        Customize the appearance of your website using the block editor.
      </p>

      <DesignRow icon={brush} label="Identity" />
      <DesignRow icon={styles} label="Styles" />
      <DesignRow icon={page} label="Pages" chevron />
      <DesignRow icon={navigation} label="Navigation" chevron />
      <DesignRow icon={symbol} label="Patterns" chevron />
      <DesignRow icon={layout} label="Templates" chevron />
    </div>
  )
}
