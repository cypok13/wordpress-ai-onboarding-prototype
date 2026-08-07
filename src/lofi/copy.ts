// Real copy strings — verbatim from docs/22-pd5-content-ux-writing.md §C. NO lorem.

export const COPY = {
  intakePromptHeading: "Tell me what you're making.",
  intakePromptPlaceholder: 'e.g. a calm site for my neighborhood yoga studio',
  intakeContinue: 'Continue',
  intakeUnderstoodHeading: "Here's what I understood — edit anything:",
  intakeCaption:
    'I proposed these from your prompt — change any of them. You decide, not me.',
  intakeAddDetail: '+ add detail',
  intakeGenerate: 'Generate my site',
  intakeBack: '← Back',
  intakeSellsNo: 'Sells online: no',
  intakeSellsYes: 'Sells online: yes',
  intentBarLabel: 'Your intent',
  intentBarCaption: 'Change a chip — the AI reshapes that section, and it becomes yours.',
  toneChipKind: 'tone',
  toneUndo: 'Undo tone change',
  streamingHeader: 'Building your site…',
  milestones: [
    'Writing your homepage…',
    'Adding your services…',
    'Choosing images…',
  ],
  streamingComplete: "Your draft's ready — 5 sections. Launch it, or take a look first.",
  controlTransfer:
    "This is yours now — launch as-is, or edit anything first. Nothing's locked.",
  firstRunHint:
    "Launch as-is whenever you're ready — or select any section to change it.",
  planStructure:
    'I built four pages from your idea: a homepage, About, Services, and Contact.',
  planGuess:
    "The words are my best guess from your prompt — edit anything that isn't quite you.",
  badgeDraft: 'AI draft',
  badgeEdited: 'Edited by you',
  badgeUnsure: 'AI draft · not sure',
  lowConfidence: "I wasn't sure about this one — worth a look.",
  emptySection:
    "I couldn't fill this section. Add your own, or ask me to try again.",
  generationError:
    "This section didn't generate — the rest of your site is fine. Try again, or write it yourself.",
  regenerateStatus: 'Making a new version — your current one is saved.',
  undo: 'Undo',
  undoHover: 'Restore your previous version',
  refreshAllTitle: 'Refresh the whole site?',
  launchReady: "Your site's ready to go live.",
  optionFree: 'Go live free at',
  optionDomain: 'Use my own domain — from $18/yr',
  addressLabel: 'Your address',
  addressHelp: 'You can change this anytime',
  costConfirm:
    "You'll be charged $18/yr for yourname.com. Your site stays live either way. Continue?",
  domainTaken: 'That address is taken — try another.',
  launchSuccess: "You're live. Visit your site, or keep editing.",
  messageCap:
    "You've used all your AI messages. Upgrade to keep building — you can still edit everything by hand.",
  disabledRefresh: 'Refreshing your site — one moment.',
  inputPlaceholder: 'Ask me anything, or tell me what to change…',
  suggestions: [
    'Make the tone warmer',
    'Swap the hero image',
    'Try a different theme',
  ],
} as const

// Illustrative lo-fi demo: hardcoded per-tone Hero copy. Changing the tone chip
// swaps between these — it is NOT real generation.
export type Tone = 'Calm' | 'Energetic'

export const HERO_TONE_VARIANTS: Record<Tone, { headline: string; subhead: string }> = {
  Calm: {
    headline: 'A calm space for your practice',
    subhead: 'Unhurried classes for every body. Breathe, move, and slow down.',
  },
  Energetic: {
    headline: 'Move. Breathe. Come alive.',
    subhead: 'High-energy flows that leave you buzzing. Show up and light it up.',
  },
}

export type SectionId = 'hero' | 'about' | 'services' | 'contact' | 'gallery'

export interface SectionData {
  id: SectionId
  label: string
  prompt: string
  kind: 'normal' | 'lowConfidence' | 'empty'
}

// Draft content — grayscale placeholders, real structural copy per Promptframe (§E)
export const INITIAL_SECTIONS: SectionData[] = [
  {
    id: 'hero',
    label: 'Hero',
    prompt: 'handmade candles',
    kind: 'normal',
  },
  {
    id: 'about',
    label: 'About',
    prompt: 'handmade candles',
    kind: 'normal',
  },
  {
    id: 'services',
    label: 'Services',
    prompt: 'handmade candles',
    kind: 'normal',
  },
  {
    id: 'contact',
    label: 'Contact',
    prompt: 'handmade candles',
    kind: 'lowConfidence',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    prompt: 'handmade candles',
    kind: 'empty',
  },
]
