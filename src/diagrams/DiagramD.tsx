import { ArrowRight, GRAY } from './Arrows'

/* Two short path-arrows: each path keeps its OWN outcome (they do not merge into
   one node). AI → generate/editor; manual non-website → a prepared per-type flow. */
function PathArrow() {
  return (
    <svg width={44} height={62} viewBox="0 0 44 62" fill="none" aria-hidden>
      <path d="M2 31 L34 31" stroke={GRAY} strokeWidth={1.5} fill="none" />
      <path d="M43 31 L35 27 L35 35 Z" fill={GRAY} />
    </svg>
  )
}

export function DiagramD() {
  return (
    <section className="dg-frame dgD" id="diagram-intent-aware">
      <h2 className="dg-title dg-title--a">
        <span className="dg-title__kicker">One entry, intent-aware</span>
        Ask only when you don&rsquo;t already know
      </h2>
      <p className="dg-caption dgD__subtitle">
        One surface, two ways in. Intent-carried skips only the &ldquo;which product type?&rdquo; step &mdash; not the rest of the questions.
      </p>

      <div className="dgD__grid">
        {/* ===== ROW 1 — COLD START (nothing known — ask the type too) ===== */}
        <div className="dgD__row">
          <div className="dgD__rowhead">
            <span className="dgD__rowtag">Cold start</span>
            <span className="dgD__rowsub">nothing known — what the demo shows</span>
          </div>

          <div className="dgD__body">
            <div className="dg-node dgD__entry">
              <div className="dg-node__label">One entry</div>
              <div className="dg-node__sub">same surface for everyone</div>
            </div>

            <div className="dgD__arrow">
              <ArrowRight />
            </div>

            {/* two paths — each asks, then reaches its OWN outcome */}
            <div className="dgD__paths">
              <div className="dgD__path">
                <span className="dgD__pathtag">AI path</span>
                <div className="dgD__leg">
                  <div className="dg-node dgD__ask dgD__ask--on">
                    <div className="dg-node__label">Discovery: type + details</div>
                    <div className="dg-node__sub">asks all four (type, size, goal, look)</div>
                  </div>
                  <div className="dgD__legarrow">
                    <PathArrow />
                  </div>
                  <div className="dg-node dg-node--hero dgD__outcome dgD__outcome--ai">
                    <div className="dg-node__label">Generate &rarr; editor</div>
                    <div className="dg-node__sub">a draft you take over</div>
                  </div>
                </div>
              </div>

              <div className="dgD__path">
                <span className="dgD__pathtag">Manual path</span>
                <div className="dgD__leg">
                  <div className="dg-node dgD__ask dgD__ask--on">
                    <div className="dg-node__label">Type-picker</div>
                    <div className="dg-node__sub">pick what you&rsquo;re building</div>
                  </div>
                  <div className="dgD__legarrow">
                    <PathArrow />
                  </div>
                  <div className="dg-node dgD__outcome dgD__outcome--manual">
                    <div className="dg-node__label">Per-type prepared flow</div>
                    <div className="dg-node__sub">website &rarr; editor; store/newsletter/blog &rarr; that flow</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dgD__divider" />

        {/* ===== ROW 2 — INTENT-CARRIED (product type known — skip ONLY that) ===== */}
        <div className="dgD__row">
          <div className="dgD__rowhead">
            <span className="dgD__rowtag dgD__rowtag--known">Intent carried</span>
            <span className="dgD__rowsub">e.g. arrived from &ldquo;start a newsletter&rdquo;</span>
          </div>

          <div className="dgD__body">
            <div className="dg-node dgD__entry">
              <div className="dg-node__label">One entry</div>
              <div className="dg-node__sub">same surface — looks identical</div>
            </div>

            <div className="dgD__arrow">
              <ArrowRight />
            </div>

            {/* type is known → skip ONLY the "which type?" step, not the rest */}
            <div className="dgD__paths">
              <div className="dgD__path">
                <span className="dgD__pathtag">AI path</span>
                <div className="dgD__leg">
                  <div className="dg-node dgD__ask dgD__ask--trim">
                    <div className="dg-node__label">Discovery: details only</div>
                    <div className="dg-node__sub">skips &ldquo;what type?&rdquo; — still asks size, goal, look</div>
                    <div className="dgD__skipstamp">type step skipped</div>
                  </div>
                  <div className="dgD__legarrow">
                    <PathArrow />
                  </div>
                  <div className="dg-node dg-node--hero dgD__outcome dgD__outcome--ai">
                    <div className="dg-node__label">Generate &rarr; editor</div>
                    <div className="dg-node__sub">a draft you take over</div>
                  </div>
                </div>
              </div>

              <div className="dgD__path">
                <span className="dgD__pathtag">Manual path</span>
                <div className="dgD__leg">
                  <div className="dg-node dgD__ask dgD__ask--off">
                    <div className="dg-node__label">Type-picker</div>
                    <div className="dgD__skipstamp">skipped</div>
                  </div>
                  <div className="dgD__legarrow">
                    <PathArrow />
                  </div>
                  <div className="dg-node dgD__outcome dgD__outcome--manual">
                    <div className="dg-node__label">Straight to that type&rsquo;s flow</div>
                    <div className="dg-node__sub">the prepared flow for the known type</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="dg-caption dgD__caption">
        The AI path always ends in generate &rarr; editor; the manual path lands in the prepared flow for the chosen type (website is the editor). What
        intent-carried removes is only the &ldquo;which product type?&rdquo; question &mdash; the remaining details are still asked on the AI path.
      </p>
    </section>
  )
}
