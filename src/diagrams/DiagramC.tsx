import { ArrowRight, GRAY } from './Arrows'

/* Two entry arrows converging into the shared prompt node. */
function IntentConverge() {
  return (
    <svg width={64} height={200} viewBox="0 0 64 200" fill="none" aria-hidden>
      <path d="M2 36 C36 36 30 100 62 100" stroke={GRAY} strokeWidth={1.5} fill="none" />
      <path d="M2 164 C36 164 30 100 62 100" stroke={GRAY} strokeWidth={1.5} fill="none" />
      <path d="M63 100 L55 96 L55 104 Z" fill={GRAY} />
    </svg>
  )
}

export function DiagramC() {
  return (
    <section className="dg-frame dgC" id="diagram-intent-routing">
      <h2 className="dg-title dg-title--a">
        <span className="dg-title__kicker">How routing works</span>
        One entry, routed by intent
      </h2>

      <div className="dgC__flow">
        {/* Left — two entry contexts */}
        <div className="dgC__entries">
          <div className="dg-node dgC__entry">
            <div className="dg-node__label">New here</div>
            <div className="dg-node__sub">cold start — intent unknown</div>
          </div>
          <div className="dg-node dgC__entry">
            <div className="dg-node__label">Arrived with intent</div>
            <div className="dg-node__sub">from a newsletter, store, or campaign link</div>
          </div>
        </div>

        {/* Middle — the intent gate */}
        <div className="dgC__gate">
          <div className="dgC__gate-row">
            <ArrowRight />
            <div className="dg-node dg-node--muted dgC__ask">
              <div className="dg-node__label">What would you like to do?</div>
              <div className="dg-node__sub">asked only when we don't know</div>
            </div>
          </div>
          <div className="dgC__gate-row dgC__gate-row--skip">
            <span className="dgC__skip-label">skip — intent already known</span>
            <ArrowRight />
          </div>
        </div>

        {/* Converge into the shared rail */}
        <div className="dgC__converge">
          <IntentConverge />
        </div>

        {/* Shared rail — 4 uniform nodes on one row */}
        <div className="dgC__rail">
          <div className="dgC__stage">
            <div className="dg-node dgC__node dgC__node--prompt">
              <div className="dg-node__label">Prompt</div>
              <div className="dg-node__sub">tell me your goal</div>
            </div>
          </div>
          <div className="dgC__arrow">
            <ArrowRight />
          </div>
          <div className="dgC__stage">
            <div className="dg-node dgC__node">
              <div className="dg-node__label">Generate draft</div>
            </div>
          </div>
          <div className="dgC__arrow">
            <ArrowRight />
          </div>
          <div className="dgC__stage">
            <div className="dg-node dgC__node">
              <div className="dg-node__label">Make it yours</div>
            </div>
          </div>
          <div className="dgC__arrow">
            <ArrowRight />
          </div>
          <div className="dgC__stage">
            <div className="dg-node dgC__node">
              <div className="dg-node__label">Claim</div>
            </div>
          </div>
        </div>
      </div>

      {/* Downstream-branch note — centered muted callout */}
      <div className="dgC__note">
        Branches later only where the goal needs it — a store, for example, adds a setup step.
      </div>

      <p className="dg-caption dgC__caption">
        One entry for everyone. We only ask what the user is making when we don't already know —
        then it's the same prompt-to-draft flow, whatever they're building.
      </p>
    </section>
  )
}
