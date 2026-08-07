import { ArrowRight } from './Arrows'

/* The plainest possible statement of the flow: four steps, left to right, one
   line of explanation each. Deliberately no branches, no annotations — the
   other diagrams carry the routing logic; this one is just the spine. */

const STEPS = [
  { label: 'Describe', sub: 'A guided chat asks one question at a time.' },
  { label: 'Draft', sub: 'A structured site, with every block marked as an AI draft.' },
  { label: 'Make it yours', sub: 'Edit anything. An edited block becomes yours.' },
  { label: 'Go live', sub: 'Free on a WordPress.com address. A domain is the upgrade.' },
]

export function DiagramE() {
  return (
    <section className="dg-frame dgE" id="diagram-user-flow">
      <h2 className="dg-title dg-title--b">
        <span className="dg-title__kicker">User flow</span>
        Four steps, one thread
      </h2>

      <div className="dgE__row">
        {STEPS.map((step, i) => (
          <div className="dgE__step" key={step.label}>
            <div className="dg-node dgE__node">
              <div className="dg-node__label">{step.label}</div>
              <div className="dg-node__sub">{step.sub}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="dgE__arrow">
                <ArrowRight />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
