import { Fragment, useEffect, useRef, useState } from 'react'
import { Button, Popover } from '@wordpress/components'
import { Icon, close, heading, image, paragraph, plus } from '@wordpress/icons'
import {
  BLOCK_LABELS,
  CLASSES,
  CONTACT,
  SCHEDULE,
  SUBSCRIBE,
  TESTIMONIALS,
  type BlockId,
} from './content'
import type { DocState } from './state'
import { Block, type BlockActions } from './BlockFrame'
import { SiteNav } from './SiteNav'

// Default block suggestions shown in the quick-inserter popover (mock, matching
// the real Gutenberg quick-inserter). Non-interactive stubs.
const QUICK_INSERT_BLOCKS = [
  { label: 'Paragraph', icon: paragraph },
  { label: 'Heading', icon: heading },
  { label: 'Image', icon: image },
] as const

interface CanvasProps {
  doc: DocState
  selected: BlockId | null
  hovered: BlockId | null
  editing: 'hero' | 'about' | null
  onSelect: (id: BlockId | null) => void
  onEditText: (id: 'hero' | 'about') => void
  onCommitEdit: (id: 'hero' | 'about', value: string) => void
  onHoverBlock: (id: BlockId) => void
  onUnhoverBlock: () => void
  onDeselect: () => void
  actionsFor: (id: BlockId) => BlockActions
}

