import { COPY } from './copy'

interface AssistantPanelProps {
  streaming: boolean
  milestonesDone: number
  messageCap: boolean
  onUpgrade: () => void
}

export function AssistantPanel(props: AssistantPanelProps) {
  const { streaming, milestonesDone, messageCap } = props

  return (
    <aside className="lf-assistant" aria-label="Assistant panel">
      {streaming ? (
        <div className="lf-assist-msg">
          <h3>✦ {COPY.streamingHeader}</h3>
          <ul className="lf-milestones" role="status" aria-live="polite" aria-atomic="true">
            {COPY.milestones.map((m, i) => (
              <li key={m} data-done={i < milestonesDone}>
                {i < milestonesDone ? '✓ ' : '• '}
                {m}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="lf-assist-msg">
          <h3>✦ Plan</h3>
          <p>{COPY.planStructure}</p>
          <p style={{ marginTop: 6 }}>{COPY.planGuess}</p>
        </div>
      )}

      {!streaming && (
        <div>
          <p className="lf-help" style={{ marginBottom: 6 }}>
            Suggestions:
          </p>
          <div className="lf-suggestions">
            {COPY.suggestions.map((s) => (
              <button key={s} type="button" className="lf-btn lf-btn--ghost">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="lf-input-row">
        {messageCap && (
          <div className="lf-capbar" role="status">
            {COPY.messageCap}
            <div>
              <button type="button" className="lf-btn lf-btn--strong" onClick={props.onUpgrade}>
                Upgrade
              </button>
            </div>
          </div>
        )}
        <input
          type="text"
          aria-label="Ask the assistant"
          placeholder={COPY.inputPlaceholder}
          disabled={messageCap}
        />
      </div>
    </aside>
  )
}
