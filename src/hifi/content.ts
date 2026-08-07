// Verbatim real copy for "Willow Room" — a neighborhood yoga studio.
// Do NOT invent placeholder or hand-holding copy. Every string here ships as-is.

// Named tones for the "Change tone" menu (Wix / WP.com AI precedent). The
// current tone is shown to the user before they pick a target — our
// transparency differentiator (no competitor exposes the detected tone).
export type Tone =
  | 'Friendly'
  | 'Professional'
  | 'Confident'
  | 'Casual'
  | 'Playful'

export const TONE_OPTIONS: Tone[] = [
  'Professional',
  'Friendly',
  'Confident',
  'Casual',
  'Playful',
]

// The tone the draft was generated in (shown as "Current: Friendly").
export const INITIAL_TONE: Tone = 'Friendly'

export type Provenance = 'ai' | 'edited'

export type BlockId =
  | 'hero'
  | 'about'
  | 'classes'
  | 'schedule'
  | 'testimonials'
  | 'contact'
  | 'subscribe'

export interface HeroContent {
  kicker: string
  headline: string
  subhead: string
  primaryCta: string
  ghostCta: string
}

export interface AboutContent {
  heading: string
  body: string
}

export interface ClassItem {
  title: string
  description: string
}

// --- Tone-reactive blocks (Hero + About), one real variant per named tone ---

export const HERO_BY_TONE: Record<Tone, HeroContent> = {
  Friendly: {
    kicker: 'Neighborhood yoga',
    headline: 'Room to breathe.',
    subhead: 'Small classes and unhurried teaching, five minutes from your door.',
    primaryCta: 'Book a class',
    ghostCta: 'See the schedule',
  },
  Professional: {
    kicker: 'Neighborhood yoga',
    headline: 'A considered practice.',
    subhead: 'Small-group instruction and structured progression, close to home.',
    primaryCta: 'Book a class',
    ghostCta: 'See the schedule',
  },
  Confident: {
    kicker: 'Neighborhood yoga',
    headline: 'Your strongest hour.',
    subhead: 'Focused classes that meet you where you are and move you forward.',
    primaryCta: 'Book a class',
    ghostCta: 'See the schedule',
  },
  Casual: {
    kicker: 'Neighborhood yoga',
    headline: 'Come as you are.',
    subhead: 'Easygoing classes down the street — no experience, no pressure.',
    primaryCta: 'Book a class',
    ghostCta: 'See the schedule',
  },
  Playful: {
    kicker: 'Neighborhood yoga',
    headline: 'Move. Breathe. Come alive.',
    subhead: 'High-energy flows that leave you buzzing — show up and light it up.',
    primaryCta: 'Book a class',
    ghostCta: 'See the schedule',
  },
}

export const ABOUT_BY_TONE: Record<Tone, AboutContent> = {
  Friendly: {
    heading: 'A calmer way to move.',
    body: 'Willow Room began with a simple belief: movement should feel like rest. We keep classes small so every body gets attention — first-timers and ten-year regulars alike.',
  },
  Professional: {
    heading: 'Our approach.',
    body: 'Willow Room offers small-group yoga built on careful, progressive teaching. Every class is capped so each student receives individual attention, from first session to tenth year.',
  },
  Confident: {
    heading: 'Why Willow Room.',
    body: 'We built Willow Room on one idea: real attention changes your practice. Small classes, experienced teachers, steady progress — whether it is week one or year ten.',
  },
  Casual: {
    heading: 'A bit about us.',
    body: 'Willow Room is your neighborhood studio. We keep classes small and the vibe easy, so everyone gets looked after — new folks and longtime regulars alike.',
  },
  Playful: {
    heading: 'Come move with us.',
    body: 'Willow Room is built for momentum. Small, high-energy classes where every body gets attention — whether it’s week one or year ten.',
  },
}

// --- Static blocks (not tone-reactive) ---

export const CLASSES: { heading: string; items: ClassItem[] } = {
  heading: 'Classes',
  items: [
    { title: 'Gentle Flow', description: 'a slow, breath-led practice for any body.' },
    { title: 'Restore', description: 'long holds and deep stretches to unwind the week.' },
    { title: 'Morning Light', description: 'a quiet start before the day begins.' },
  ],
}

export const SCHEDULE: { heading: string; rows: { day: string; detail: string }[] } = {
  heading: 'This week',
  rows: [
    { day: 'Mon 7:00', detail: 'Morning Light' },
    { day: 'Wed 6:00', detail: 'Gentle Flow' },
    { day: 'Sat 9:00', detail: 'Restore' },
  ],
}

export const CONTACT: { heading: string; body: string; button: string } = {
  heading: 'Come by.',
  body: 'Your first class is on us. Not sure where to start? We’ll help you find the right fit.',
  button: 'Say hello',
}

