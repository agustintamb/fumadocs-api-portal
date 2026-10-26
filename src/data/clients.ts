export interface Client {
  name: string
  slug: string
}

export const CLIENTS: Client[] = [
  { name: 'Google', slug: 'google' },
  { name: 'Spotify', slug: 'spotify' },
  { name: 'Netflix', slug: 'netflix' },
  { name: 'Airbnb', slug: 'airbnb' },
  { name: 'Uber', slug: 'uber' },
  { name: 'Stripe', slug: 'stripe' },
  { name: 'Shopify', slug: 'shopify' },
  { name: 'GitHub', slug: 'github' },
]
