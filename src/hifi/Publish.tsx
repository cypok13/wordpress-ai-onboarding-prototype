import './hifi.css'
import { useState } from 'react'
import { Button, Card, CardBody } from '@wordpress/components'
import { Icon, chevronLeft, check, external, link } from '@wordpress/icons'
import {
  HERO_BY_TONE,
  INITIAL_TONE,
  PLAN_GRID,
  PUBLISH,
  PUBLISH_NEWSLETTER,
  PUBLISH_OPTIONS,
  PUBLISH_PRESENCE,
  SITE_NAV,
  SITE_TITLE,
  publishVariant,
  type PublishOption,
} from './content'

// Step 4 — the Publish paywall (the publish spec). The terminal monetization beat,
// reached from the editor's Launch. ONE component that flexes by carried intent:
//   presence (default)  → domain-first, portfolio framing
//   newsletter          → same skeleton + subscribe-assurance (B6), send framing
// chosen by reading Flow's `goals` (or a `?intent=` override for demo determinism).
//
// Publishing is always free — the free path is legible and never buried. The
// paywall gates expansion (domain/plan), never the core win. The three paths —
// claim a paid domain, go live free, bring your own — read as three CONSISTENT
// option blocks (one card standard). Only "Go live free" is a functional CTA
// (→ live confirmation); the paid-domain and connect paths are visible no-op
// stubs (WP.com has full dedicated pages for those, out of scope here). The plan
// grid stays built but is no longer primary-wired. All user-facing copy is
// verbatim WP-voice from spec §5.

// Internal screen states (spec §6). The paywall is the landing state; the plan
// grid stays reachable but is no longer primary-wired. Only "Go live free" is an
// active CTA (→ confirm); the other option CTAs are visible no-op stubs. The
// confirm screen has no Back — the site is already published, it can't be undone.
type Screen = 'paywall' | 'plan' | 'checkout' | 'confirm'

interface PublishProps {
  onBack: () => void
  goals: string[]
}

function readIntentOverride(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('intent')
}

export function Publish({ onBack, goals }: PublishProps) {
  const variant = publishVariant(goals, readIntentOverride())
  const [screen, setScreen] = useState<Screen>('paywall')

  // Both variants publish the SAME composed draft (the newsletter goal adds a
  // Subscribe section to it — the design spec), so the live address is the same too.
  const freeDomain = PUBLISH.freeDomain

  // The confirmation screen is a terminal state — no Back (§6.4 revised): the
  // site is already published and can't be undone. Every other screen keeps a
  // non-destructive Back (to the editor from the paywall, to the paywall otherwise).
  return (
    <main className="pb" data-variant={variant}>
      {screen !== 'confirm' && (
        <Masthead onBack={screen === 'paywall' ? onBack : () => setScreen('paywall')} />
      )}

      <div className="pb__body">
        {screen === 'paywall' && (
          <Paywall
            variant={variant}
            freeDomain={freeDomain}
            onGoLiveFree={() => setScreen('confirm')}
          />
        )}
        {screen === 'plan' && <PlanGrid onContinue={() => setScreen('checkout')} />}
        {screen === 'checkout' && (
          <Stub title={PLAN_GRID.checkoutStub} line={PLAN_GRID.checkoutStubLine} />
        )}
        {screen === 'confirm' && <Confirmation freeDomain={freeDomain} />}
      </div>
    </main>
  )
}

// B1 — real WP chrome: logo + non-destructive Back.
function Masthead({ onBack }: { onBack: () => void }) {
  return (
    <header className="pb__masthead">
      <span className="pb__logo" aria-hidden="true" />
      <Button
        className="pb__back"
        variant="tertiary"
        icon={chevronLeft}
        iconSize={20}
        onClick={onBack}
        aria-label="Back"
      >
        {PUBLISH.back}
      </Button>
    </header>
  )
}