// --- Subscribe (composed block — added only when the "newsletter" intent is
// selected on the goal step; proves the multi-intent → composed-draft thesis).
export const SUBSCRIBE: {
  heading: string
  body: string
  placeholder: string
  button: string
} = {
  heading: 'Stay in the loop.',
  body: 'Occasional updates on new classes and next week’s schedule — no more than a note or two a month.',
  placeholder: 'Your email',
  button: 'Subscribe',
}

export const SITE_TITLE = 'Willow Room'

// Site navigation (rendered in the canvas header — real site chrome, not editor UI).
export const SITE_NAV = ['Home', 'Classes', 'Schedule', 'About', 'Contact'] as const

// --- The pages of the generated draft ---
// The assistant promises five pages, so the editor has to be able to reach all
// five. Home and Contact are built; the other three render a labelled stub.
export type PageId = 'home' | 'about' | 'classes' | 'schedule' | 'contact'

export const PAGES: { id: PageId; title: string; kind: string }[] = [
  { id: 'home', title: 'Home', kind: 'Homepage' },
  { id: 'about', title: 'About', kind: 'Page' },
  { id: 'classes', title: 'Classes', kind: 'Page' },
  { id: 'schedule', title: 'Schedule', kind: 'Page' },
  { id: 'contact', title: 'Contact', kind: 'Page' },
]

export function pageTitle(id: PageId): string {
  return PAGES.find((p) => p.id === id)?.title ?? 'Home'
}

// The Contact page — the one other page built for real, from the same block
// types as the home draft (heading, paragraph, detail rows, form).
export const CONTACT_PAGE: {
  heading: string
  body: string
  detailsHeading: string
  details: { label: string; value: string }[]
  formHeading: string
} = {
  heading: 'Get in touch.',
  body: 'Your first class is on us. Tell us what you are after and we will point you to the class that fits.',
  detailsHeading: 'Find us',
  details: [
    { label: 'Studio', value: '114 Willow Street, Unit 2' },
    { label: 'Hours', value: 'Mon to Sat, 6:30am to 8:00pm' },
    { label: 'Email', value: 'hello@willowroom.com' },
  ],
  formHeading: 'Send us a note',
}

// Honest stub for the pages we did not build out. Never dressed up as content.
export const PAGE_STUB_NOTE =
  'This page is part of the draft. It is not built out in this prototype — Home and Contact are.'

// Command palette copy. Group labels are ours; the search placeholder and the
// empty state match the real Gutenberg palette.
export const PALETTE = {
  label: 'Command palette',
  placeholder: 'Search commands and settings',
  pagesGroup: 'Pages',
  commandsGroup: 'Commands',
  empty: 'No results found.',
  currentTag: 'Current',
  pageTag: 'Page',
  commandTag: 'Command',
  // "Go to: X" is Gutenberg's own label shape for moving between editor panels
  // ("Go to: Styles", "Go to: Templates"). Undo and Redo are its verbatim labels.
  undo: 'Undo',
  redo: 'Redo',
  goAssistant: 'Go to: Assistant',
  goBlock: 'Go to: Block settings',
  goDesign: 'Go to: Design',
  launch: 'Launch your site',
} as const

// --- Testimonials (structural block the assistant can add on request) ---

export interface Testimonial {
  quote: string
  name: string
  detail: string
}

export const TESTIMONIALS: { heading: string; items: Testimonial[] } = {
  heading: 'From the mat',
  items: [
    {
      quote: 'I came in tense and left lighter. The small classes make all the difference.',
      name: 'Priya R.',
      detail: 'Member since 2022',
    },
    {
      quote: 'First studio where I never felt like the slowest one in the room.',
      name: 'Daniel M.',
      detail: 'Gentle Flow regular',
    },
    {
      quote: 'A quiet hour that resets my whole week.',
      name: 'Lena K.',
      detail: 'Morning Light',
    },
  ],
}

// --- Step 4: the Publish paywall (Launch → publish the draft) — the publish spec ---
// The terminal monetization beat. ONE screen that flexes by carried intent:
// presence (default) or newsletter (deltas). Publishing is always free; the
// paywall gates expansion (domain/plan), never the core win. All copy below is
// WP-voice, verbatim from spec §5.1 / §5.2 — do NOT paraphrase.
//
// Intent variant: read from Flow's carried `goals` — if 'newsletter' is present
// → newsletter variant. A `?intent=` URL override forces a variant for demo
// determinism, but the default reads the carried goals (spec §3.5).

export type PublishVariant = 'presence' | 'newsletter'

export function publishVariant(goals: string[], override?: string | null): PublishVariant {
  if (override === 'newsletter' || override === 'presence') return override
  return goals.includes('newsletter') ? 'newsletter' : 'presence'
}