export function Canvas({
  doc,
  selected,
  hovered,
  editing,
  onSelect,
  onEditText,
  onCommitEdit,
  onHoverBlock,
  onUnhoverBlock,
  onDeselect,
  actionsFor,
}: CanvasProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)

  // Between-blocks quick-inserter: which gap's popover is open (by boundary
  // index), and the "+" button that anchors it. Only one open at a time.
  const [openGap, setOpenGap] = useState<number | null>(null)
  const inserterAnchors = useRef<Record<number, HTMLButtonElement | null>>({})

  // When entering edit mode, focus the editable region and place caret at end.
  useEffect(() => {
    const el =
      editing === 'hero'
        ? heroRef.current
        : editing === 'about'
          ? aboutRef.current
          : null
    if (!el) return
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [editing])

  const commit = (id: 'hero' | 'about', el: HTMLElement | null) => {
    if (!el) return
    onCommitEdit(id, el.textContent?.trim() || '')
  }

  const editableProps = (id: 'hero' | 'about', ref: React.RefObject<HTMLDivElement>) =>
    editing === id
      ? ({
          ref,
          contentEditable: true,
          suppressContentEditableWarning: true,
          role: 'textbox',
          'aria-label': `Edit ${id} text`,
          onBlur: () => commit(id, ref.current),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              ;(e.target as HTMLElement).blur()
            }
            if (e.key === 'Escape') {
              e.preventDefault()
              ;(e.target as HTMLElement).blur()
            }
            e.stopPropagation()
          },
        } as const)
      : {}

  const isDeleted = (id: BlockId) => doc.deleted.includes(id)

  // Move up/down are disabled at the ends of the visible run (respecting deleted).
  const visibleOrder = doc.order.filter((id) => !isDeleted(id))
  const moveEdges = (id: BlockId) => {
    const i = visibleOrder.indexOf(id)
    return { atStart: i <= 0, atEnd: i === visibleOrder.length - 1 }
  }

  // Click a text block = inline edit (Gutenberg/Notion). Other blocks just select.
  const clickHandler = (id: BlockId) =>
    id === 'hero' || id === 'about'
      ? () => onEditText(id)
      : () => onSelect(selected === id ? null : id)

  const common = (id: BlockId) => {
    const { atStart, atEnd } = moveEdges(id)
    return {
      id,
      label: BLOCK_LABELS[id],
      provenance: doc.provenance[id],
      selected: selected === id,
      hovered: hovered === id,
      currentTone: doc.tone,
      actions: actionsFor(id),
      canMoveUp: !atStart,
      canMoveDown: !atEnd,
      onSelect: clickHandler(id),
      onHover: () => onHoverBlock(id),
      onUnhover: onUnhoverBlock,
    }
  }

  // One renderer per block id. Canvas iterates doc.order and calls the matching
  // renderer, so Move up/down (which reorders doc.order) reflows the page.
  const renderers: Record<BlockId, () => React.ReactNode> = {
    hero: () => (
      <Block
        {...common('hero')}
        animKey={`${doc.tone}-${doc.heroHeadline}`}
        className={`hf-hero${doc.styleVariant.hero === 1 ? ' hf-hero--v1' : ''}`}
      >
        <div className="hf-hero__grid">
          <div className="hf-hero__copy">
            <p className="hf-hero__kicker">Neighborhood yoga</p>
            <h1 className="hf-hero__headline" {...editableProps('hero', heroRef)}>
              {doc.heroHeadline}
            </h1>
            <p className="hf-hero__subhead">{doc.heroSubhead}</p>
            <div className="hf-hero__ctas">
              <button type="button" className="hf-btn-primary" tabIndex={-1}>
                Book a class
              </button>
              <button type="button" className="hf-btn-ghost" tabIndex={-1}>
                See the schedule
              </button>
            </div>
          </div>
          <div className="hf-hero__media">
            <img
              src="/hero-yoga.svg"
              alt="Calm neighborhood yoga studio interior."
              className="hf-hero__img"
            />
          </div>
        </div>
      </Block>
    ),
    about: () => (
      <Block
        {...common('about')}
        animKey={`${doc.tone}-${doc.aboutBody}`}
        className={doc.styleVariant.about === 1 ? 'hf-about--v1' : undefined}
      >
        <h2 className="hf-about__heading">{doc.aboutHeading}</h2>
        <p className="hf-about__body" {...editableProps('about', aboutRef)}>
          {doc.aboutBody}
        </p>
      </Block>
    ),
    classes: () => (
      <Block
        {...common('classes')}
        className={doc.styleVariant.classes === 1 ? 'hf-classes--v1' : undefined}
      >
        <h2 className="hf-h2">{CLASSES.heading}</h2>
        <div className="hf-classes__grid">
          {CLASSES.items.map((c) => (
            <div key={c.title} className="hf-classcard">
              <p className="hf-classcard__title">{c.title}</p>
              <p className="hf-classcard__desc">{c.description}</p>
            </div>
          ))}
        </div>
      </Block>
    ),
    schedule: () => (
      <Block {...common('schedule')}>
        <h2 className="hf-h2">{SCHEDULE.heading}</h2>
        <div className="hf-schedule__rows">
          {SCHEDULE.rows.map((r) => (
            <div key={r.day} className="hf-schedule__row">
              <span className="hf-schedule__day">{r.day}</span>
              <span className="hf-schedule__detail">{r.detail}</span>
            </div>
          ))}
        </div>
      </Block>
    ),
    testimonials: () => (
      <Block {...common('testimonials')} animKey="testimonials">
        <h2 className="hf-h2">{TESTIMONIALS.heading}</h2>
        <div className="hf-testimonials__grid">
          {TESTIMONIALS.items.map((t) => (
            <figure key={t.name} className="hf-testimonial">
              <blockquote className="hf-testimonial__quote">“{t.quote}”</blockquote>
              <figcaption className="hf-testimonial__by">
                <span className="hf-testimonial__name">{t.name}</span>
                <span className="hf-testimonial__detail">{t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Block>
    ),
    subscribe: () => (
      <Block {...common('subscribe')} animKey="subscribe">
        <h2 className="hf-h2">{SUBSCRIBE.heading}</h2>
        <p className="hf-subscribe__body">{SUBSCRIBE.body}</p>
        <form className="hf-subscribe__form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="hf-subscribe-email" className="hf-sr">
            {SUBSCRIBE.placeholder}
          </label>
          <input
            id="hf-subscribe-email"
            type="email"
            className="hf-subscribe__input"
            placeholder={SUBSCRIBE.placeholder}
            tabIndex={-1}
          />
          <button type="submit" className="hf-btn-primary hf-subscribe__submit" tabIndex={-1}>
            {SUBSCRIBE.button}
          </button>
        </form>
      </Block>
    ),
    contact: () => (
      <Block {...common('contact')}>
        <h2 className="hf-h2">{CONTACT.heading}</h2>
        <p className="hf-contact__body">{CONTACT.body}</p>
        <form className="hf-contact__form" onSubmit={(e) => e.preventDefault()}>
          <div className="hf-field">
            <label htmlFor="hf-name">Name</label>
            <input id="hf-name" type="text" tabIndex={-1} />
          </div>
          <div className="hf-field">
            <label htmlFor="hf-email">Email</label>
            <input id="hf-email" type="email" tabIndex={-1} />
          </div>
          <div className="hf-field">
            <label htmlFor="hf-class">Which class?</label>
            <select id="hf-class" tabIndex={-1}>
              <option>Gentle Flow</option>
              <option>Restore</option>
              <option>Morning Light</option>
            </select>
          </div>
          <button
            type="submit"
            className="hf-btn-primary hf-contact__submit"
            tabIndex={-1}
          >
            Say hello
          </button>
        </form>
      </Block>
    ),
  }

  // Testimonials only exists once the assistant has added it.
  const isVisible = (id: BlockId) =>
    !isDeleted(id) && (id !== 'testimonials' || doc.testimonialsAdded)

  // Between-blocks inserter — the real Gutenberg gap affordance. Rendered on
  // each boundary between two adjacent visible blocks. Hover the gap → blue
  // line + blue "+" square. Click "+" → opens a quick-inserter Popover (3 block
  // suggestions + "Browse all"); the glyph becomes "×". Only one gap open at a
  // time. Click "×" again or outside → closes.
  const shown = doc.order.filter(isVisible)

  return (
    <div
      className="hf-canvas-wrap"
      onClick={(e) => {
        // Click on empty canvas space (not inside a block) deselects.
        if (!(e.target as HTMLElement).closest('.hf-block')) onDeselect()
      }}
    >
      <div className="hf-canvas" aria-label="Willow Room — site draft">
        <SiteNav current="home" />

        {shown.map((id, i) => {
          const isLast = i === shown.length - 1
          const isOpen = openGap === i
          return (
            <Fragment key={id}>
              {renderers[id]()}
              {!isLast && (
                <div
                  className={`hf-inserter${isOpen ? ' is-open' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="hf-inserter__line" />
                  <button
                    type="button"
                    className="hf-inserter__btn"
                    ref={(el) => {
                      inserterAnchors.current[i] = el
                    }}
                    aria-label={isOpen ? 'Close inserter' : 'Add block'}
                    aria-expanded={isOpen}
                    onClick={() => setOpenGap(isOpen ? null : i)}
                  >
                    <Icon icon={isOpen ? close : plus} size={20} />
                    {!isOpen && <span className="hf-inserter__tip">Add block</span>}
                  </button>
                  {isOpen && (
                    <Popover
                      anchor={inserterAnchors.current[i]}
                      placement="bottom"
                      onClose={() => setOpenGap(null)}
                      offset={8}
                      className="hf-quick-inserter"
                    >
                      <div
                        className="hf-quick"
                        role="dialog"
                        aria-label="Add a block"
                      >
                        <div className="hf-quick__grid">
                          {QUICK_INSERT_BLOCKS.map((b) => (
                            <div key={b.label} className="hf-quick__item" aria-hidden="true">
                              <span className="hf-quick__icon">
                                <Icon icon={b.icon} size={24} />
                              </span>
                              <span className="hf-quick__label">{b.label}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="primary"
                          __next40pxDefaultSize
                          className="hf-quick__browse"
                        >
                          Browse all
                        </Button>
                      </div>
                    </Popover>
                  )}
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