// --- The paywall landing state (B2–B6) ---
// Three parallel option blocks share ONE card standard (.pb__option): same white
// card, same border, same rhythm. They read as three consistent choices. Only
// "Go live free" is a functional CTA; every other CTA/link is a visible no-op
// stub (the paid domain-search and connect flows are out of scope here — WordPress.com has
// a full dedicated page for that, which is out of scope here).
function Paywall({
  variant,
  freeDomain,
  onGoLiveFree,
}: {
  variant: 'presence' | 'newsletter'
  freeDomain: string
  onGoLiveFree: () => void
}) {
  const copy = variant === 'newsletter' ? PUBLISH_NEWSLETTER : PUBLISH_PRESENCE

  return (
    <>
      {/* B2 — value-first header + small live preview thumbnail (approved as-is) */}
      <section className="pb__hero">
        <div className="pb__herotext">
          <h1 className="pb__title">{copy.header}</h1>
          <p className="pb__sub">{copy.subhead}</p>
          {variant === 'newsletter' && (
            <p className="pb__assurance">
              <Icon icon={check} size={18} />
              {PUBLISH_NEWSLETTER.subscribeAssurance}
            </p>
          )}
        </div>
        <SitePreview />
      </section>

      <div className="pb__options">
        {PUBLISH_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            // The free path publishes the site the flow actually built, so its
            // address comes from the variant rather than the static copy.
            name={option.id === 'free' ? freeDomain : option.name}
            onActivate={option.active ? onGoLiveFree : undefined}
          />
        ))}
      </div>
    </>
  )
}