// Shared chrome + the free-path / BYO / confirmation copy. Both variants describe
// the SAME draft (see PUBLISH_NEWSLETTER below), so the domains are shared too.
export const PUBLISH = {
  brand: 'WordPress.com',
  back: 'Back',

  // The live address of the published draft (illustrative — spec §9). The paid
  // suggestion and the option copy live in PUBLISH_OPTIONS below.
  freeDomain: 'willowroom.wordpress.com',

  // B-conf — go-live-free confirmation §5.1
  confirmTitle: 'You’re live',
  confirmViewSite: 'View site',
  confirmCopyLink: 'Copy link',
  confirmCopied: 'Link copied',

  // B5 connect stub label
  connectStubTitle: 'Connect an existing domain',
  connectStubLine:
    'This would continue in WordPress.com’s prepared domain-connection flow — the transfer / map setup.',

  // Domain-search stub availability results (spec §6.3 — real WP pattern, stub results)
  searchPlaceholder: 'Search for a domain',
  searchCta: 'Search',
  searchIntro: 'Claim your space',
  searchStubNote: 'Availability shown for illustration — real results are checked when you go live.',
} as const

// B3–B5 — the three publish options, ONE row standard (revised 2026-08-05 against
// the real WP.com "Claim your space on the web" results page, which is the DS
// reference for this pattern): badge chip · the thing you're choosing in display
// type · a STRUCTURED price (struck-through original → green US$0 → one caption
// line) · the CTA on the right. The old prose paragraph in the domain card is
// gone — WP.com never states price as prose, and four lines of it read as
// boilerplate nobody parses.
//
// The caption still carries BOTH year-two costs: spec §3.3 (MUST) requires the
// recurring price to sit in the same visual field as "free for the first year".
// Compressing the disclosure is allowed; dropping it would make us the dark
// pattern we criticise. Prices illustrative (real ones are auth-gated, §9).
export interface PublishOption {
  id: 'domain' | 'free' | 'byo'
  /** Only the merchandised option carries a badge (Calypso does the same). */
  badge?: string
  /** The object of the choice, in display type (a domain, not a verb). */
  name: string
  /** Struck-through list price, when the offer discounts one. */
  priceStrike?: string
  priceNow: string
  caption: string
  cta: string
  /** At most one quiet link per card. */
  quietLink?: string
  /** Only the free path is wired; the others are visible no-op stubs. */
  active?: boolean
}

export const PUBLISH_OPTIONS: readonly PublishOption[] = [
  {
    id: 'domain',
    badge: 'Recommended',
    name: 'willowroom.com',
    priceStrike: 'US$18',
    priceNow: 'US$0',
    caption:
      'For the first year, with the annual Personal plan (US$48/year). After that: US$48/year for the plan, about US$18/year for the domain.',
    cta: 'Claim domain',
    quietLink: 'Search for a different domain',
  },
  {
    id: 'free',
    name: 'willowroom.wordpress.com',
    priceNow: 'US$0',
    caption: 'Always. No plan, no renewal — add a custom domain whenever you’re ready.',
    cta: 'Go live free',
    active: true,
  },
  {
    id: 'byo',
    // No placeholder domain here: there is no address to name yet, so the slot
    // states the action instead (design decision).
    name: 'Connect a domain you own',
    priceNow: 'US$0',
    caption: 'To connect. You keep paying your registrar for the domain itself.',
    cta: 'Connect',
  },
] as const

// Presence header + subhead (B2) — VERBATIM §5.1
export const PUBLISH_PRESENCE = {
  header: 'Willow Room is ready to go live',
  subhead:
    'Go live free on a WordPress.com address, or claim a domain you own. Either way, your site is live right away.',
} as const

// Newsletter deltas (B2 header/subhead + B6 subscribe-assurance) — §5.2, revised
// 2026-08-05. The newsletter intent is COMPOSED onto the same draft (the design spec: the
// newsletter goal inserts a Subscribe section into the Willow Room site), so the
// variant keeps the same site name, preview and domains — only the framing and
// the subscribe assurance change. A separate "Open Me Carefully" newsletter site
// was spec fiction: the flow never produces a second draft, so naming one here
// contradicted the preview and the domain suggestion on the same screen.
export const PUBLISH_NEWSLETTER = {
  header: 'Willow Room is ready to go live and send',
  subhead: 'Go live free and readers can subscribe from the first minute. Or claim a domain you own.',
  subscribeAssurance:
    'Your subscribe form goes live too — readers can subscribe the moment you go live.',
} as const

// --- The plan grid ("There's a plan for you") — reused as a CONSTANT (spec §6.2 /
// §7). The real WordPress.com annual plan tiers; the annual Personal plan is
// pre-highlighted as the one that includes the free-domain-first-year (a
// confirmation of what B3 promised, not a surprise choice). Prices illustrative.

export interface PlanTier {
  id: string
  name: string
  price: string // annual, per-month framing (WP.com grid convention)
  billed: string
  tagline: string
  features: string[]
  includesFreeDomain: boolean
}

