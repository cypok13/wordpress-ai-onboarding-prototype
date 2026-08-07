// Demo-simple intent parse. Illustrative, NOT real NLP — the point is that the
// AI's guess is visible and the user can edit every field (user = source of truth).

export interface IntentObject {
  type: string
  field: string
  tone: string
  sells: boolean
}

const SHOP_WORDS = ['shop', 'store', 'sell', 'sells', 'buy', 'product', 'products']

export function parseIntent(prompt: string): IntentObject {
  const text = prompt.toLowerCase()
  const isShop = SHOP_WORDS.some((w) => text.includes(w))

  if (isShop) {
    return {
      type: 'Online store',
      field: 'Handmade',
      tone: 'Warm',
      sells: true,
    }
  }

  return {
    type: 'Local service',
    field: 'Wellness',
    tone: 'Calm',
    sells: false,
  }
}
