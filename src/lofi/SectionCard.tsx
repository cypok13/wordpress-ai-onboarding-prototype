import { useState } from 'react'
import { COPY } from './copy'
import type { SectionData } from './copy'

export type Provenance = 'ai' | 'edited'

interface SectionCardProps {
  section: SectionData
  provenance: Provenance
  text: string
  selected: boolean
  regenerating: boolean
  errored: boolean
  onSelect: () => void
  onCommitEdit: (value: string) => void
  onRegenerate: () => void
  onUndoRegenerate: () => void
  onRetry: () => void
  onErrorRetry: () => void
  onWriteItYourself: () => void
  sells?: boolean
  heroSubhead?: string
}

function Badge({ provenance, kind }: { provenance: Provenance; kind: SectionData['kind'] }) {
  if (provenance === 'edited') {
    return <span className="lf-badge lf-badge--edited">‹{COPY.badgeEdited}›</span>
  }
  if (kind === 'lowConfidence') {
    return <span className="lf-badge lf-badge--unsure">‹{COPY.badgeUnsure}›</span>
  }
  return <span className="lf-badge">‹{COPY.badgeDraft}›</span>
}

export function SectionCard(props: SectionCardProps) {
  const { section, provenance, text, selected, regenerating, errored, sells, heroSubhead } = props
  const [editing, setEditing] = useState(false)
  const [draftText, setDraftText] = useState(text)

  const commit = () => {
    props.onCommitEdit(draftText)
    setEditing(false)
  }

  // Empty section — honest fill path (state 7)
  if (section.kind === 'empty') {
    return (
      <div className="lf-section" aria-label={`${section.label} section, empty`}>
        <div className="lf-section__head">
          <span className="lf-section__label">{section.label} · empty</span>
          <div className="lf-section__controls">
            <button type="button" className="lf-btn lf-btn--icon" onClick={props.onRetry}>
              + add
            </button>
          </div>
        </div>
        <p>{COPY.emptySection}</p>
        <div style={{ marginTop: 8 }}>
          <button type="button" className="lf-btn" onClick={props.onRetry}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`lf-section${selected ? ' lf-section--selected' : ''}`}
      aria-label={`${section.label} section, ${
        provenance === 'edited' ? 'edited by you' : 'AI generated'
      }${section.kind === 'lowConfidence' ? ', low confidence' : ''}`}
    >
      {/* Generation error — above the section content, role=alert, focus target (state 6) */}
      {errored && (
        <div className="lf-alert" role="alert" tabIndex={-1}>
          <strong>⚠ {COPY.generationError}</strong>
          <div className="lf-alert__actions">
            <button type="button" className="lf-btn" onClick={props.onErrorRetry}>
              Try again
            </button>
            <button type="button" className="lf-btn" onClick={props.onWriteItYourself}>
              Write it yourself
            </button>
          </div>
          <p className="lf-help" style={{ marginTop: 6 }}>
            ‹previous content preserved below›
          </p>
        </div>
      )}

      <div className="lf-section__head">
        <span className="lf-section__label">{section.label}</span>
        <div className="lf-section__controls">
          <button
            type="button"
            className="lf-btn lf-btn--icon"
            aria-label={`Edit ${section.label} section`}
            onClick={() => {
              props.onSelect()
              setDraftText(text)
            }}
          >
            ✎ edit
          </button>
          <button
            type="button"
            className="lf-btn lf-btn--icon"
            aria-label={`Regenerate ${section.label} section`}
            onClick={props.onRegenerate}
          >
            ↻
          </button>
        </div>
      </div>

      <div className="lf-section__body">
        <div style={{ marginBottom: 6 }}>
          <Badge provenance={provenance} kind={section.kind} />
        </div>

        {section.kind === 'lowConfidence' ? (
          <p>{COPY.lowConfidence}</p>
        ) : (
          <>
            {section.id === 'hero' && (
              <>
                <h2>{text}</h2>
                <p>{heroSubhead ?? 'A one-line subhead your visitors read first.'}</p>
                <span className="lf-cta">
                  [ {sells ? 'Shop products' : 'Book a class'} ]
                </span>
              </>
            )}
            {section.id === 'about' && <p>{text}</p>}
            {section.id === 'services' && (
              <>
                <p>{text}</p>
                <ul style={{ margin: '4px 0 0 16px', color: 'inherit' }}>
                  <li>Service one — one-line description</li>
                  <li>Service two — one-line description</li>
                  <li>Service three — one-line description</li>
                </ul>
              </>
            )}
          </>
        )}
      </div>

      {/* Regenerate (section) status + undo (state 4 / doc9) */}
      {regenerating && (
        <div className="lf-status" role="status" aria-live="polite" style={{ marginTop: 8 }}>
          <span>{COPY.regenerateStatus}</span>
          <button
            type="button"
            className="lf-btn lf-btn--ghost lf-btn--icon"
            title={COPY.undoHover}
            onClick={props.onUndoRegenerate}
          >
            {COPY.undo}
          </button>
        </div>
      )}

      {/* Refine panel — appears when selected (state 3) */}
      {selected && !editing && (
        <div className="lf-refine">
          <div className="lf-refine__row">
            <button type="button" className="lf-btn" onClick={() => setEditing(true)}>
              Edit text
            </button>
            <button type="button" className="lf-btn" onClick={props.onRegenerate}>
              Regenerate style, keep content
            </button>
            <button type="button" className="lf-btn">
              Rewrite tone ▾
            </button>
            <button type="button" className="lf-btn lf-btn--ghost" onClick={props.onSelect}>
              Undo
            </button>
          </div>
          <p className="lf-refine__prompt">
            Written from your prompt: “{section.prompt}”
          </p>
        </div>
      )}

      {/* Inline edit field — commit flips provenance (state 5) */}
      {selected && editing && (
        <div className="lf-refine">
          <label className="lf-sr" htmlFor={`edit-${section.id}`}>
            Edit {section.label} text
          </label>
          <textarea
            id={`edit-${section.id}`}
            className="lf-editfield"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
          />
          <div className="lf-refine__row">
            <button type="button" className="lf-btn lf-btn--strong" onClick={commit}>
              Save changes
            </button>
            <button
              type="button"
              className="lf-btn lf-btn--ghost"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