export const PLAN_GRID = {
  brand: 'WordPress.com',
  back: 'Back',
  title: 'There’s a plan for you',
  sub: 'Your free domain for the first year comes with the annual Personal plan. Pick that, or go bigger.',
  billingNote: 'Prices are billed annually. The free domain applies to any plan’s first year.',
  freeDomainBadge: 'Free domain — first year',
  cta: 'Continue to checkout',
  checkoutStub: 'Checkout',
  checkoutStubLine:
    'This would continue in WordPress.com’s prepared checkout — plan + domain confirmed on one order.',
  tiers: [
    {
      id: 'personal',
      name: 'Personal',
      price: '$4',
      billed: '$48 billed yearly',
      tagline: 'A custom domain and an ad-free site.',
      features: ['Free domain for one year', 'Ad-free', 'Unlimited pages', 'Email support'],
      includesFreeDomain: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$8',
      billed: '$96 billed yearly',
      tagline: 'More design tools and built-in stats.',
      features: ['Everything in Personal', 'Premium themes', 'Site stats', 'Live chat support'],
      includesFreeDomain: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: '$25',
      billed: '$300 billed yearly',
      tagline: 'Plugins, themes, and the tools to grow.',
      features: ['Everything in Premium', 'Install plugins', 'Upload themes', 'SFTP & database access'],
      includesFreeDomain: true,
    },
    {
      id: 'commerce',
      name: 'Commerce',
      price: '$45',
      billed: '$540 billed yearly',
      tagline: 'Everything you need to sell online.',
      features: ['Everything in Business', 'Accept payments', 'Shipping & tax tools', 'Unlimited products'],
      includesFreeDomain: true,
    },
  ] as PlanTier[],
} as const

// Stub domain-search results (spec §6.3) — the suggestion is always available in
// this prototype; alternates render as a stub availability list.
export const DOMAIN_SEARCH_RESULTS = [
  { domain: 'willowroom.com', status: 'available', price: 'Free for a year, then ~$18/year' },
  { domain: 'willowroom.studio', status: 'available', price: 'Free for a year, then ~$22/year' },
  { domain: 'willowroomyoga.com', status: 'available', price: 'Free for a year, then ~$18/year' },
  { domain: 'willow.room', status: 'taken', price: 'Taken' },
] as const

// --- Chat assistant (docked, conversational) ---

export type ChatRole = 'ai' | 'user'

export interface ChatMessage {
  id: string
  role: ChatRole
}

// The seeded editor greeting. References the intake answers AND the goals the
// user confirmed on the multi-select — this is the unification proof: one prompt
// carrying multiple intents is carried into the editor as one composed draft.
export function buildGreeting(goalIds: string[]): string {
  const has = (id: string) => goalIds.includes(id)
  const extras: string[] = []
  if (has('newsletter')) extras.push('a subscribe section so visitors can get your updates')
  if (has('blog')) extras.push('a blog to publish posts')

  // Writing policy: uncertainty is structural (the draft is editable, and says so),
  // never hedged in the assistant's own sentences. "The words are my best guess"
  // was the hedge. The closing question is the product's own shape — Big Sky ends
  // a build with "Your site is ready! What would you like to do next?".
  if (extras.length === 0) {
    return `I built this from your answers: a calm neighborhood yoga studio with booking and a schedule. Here's the first draft — ${GREETING_PAGES_CLAUSE} Edit anything, or tell me what to change. What would you like to do first?`
  }

  const extrasText =
    extras.length === 1 ? extras[0] : `${extras.slice(0, -1).join(', ')} and ${extras[extras.length - 1]}`
  return `I built this from your answers: a calm neighborhood yoga studio with booking and a schedule, plus ${extrasText}. Here's the first draft — ${GREETING_PAGES_CLAUSE} Edit anything, or tell me what to change. What would you like to do first?`
}

// The page list the greeting promises. "a homepage, plus … pages" so it cannot
// be read as the identically-named sections on the home page. The names in it
// are rendered as clickable chips (see GREETING_PAGE_CHIPS).
const GREETING_PAGES_CLAUSE =
  'a homepage, plus About, Classes, Schedule, and Contact pages.'

// Word → page the greeting chips link to. Matched case-sensitively against the
// greeting body, so the lowercase "a schedule" earlier in the sentence is left
// as plain text.
export const GREETING_PAGE_CHIPS: { word: string; page: PageId }[] = [
  { word: 'homepage', page: 'home' },
  { word: 'About', page: 'about' },
  { word: 'Classes', page: 'classes' },
  { word: 'Schedule', page: 'schedule' },
  { word: 'Contact', page: 'contact' },
]

