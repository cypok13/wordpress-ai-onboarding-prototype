import { ArrowRight, ArrowDown, ConvergeArrows, ForkGlyph, BLUE, GRAY_MUTED } from './Arrows'

function Money() {
  return <span className="dg-money">$</span>
}

export function DiagramA() {
  return (
    <section className="dg-frame dgA" id="diagram-a">
      <h2 className="dg-title dg-title--a">
        <span className="dg-title__kicker">One intent layer</span>
        Unify the intent, not the front door
      </h2>

      <div className="dgA__flow">
        {/* Left: entry doors in two clusters */}
        <div className="dgA__doors">
          <div className="dg-cluster dg-cluster--default">
            <div className="dg-cluster__label">
              Arrives undecided → <b>AI-first (default)</b>
            </div>
            <div className="dg-cluster__chips">
              <span className="dg-chip">Universal signup</span>
              <span className="dg-chip">Campaign</span>
              <span className="dg-chip">Product landing</span>
            </div>
          </div>

          <div className="dg-cluster">
            <div className="dg-cluster__label">
              Has a clear, different need → keeps its own door
            </div>
            <div className="dg-cluster__chips">
              <span className="dg-chip">Commerce</span>
              <span className="dg-chip">Import</span>
              <span className="dg-chip">Theme-first</span>
              <span className="dg-chip">Dev hosting</span>
            </div>
          </div>
        </div>

        {/* Converge */}
        <div className="dgA__converge">
          <ConvergeArrows />
        </div>

        {/* Right: spine */}
        <div className="dgA__spine">
          <div className="dgA__stage dgA__stage--intent">
            <div className="dg-pill">
              <span className="dg-pill__label">INTENT</span>
              <span className="dg-pill__sub">what · field · tone · sells? · must-haves</span>
            </div>

            {/* SECONDARY path — expert doors take intent straight to their own tools,
                bypassing AI generation. Muted, thinner, branches downward. */}
            <div className="dgA__secondary" aria-label="Secondary path: expert doors">
              <ArrowDown color={GRAY_MUTED} height={34} />
              <div className="dg-node dg-node--muted">
                <div className="dg-node__label">Existing editor / commerce setup</div>
                <div className="dg-node__sub">expert doors — no AI generation</div>
              </div>
            </div>
          </div>

          <div className="dgA__arrow">
            <ArrowRight color={BLUE} />
          </div>

          <div className="dgA__stage">
            <div className="dg-node dg-node--primary">
              <span className="dg-money-anchor">
                <Money />
              </span>
              <div className="dg-node__flag">default</div>
              <div className="dg-node__label">
                AI generates
                <ForkGlyph color={BLUE} />
              </div>
              <div className="dg-node__sub">adapts per segment</div>
            </div>
          </div>

          <div className="dgA__arrow">
            <ArrowRight />
          </div>

          <div className="dgA__stage">
            <div className="dg-node dg-node--hero">
              <div className="dg-node__label">MAKE IT YOURS</div>
              <div className="dg-node__sub">take control of the draft</div>
            </div>
          </div>

          <div className="dgA__arrow">
            <ArrowRight color={BLUE} />
          </div>

          <div className="dgA__stage">
            <div className="dg-node">
              <span className="dg-money-anchor">
                <Money />
              </span>
              <div className="dg-node__label">CLAIM</div>
              <div className="dg-node__sub">domain · plan · commerce</div>
            </div>
          </div>
        </div>
      </div>

      <p className="dg-caption dgA__caption">
        Every door feeds one intent. AI-first is the default path; expert doors take that same
        intent straight to their own tools.
      </p>
    </section>
  )
}
