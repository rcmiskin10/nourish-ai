export interface PlanLimit {
  [key: string]: number
}

export interface Plan {
  id: string
  name: string
  description: string
  price: { monthly: number; yearly?: number }
  priceId?: string
  yearlyPriceId?: string
  limits: PlanLimit
  features: string[]
  highlighted?: boolean
  cta: string
}

export const pricingConfig: {
  model: 'freemium' | 'free-trial' | 'paid-only'
  trialDays?: number
  defaultLimits: PlanLimit
  plans: Plan[]
} = {
  model: 'freemium',

  defaultLimits: {
    entities: 3,
    recipes_per_day: 5,
    dietary_profiles: 1
  },

  plans: [
    {
      id: 'free',
      name: 'Free',
      description: 'Explore AI-powered recipe generation with basic features',
      price: { monthly: 0 },
      limits: {
        entities: 3,
        recipes_per_day: 5,
        dietary_profiles: 1
      },
      features: [
        'Up to 5 AI recipes per day',
        '1 dietary restriction profile',
        'Basic nutritional info (calories & macros)',
        'Ingredient-based recipe search',
        '3 saved meal plans',
        'Community recipe library access'
      ],
      cta: 'Get Started Free',
    },
    {
      id: 'plus',
      name: 'NourishAI Plus',
      description: 'Unlimited meal planning with full nutritional intelligence',
      price: { monthly: 6.99, yearly: 49.99 },
      priceId: process.env.STRIPE_PRICE_PLUS,
      limits: {
        entities: -1,
        recipes_per_day: -1,
        dietary_profiles: 3
      },
      features: [
        'Unlimited AI-generated recipes & meal plans',
        'Full nutritional breakdowns (micros, vitamins, minerals)',
        'Up to 3 dietary restriction profiles',
        'Smart grocery list generation',
        'Adaptive taste preference learning',
        'Food waste reduction suggestions',
        'Ad-free experience',
        'Priority recipe generation'
      ],
      highlighted: true,
      cta: 'Start 14-Day Free Trial',
    },
    {
      id: 'family',
      name: 'NourishAI Family',
      description: 'Unified meal planning for households with mixed dietary needs',
      price: { monthly: 11.99, yearly: 89.99 },
      priceId: process.env.STRIPE_PRICE_FAMILY,
      limits: {
        entities: -1,
        recipes_per_day: -1,
        dietary_profiles: 6
      },
      features: [
        'Everything in Plus',
        'Up to 6 household member profiles',
        'Unified meal planning with per-person substitutions',
        'Grocery delivery integration (Instacart, Amazon Fresh)',
        'Batch cooking & meal prep optimization',
        'Priority access to new features',
        'Family sharing & collaboration',
        'Dedicated family dashboard'
      ],
      cta: 'Start Family Trial',
    }
  ],
}

const planMap = new Map<string, Plan>()
for (const plan of pricingConfig.plans) {
  planMap.set(plan.id, plan)
}

export function getPlan(tier: string): Plan {
  return planMap.get(tier) || pricingConfig.plans[0]
}

export function getPlanByPriceId(priceId: string): string | null {
  for (const plan of pricingConfig.plans) {
    if (plan.priceId === priceId || plan.yearlyPriceId === priceId) {
      return plan.id
    }
  }
  return null
}

export function getLimits(tier: string | null): PlanLimit {
  if (!tier) return pricingConfig.defaultLimits
  const plan = planMap.get(tier)
  return plan?.limits || pricingConfig.defaultLimits
}

export function checkLimit(tier: string | null, limitKey: string, currentUsage: number): boolean {
  const limits = getLimits(tier)
  const limit = limits[limitKey]
  if (limit === undefined) return false
  if (limit === -1) return true
  return currentUsage < limit
}

export function isPaidTier(tier: string | null): boolean {
  if (!tier) return false
  const plan = planMap.get(tier)
  return plan ? plan.price.monthly > 0 : false
}

export function getFreePlan(): Plan | undefined {
  return pricingConfig.plans.find((p) => p.price.monthly === 0)
}

export function getPaidPlans(): Plan[] {
  return pricingConfig.plans.filter((p) => p.price.monthly > 0)
}

export function getHighlightedPlan(): Plan | undefined {
  return pricingConfig.plans.find((p) => p.highlighted)
}

export function getPlanPrice(tier: string | null): number {
  if (!tier) return 0
  const plan = planMap.get(tier)
  return plan?.price.monthly || 0
}