// Suggested prompts a reviewer can click to run the demo without guessing wording.
// Action-led, specific to the draft, reversible (CARE-shaped, the design spec §D).
// Includes one STRUCTURAL move (add testimonials) beyond cosmetic tone.
export const CHAT_SUGGESTIONS = [
  'Make the hero more playful',
  'Rewrite the hero as professional',
  'Add a testimonials section',
] as const

export const CHAT_INPUT_PLACEHOLDER =
  'Tell the assistant what to change'

// Canned intent matching — no backend. Keyword match → an action + a reply.
export type ChatAction =
  | { kind: 'tone'; tone: Tone }
  | { kind: 'shorten-about' }
  | { kind: 'add-testimonials' }
  | { kind: 'none' }

export interface CannedReply {
  action: ChatAction
  reply: string
}

export function matchIntent(raw: string): CannedReply {
  const t = raw.toLowerCase()
  const has = (...words: string[]) => words.some((w) => t.includes(w))

  if (has('testimonial', 'review', 'quotes', 'social proof')) {
    return {
      action: { kind: 'add-testimonials' },
      reply:
        'I added a testimonials section after your schedule, with three short quotes. Swap the names for real members whenever you like.',
    }
  }
  if (has('playful', 'fun', 'lively', 'upbeat', 'energetic', 'energy', 'warm', 'warmer')) {
    return {
      action: { kind: 'tone', tone: 'Playful' },
      reply:
        'Done — I gave the hero a more playful, high-energy tone. Undo it in the top bar if it goes too far.',
    }
  }
  if (has('professional', 'formal', 'serious', 'polished')) {
    return {
      action: { kind: 'tone', tone: 'Professional' },
      reply: 'Done — I rewrote the hero in a more professional tone. Take a look, or keep steering.',
    }
  }
  if (has('confident', 'bold', 'strong')) {
    return {
      action: { kind: 'tone', tone: 'Confident' },
      reply: 'Done — I rewrote the hero in a more confident tone. Undo any time.',
    }
  }
  if (has('casual', 'relaxed', 'easygoing', 'calm', 'calmer', 'gentle', 'softer')) {
    return {
      action: { kind: 'tone', tone: 'Casual' },
      reply: 'Done — I made the hero more casual and easygoing. Keep steering, or launch as-is.',
    }
  }
  if (has('shorten', 'shorter', 'trim', 'tighten') && t.includes('about')) {
    return {
      action: { kind: 'shorten-about' },
      reply:
        'I trimmed the About text to a tighter version. Your longer one is saved — undo to bring it back.',
    }
  }
  return {
    action: { kind: 'none' },
    reply:
      "I can rewrite text, change the tone, add sections, and swap images. I can't set up a store or payments yet — tell me what you'd like to change and I'll try.",
  }
}

// Shorter About body (the "Rewrite ▸ Shorter" transform), one per named tone.
export const ABOUT_SHORT_BY_TONE: Record<Tone, string> = {
  Friendly: 'Movement should feel like rest. We keep classes small so every body gets attention.',
  Professional:
    'Small-group yoga with careful, progressive teaching. Every class is capped for individual attention.',
  Confident:
    'Real attention changes your practice. Small classes, experienced teachers, steady progress.',
  Casual: 'Your neighborhood studio — small classes, easy vibe, everyone looked after.',
  Playful: 'Built for momentum. Small, high-energy classes where every body gets attention.',
}

// --- Step 0: Cold-start goal picker (our design — unify the intent, not the door) ---

export interface GoalOption {
  id: string
  title: string
  description: string
  /** Only wired paths are selectable; the rest render disabled. */
  enabled?: boolean
}

// The unified goal set. After the prompt, the AI pre-selects the intents it read
// (detectGoals) and the user adjusts — a multi-select, since one prompt can carry
// several intents. Only the wired path is selectable; the rest render disabled.
export const GOAL = {
  brand: 'WordPress.com',
  // Writing policy: a summary panel is declarative and speaks as "we" — the product's
  // own construction is "Thanks! Here are the details we'll use to build your
  // site." The old "Here's what I think" hedged about an inference the screen did
  // not show, and "I think" appears 0 times in 5,589 onboarding strings.
  title: "Here's what we'll build. Add anything we missed.",
  cta: 'Continue',
  options: [
    // Only the website path is wired end to end in this prototype. The rest are
    // shown but disabled rather than hidden: the set of things you can build is
    // part of the idea, and a disabled row is honest where a working-looking one
    // that leads nowhere is not.
    {
      id: 'website',
      title: 'Build a website',
      description: 'A site for your business, service, or idea.',
      enabled: true,
    },
    {
      id: 'store',
      title: 'Open an online store',
      description: 'Sell products or services with checkout.',
      enabled: false,
    },
    {
      id: 'blog',
      title: 'Start a blog',
      description: 'Publish posts and grow your readers.',
      enabled: false,
    },
    {
      id: 'newsletter',
      title: 'Launch a newsletter',
      description: 'Write and send straight to subscribers.',
      enabled: false,
    },
    {
      id: 'portfolio',
      title: 'Create a portfolio',
      description: 'Showcase your work.',
      enabled: false,
    },
  ] as GoalOption[],
} as const