// One row standard for all three options, ported from the component that renders
// the real "Claim your space on the web" results: Automattic/wp-calypso,
// `packages/domain-search/src/ui/domain-suggestion` (featured.skeleton.tsx +
// featured.scss). Its large-container layout is:
//   Card > CardBody(24px) > VStack[ VStack[badge, domainName], HStack[price, cta] ]
// so the CTA is centred against the PRICE ROW at the bottom of the card — not
// against the whole card — and the card itself uses the DS Card defaults (hairline
// 1px box-shadow ring, 8px radius, white surface), never a custom border.
//
// Merchandising happens through the badge and the CTA variant, not by making one
// card heavier than the others. Only the free path is wired; the rest are no-op
// stubs (WP.com has full dedicated pages for domain search and connect).
function OptionCard({
  option,
  name,
  onActivate,
}: {
  option: PublishOption
  name: string
  onActivate?: () => void
}) {
  return (
    <Card className="pb__option" size="large">
      <CardBody>
        {/* VStack: [badge, name] then the price/CTA row — Calypso's own
            FeaturedSkeleton layout for a large container. */}
        <div className="pb__optiontop">
          {option.badge && <span className="pb__badge">{option.badge}</span>}
          <h2 className="pb__optionname">{name}</h2>
        </div>
        <div className="pb__optionbottom">
          <div className="pb__priceblock">
            <p className="pb__pricerow">
              {option.priceStrike && (
                <span className="pb__pricewas">{option.priceStrike}</span>
              )}
              <span className="pb__pricenow">{option.priceNow}</span>
            </p>
            <p className="pb__pricecaption">{option.caption}</p>
            {option.quietLink && (
              <Button variant="link" className="pb__searchlink">
                {option.quietLink}
              </Button>
            )}
          </div>
          <Button
            variant={option.id === 'domain' ? 'primary' : 'secondary'}
            className="pb__optionbtn"
            __next40pxDefaultSize
            onClick={onActivate}
          >
            {option.cta}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

// B2 preview — a faithful STATIC render of the real Willow Room draft (site nav +
// hero copy + the real hero image) at thumbnail scale. This is a real render of
// the draft content (spec §4-B2), scaled down — not a fake generic screenshot.
function SitePreview() {
  const hero = HERO_BY_TONE[INITIAL_TONE]
  return (
    <div className="pb__preview" aria-label="Preview of your site draft">
      <div className="pb__previewframe" aria-hidden="true">
        <div className="pb__previewpage">
          <div className="pb__previewnav">
            <span className="pb__previewbrand">{SITE_TITLE}</span>
            <span className="pb__previewlinks">
              {SITE_NAV.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </span>
          </div>
          <div className="pb__previewhero">
            <div className="pb__previewcopy">
              <span className="pb__previewkicker">{hero.kicker}</span>
              <span className="pb__previewheadline">{hero.headline}</span>
              <span className="pb__previewsub">{hero.subhead}</span>
              <span className="pb__previewcta">{hero.primaryCta}</span>
            </div>
            <img className="pb__previewimg" src="/hero-yoga.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

// --- The plan grid (spec §6.2) — real WP.com "There's a plan for you" as a
// CONSTANT. Personal is pre-highlighted as the tier that carries the free domain
// B3 promised (a confirmation, not a surprise). The user can pick a higher tier.
function PlanGrid({ onContinue }: { onContinue: () => void }) {
  const [selected, setSelected] = useState('personal')
  return (
    <section className="pb__plan">
      <h1 className="pb__title pb__title--center">{PLAN_GRID.title}</h1>
      <p className="pb__sub pb__sub--center">{PLAN_GRID.sub}</p>

      <div className="pb__plangrid">
        {PLAN_GRID.tiers.map((tier) => {
          const isSelected = selected === tier.id
          const recommended = tier.id === 'personal'
          return (
            <button
              key={tier.id}
              type="button"
              className={`pb__plancard${isSelected ? ' is-selected' : ''}${recommended ? ' is-recommended' : ''}`}
              aria-pressed={isSelected}
              onClick={() => setSelected(tier.id)}
            >
              {recommended && (
                <span className="pb__planbadge">{PLAN_GRID.freeDomainBadge}</span>
              )}
              <span className="pb__planname">{tier.name}</span>
              <span className="pb__planprice">
                {tier.price}
                <span className="pb__planper">/mo</span>
              </span>
              <span className="pb__planbilled">{tier.billed}</span>
              <span className="pb__plantagline">{tier.tagline}</span>
              <ul className="pb__planfeatures">
                {tier.features.map((f) => (
                  <li key={f}>
                    <Icon icon={check} size={16} />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      <p className="pb__planbillingnote">{PLAN_GRID.billingNote}</p>
      <div className="pb__plancta">
        <Button variant="primary" __next40pxDefaultSize onClick={onContinue}>
          {PLAN_GRID.cta}
        </Button>
      </div>
    </section>
  )
}

// --- B-conf: the go-live-free confirmation (spec §6.4). A real live-confirmation,
// NOT a dead end. The later upgrade nudge is documented-only (§3.4) — not rendered.
function Confirmation({ freeDomain }: { freeDomain: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://${freeDomain}`).catch(() => {})
    }
    setCopied(true)
  }
  return (
    <section className="pb__confirm">
      <span className="pb__confirmcheck" aria-hidden="true">
        <Icon icon={check} size={40} />
      </span>
      <h1 className="pb__title pb__title--center">{PUBLISH.confirmTitle}</h1>
      <p className="pb__sub pb__sub--center">
        Your site is at{' '}
        <Button
          variant="link"
          className="pb__confirmurl"
          href={`https://${freeDomain}`}
          target="_blank"
          rel="noreferrer"
        >
          {freeDomain}
        </Button>
        .
      </p>
      <div className="pb__confirmactions">
        <Button
          variant="primary"
          icon={external}
          __next40pxDefaultSize
          href={`https://${freeDomain}`}
          target="_blank"
          rel="noreferrer"
        >
          {PUBLISH.confirmViewSite}
        </Button>
        <Button variant="secondary" icon={copied ? check : link} __next40pxDefaultSize onClick={copy}>
          {copied ? PUBLISH.confirmCopied : PUBLISH.confirmCopyLink}
        </Button>
      </div>
    </section>
  )
}

// --- Labeled stub (connect / checkout) — an honest named endpoint, not a dead end.
function Stub({ title, line }: { title: string; line: string }) {
  return (
    <section className="pb__stub">
      <span className="pb__stubbadge" aria-hidden="true">
        <Icon icon={check} size={28} />
      </span>
      <h1 className="pb__title pb__title--center">{title}</h1>
      <p className="pb__sub pb__sub--center">{line}</p>
      <p className="pb__stublabel">Prototype stub — labeled endpoint, not built.</p>
    </section>
  )
}
