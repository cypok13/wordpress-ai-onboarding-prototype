import { ArrowDown, BranchArrows } from './Arrows'

const MARA_STACK = ['Hero', 'Classes', 'Philosophy', 'Schedule', 'Contact']

export function DiagramB() {
  return (
    <section className="dg-frame dgB" id="diagram-b">
      <h2 className="dg-title dg-title--b">
        <span className="dg-title__kicker">One intake, two sites</span>
        Same system, different sites
      </h2>

      <div className="dgB__top">
        <div className="dg-pill">
          <span className="dg-pill__label">SAME INTENT</span>
          <span className="dg-pill__sub">one intake, adapts per segment</span>
        </div>
      </div>

      <div className="dgB__branch">
        <BranchArrows />
      </div>

      <div className="dgB__cols">
        {/* Left — Mara */}
        <div className="dgB__col">
          <div className="dgB__persona">Mara · yoga studio</div>
          <div className="dgB__chips">
            <span className="dg-chip dg-chip--sm">sells = no</span>
            <span className="dg-chip dg-chip--sm">wellness</span>
            <span className="dg-chip dg-chip--sm">calm</span>
          </div>
          <div className="dgB__chip-arrow">
            <ArrowDown height={28} />
          </div>
          <div className="dgB__stack">
            {MARA_STACK.map((block) => (
              <div className="dg-block" key={block}>
                {block}
              </div>
            ))}
          </div>
          <span className="dgB__badge dgB__badge--ai">
            <span className="dg-dot" />
            AI builds all of it
          </span>
        </div>

        {/* Right — Sam */}
        <div className="dgB__col">
          <div className="dgB__persona">Sam · handmade candles</div>
          <div className="dgB__chips">
            <span className="dg-chip dg-chip--sm">sells = yes</span>
            <span className="dg-chip dg-chip--sm">handmade</span>
            <span className="dg-chip dg-chip--sm">warm</span>
          </div>
          <div className="dgB__chip-arrow">
            <ArrowDown height={28} />
          </div>
          <div className="dgB__stack">
            <div className="dg-block">Hero</div>
            <div className="dg-block">Products</div>
            <div className="dg-block">Story</div>
            <div className="dg-block dg-block--dashed">
              Store
              <span className="dg-block__hint">hand off to setup</span>
            </div>
            <div className="dg-block">Contact</div>
          </div>
          <span className="dgB__badge dgB__badge--bridge">
            <span className="dg-dot" />
            honest bridge where the AI stops
          </span>
        </div>
      </div>

      <p className="dg-caption dgB__caption">
        Same system, different sites — the branch is real, not cosmetic.
      </p>
    </section>
  )
}