// Canned intent extraction — no backend. Deterministic keyword match over the
// prompt, order-stable (website, store, blog, newsletter, portfolio). Returns the
// goal ids the AI "read" from the prompt; the user confirms/adjusts on the goal
// step. Website is always included when nothing else matched.
/** Goals the prototype actually builds — the AI never pre-selects a disabled row. */
export const ENABLED_GOAL_IDS = GOAL.options.filter((o) => o.enabled).map((o) => o.id)

export function detectGoals(prompt: string): string[] {
  const t = prompt.toLowerCase()
  const has = (...words: string[]) => words.some((w) => t.includes(w))

  const KEYWORDS: { id: string; words: string[] }[] = [
    { id: 'website', words: ['site', 'website', 'business', 'service', 'studio', 'booking', 'schedule', 'landing', 'company'] },
    { id: 'store', words: ['shop', 'store', 'sell', 'product', 'checkout', 'commerce', 'ecommerce'] },
    { id: 'blog', words: ['blog', 'post', 'article', 'essay', 'journal', 'writing'] },
    { id: 'newsletter', words: ['newsletter', 'subscribe', 'subscriber', 'mailing', 'updates', 'email list'] },
    { id: 'portfolio', words: ['portfolio', 'showcase', 'gallery', 'photograph'] },
  ]

  const order = ['website', 'store', 'blog', 'newsletter', 'portfolio']
  const matched = new Set(KEYWORDS.filter((k) => has(...k.words)).map((k) => k.id))
  // No default. This used to force-add 'website' when nothing matched, so the
  // assistant reported confidence it did not have — the black-box behaviour the
  // whole flow argues against. An empty result is honest: the question then asks
  // plainly instead of pre-filling a guess (see DISCOVERY.goalsHeadingCold).
  return order.filter((id) => matched.has(id) && ENABLED_GOAL_IDS.includes(id))
}

// --- Discovery: pre-fill the clarify slots the prompt already implied ---
// Deterministic keyword match over the prompt → a value for any clarify slot the
// user already stated, so the discovery card can pre-answer it (and show it as a
// "from your description" chip) instead of asking again. Returns only the slots
// the prompt implies; genuinely-missing slots are omitted and asked. This is the
// "smart AI" signal — it fixes "asks what I already said."
export function detectMissing(prompt: string): Partial<Record<ClarifyQuestionId, string>> {
  const t = prompt.toLowerCase()
  const has = (...words: string[]) => words.some((w) => t.includes(w))

  const found: Partial<Record<ClarifyQuestionId, string>> = {}

  // Look & feel — the strongest, most-stated signal.
  if (has('calm', 'minimal', 'quiet', 'serene', 'peaceful', 'clean')) found.look = 'Calm & minimal'
  else if (has('warm', 'friendly', 'welcoming', 'cozy', 'homely')) found.look = 'Warm & friendly'
  else if (has('bold', 'striking', 'punchy', 'vibrant')) found.look = 'Bold'
  else if (has('elegant', 'refined', 'luxury', 'premium', 'sophisticated')) found.look = 'Elegant'

  // Size — inferred from scope words in the prompt.
  if (has('landing', 'one page', 'single page', 'simple site')) found.size = 'One page'
  else if (has('small', 'neighborhood', 'neighbourhood', 'local', 'boutique')) found.size = 'A few key pages'
  else if (has('full', 'complete', 'everything', 'multi-page', 'multiple pages')) found.size = 'A full multi-page site'

  // Main goal — inferred from the verb of intent.
  if (has('booking', 'book', 'schedule', 'appointment', 'reservation')) found.goal = 'Bookings'
  else if (has('enquir', 'inquir', 'contact', 'quote', 'get in touch')) found.goal = 'Inquiries'
  else if (has('following', 'audience', 'subscriber', 'grow', 'community')) found.goal = 'Grow a following'

  return found
}

// --- Step 1: Unified intake (our design — the unifying intent layer) ---

export const INTAKE = {
  brand: 'WordPress.com',
  title: 'What are you making?',
  placeholder:
    'e.g. a small neighborhood yoga studio — calm, with class booking and a weekly schedule',
  // The Mara-persona intent the primary demo path submits.
  sampleIntent:
    'A small neighborhood yoga studio — calm, with class booking and a weekly schedule',
  cta: 'Build my site',
  // Escape hatch for users the AI-assistant flow doesn't serve, led by
  // MIGRATION. Visible-only stub (click = no-op); no migration flow is built.
  altTitle: 'Already have a site elsewhere?',
  altSub: 'Move it to WordPress.com — we’ll handle the move.',
  // Quiet inline escape for the expert/decided user — skip the assistant. Instead
  // of jumping straight to the site editor (which silently assumes "website"), the
  // link opens a light type-picker that routes per intent. The lead-in is plain
  // muted text; only the link is interactive.
  skipLead: 'Prefer to build it yourself?',
  skipLink: 'Pick what you’re building',
} as const

