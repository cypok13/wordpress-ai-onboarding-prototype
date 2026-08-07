import { useEffect, useState } from 'react'
import { ProgressBar } from '@wordpress/components'
import { SEAM_STAGES } from './content'

interface GeneratingProps {
  onDone: () => void
  onStartOver: () => void
}

const STAGE_MS = 1100

// Full-screen BLOCKING generation (design spec, revision 3). After the last discovery
// answer the whole screen is taken over: WP masthead + centered serif stage phrase
// cycling with a fade over a thin blue progress bar. NO chat, NO composer, NO
// navigation — it blocks until the draft is ready, then calls onDone and the flow
// swaps in the editor. The intent-carrying stage phrases prove the prompt landed.
export function Generating({ onDone, onStartOver }: GeneratingProps) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (stage >= SEAM_STAGES.length - 1) {
      const done = window.setTimeout(onDone, STAGE_MS)
      return () => window.clearTimeout(done)
    }
    const next = window.setTimeout(() => setStage((s) => s + 1), STAGE_MS)
    return () => window.clearTimeout(next)
  }, [stage, onDone])

  const progress = ((stage + 1) / SEAM_STAGES.length) * 100

  return (
    <main className="dq dq--gen">
      <header className="dq__masthead">
        <button
          type="button"
          className="dq__logo"
          aria-label="Start over"
          onClick={onStartOver}
        />
      </header>

      <div className="hf-gen" aria-label="Building your site">
        <p className="hf-gen__phrase" aria-live="polite" key={stage}>
          {SEAM_STAGES[stage]}
        </p>
        <ProgressBar
          className="hf-gen__progress"
          value={Math.round(progress)}
        />
      </div>
    </main>
  )
}