// --- Non-AI detour: the "what are you building?" type-picker (the design spec, REVISION
// 2026-07-31, Option d). Reached only by the muted inline link under the prompt —
// a voluntary opt-in DETOUR, not a co-equal front door. Each row routes to its
// real per-type prepared flow: "website" opens the blank site editor; the rest
// land on a labeled destination stub that names the correct WordPress.com flow.

export type BuildType = 'website' | 'store' | 'newsletter' | 'blog' | 'portfolio'

export interface TypeOption {
  id: BuildType
  title: string
  description: string
}

export const TYPE_PICKER = {
  brand: 'WordPress.com',
  back: 'Back to start',
  title: 'What are you building?',
  sub: 'Pick a starting point and we’ll take you straight there.',
  options: [
    {
      id: 'website',
      title: 'Website',
      description: 'A site for your business, service, or idea.',
    },
    {
      id: 'store',
      title: 'Online store',
      description: 'Sell products or services with checkout.',
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Write and send straight to subscribers.',
    },
    {
      id: 'blog',
      title: 'Blog',
      description: 'Publish posts and grow your readers.',
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Showcase your work.',
    },
  ] as TypeOption[],
} as const

// Per-type destination stubs (design-shape, non-interactive endpoints). "website"
// is NOT here — it reuses the real blank site editor. Each stub names the actual
// WordPress.com prepared flow it would continue into, in honest WP voice.
export const TYPE_DESTINATIONS: Record<
  Exclude<BuildType, 'website'>,
  { title: string; line: string }
> = {
  store: {
    title: 'Store setup',
    line: 'This would continue in WordPress.com’s prepared Store flow — the WooCommerce setup wizard.',
  },
  newsletter: {
    title: 'Newsletter setup',
    line: 'This would continue in WordPress.com’s prepared Newsletter flow — the Jetpack newsletter setup.',
  },
  blog: {
    title: 'Blog setup',
    line: 'This would continue in WordPress.com’s prepared Blog flow — the blog setup.',
  },
  portfolio: {
    title: 'Portfolio setup',
    line: 'This would continue in WordPress.com’s prepared Portfolio flow — the portfolio site setup.',
  },
} as const

export const TYPE_DEST_BACK = 'Back'

// --- Step 1.5: Clarify — the assistant gathers intent, transparently ---
// The answers here ARE the visible Intent Object: each pick becomes a persistent
// chip (Type · Tone · Sells), so the user watches their intent get built rather
// than trusting a black box. Real WP voice: plain, unhurried, no filler.

export type ClarifyQuestionId = 'size' | 'goal' | 'look'

export interface ClarifyOption {
  // `value` is what the answered chip shows; `label` is the option-card text.
  label: string
  value: string
}

export interface ClarifyQuestion {
  id: ClarifyQuestionId
  // The chip prefix, e.g. "Goal" → "Goal: Bookings".
  chipKey: string
  heading: string
  options: ClarifyOption[]
  // Whether the widget shows the inline "Write your own…" row. Only for questions
  // with a genuinely open answer space (main goal). Closed spectrums (size, look)
  // omit it — their presets are exhaustive enough; aesthetics refine in the editor.
  allowCustom?: boolean
}

// Closed questions (the design spec). The LAST option of every question is
// "Other" — selecting it reveals a small inline text input for a custom answer,
// which becomes the recorded intent value. The demo answers (picked via the
// normal chips) seed the editor greeting continuity.
export const CLARIFY = {
  intro: 'I need a couple of details, then I’ll build your site.',
  closing: 'Got it — building your site now.',
  // Canvas empty-state (compass) shown while the assistant gathers intent.
  emptyTitle: 'A few quick questions',
  emptyBody: 'Answer them and we’ll draft your site.',
  inputPlaceholder: 'Ask anything…',
  skip: 'Skip',
  summaryLabel: 'What we’ll build',
  // The last option value that opens the custom-answer input.
  otherValue: 'Other',
  otherPlaceholder: 'Type your answer…',
  otherSubmit: 'Add',
  questions: [
    {
      id: 'size',
      chipKey: 'Size',
      heading: 'How many pages do you need?',
      options: [
        { label: 'One page', value: 'One page' },
        { label: 'A few key pages', value: 'A few key pages' },
        { label: 'A full multi-page site', value: 'A full multi-page site' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      id: 'goal',
      chipKey: 'Goal',
      heading: 'What’s the main goal?',
      allowCustom: true,
      options: [
        { label: 'Bookings', value: 'Bookings' },
        { label: 'Inquiries', value: 'Inquiries' },
        { label: 'Grow a following', value: 'Grow a following' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      id: 'look',
      chipKey: 'Look',
      heading: 'What should your site look like?',
      options: [
        { label: 'Calm & minimal', value: 'Calm & minimal' },
        { label: 'Warm & friendly', value: 'Warm & friendly' },
        { label: 'Bold', value: 'Bold' },
        { label: 'Elegant', value: 'Elegant' },
        { label: 'Other', value: 'Other' },
      ],
    },
  ] as ClarifyQuestion[],
} as const

// --- Discovery copy (full-screen CHAT, one-question-at-a-time — the design spec, REV 3) ---
// Discovery is a full-screen chat (Lovable layout): the prompt is the first
// message; each answered question appends its question (AI) + answer (user) to the
// same thread as history; the CURRENT question is a widget floating above a chat
// composer at the bottom. Forward-only, with a visible "N of M" counter. Every
// question is pre-selected from the prompt where detected ("from your description").
export const DISCOVERY = {
  // The AI turn that opens discovery in the thread, right after the user's prompt.
  opener: "Great — I've got the gist. A few quick things and I'll build your site.",
  // Question heading (goals multi-select) — shown on the question widget.
  goalsHeading: "Here's what we'll build. Add anything we missed.",
  // Shown when the prompt gave us nothing to go on. Claiming a reading we don't
  // have would be the dishonest half of the same screen, so it just asks — in the
  // product's own question grammar (a plain wh-question with a concrete noun).
  goalsHeadingCold: 'What are you building?',
  // Shown on the question widget while it still holds the AI's pre-selected guess.
  prefilledNote: 'from your description',
  // The final Continue label (questions before it use GOAL.cta = "Continue").
  cta: 'Build my site',
  // Placeholder for the discovery chat composer — a neutral chat prompt (NOT the
  // editor's change-oriented placeholder, which is wrong for the answering role).
  composerPlaceholder: 'Ask the assistant anything',
  // Screen-reader summary of the resolved intent, appended to the thread on build.
  buildAck: 'Got it — building your site now.',
  // How a skipped question reads back in the thread as the user's turn.
  skippedAnswer: 'Skip for now.',
  // The inline free-text row on every question widget (Lovable style): a selection
  // control + a text input using this as the placeholder/label. Typing auto-selects
  // the row and captures the custom answer.
  otherLabel: 'Write your own answer',
} as const

// The AI-turn text for each discovery question, written into the thread as history
// once the question is answered (so the user always sees what they were asked).
export const DISCOVERY_QUESTION_PROMPTS: Record<'goals' | ClarifyQuestionId, string> = {
  goals: "First — what are you building? Pick everything that fits.",
  size: 'How many pages do you need?',
  goal: 'What’s the main goal?',
  look: 'What should your site look like?',
}

// --- Step 2: Full-screen blocking generation — intent carried into the editor ---

// The generation stage phrases, shown full-screen while the draft is built. Real
// WP.com opener/closer, with the yoga intent woven into the middle stages so the
// loader still proves intent carried. Rendered by Generating (full-screen, blocking).
export const SEAM_STAGES = [
  'Turning on the lights…',
  'Writing your homepage…',
  'Adding your classes and schedule…',
  'Choosing a calm look…',
  'Personalizing your site…',
] as const

// --- Block-action toolbar (Round 6, the design spec §4) ---

export const BLOCK_LABELS: Record<BlockId, string> = {
  hero: 'Hero',
  about: 'About',
  classes: 'Classes',
  schedule: 'Schedule',
  testimonials: 'Testimonials',
  contact: 'Contact',
  subscribe: 'Subscribe',
}

// "Try another version" shows the original intent that generated each block —
// transparency (Relume shows the generating prompt). Real fragments, no lorem.
export const BLOCK_SOURCE_PROMPT: Record<BlockId, string> = {
  hero: 'a welcoming headline for a neighborhood yoga studio',
  about: 'a short story about a small, attentive yoga studio',
  classes: 'the studio’s main class types with one-line descriptions',
  schedule: 'a weekly class schedule',
  testimonials: 'three short member quotes',
  contact: 'a friendly prompt to get in touch',
  subscribe: 'a subscribe section for studio updates',
}

// Rewrite ▸ named one-shot transforms. Only Shorter is wired (About); the rest
// are present-but-static in this build.
export const REWRITE_OPTIONS = ['Shorter', 'Longer', 'Simpler', 'Fix grammar'] as const
export type RewriteOption = (typeof REWRITE_OPTIONS)[number]

// "Ask AI to change this" — canned scoped reply per block (no backend). The
// user's words are echoed as the request; the AI confirms a scoped change.
export function scopedAskReply(blockLabel: string, request: string): string {
  return `I updated the ${blockLabel} block based on “${request}.” It’s scoped to this section only — undo in the top bar if it’s not right.`
}
