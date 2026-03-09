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
    meal_plans: 5,
    recipes_per_day: 3,
    saved_recipes: 10
  },

  plans: [
    {
      id: 'free',
      name: 'Free',
      description: 'Discover AI-powered meal planning with essential features',
      price: { monthly: 0 },
      limits: {
        meal_plans: 5,
        recipes_per_day: 3,
        saved_recipes: 10
      },
      features: [
        'Up to 3 AI recipe suggestions per day',
        'Single-day meal plan generation',
        '1 diet type + up to 3 allergens',
        'Nutritional breakdown (calories, protein, carbs, fat)',
        'Save up to 10 favorite recipes',
        'Up to 5 meal plans'
      ],
      cta: 'Get Started Free',
    },
    {
      id: 'plus',
      name: 'Plus',
      description: 'Unlimited AI meal planning with advanced personalization',
      price: { monthly: 7.99, yearly: 59.99 },
      priceId: process.env.STRIPE_PRICE_PLUS,
      limits: {
        meal_plans: -1,
        recipes_per_day: -1,
        saved_recipes: -1
      },
      features: [
        'Unlimited AI recipe suggestions',
        'Weekly & monthly meal plan generation',
        'Unlimited dietary restrictions & allergy stacking',
        'Smart grocery lists (accounts for pantry items)',
        'Detailed micronutrient tracking',
        'Adaptive taste learning AI',
        'Recipe scaling for any serving size',
        'Unlimited saved recipes & plan history',
        'Food waste tracker with savings estimates'
      ],
      highlighted: true,
      cta: 'Start Free Trial',
    },
    {
      id: 'family',
      name: 'Family',
      description: 'Unified meal planning for the whole household',
      price: { monthly: 12.99, yearly: 99.99 },
      priceId: process.env.STRIPE_PRICE_FAMILY,
      limits: {
        meal_plans: -1,
        recipes_per_day: -1,
        saved_recipes: -1
      },
      features: [
        'Everything in Plus',
        'Up to 6 household member profiles',
        'Individual dietary profiles per member',
        'Unified family meal plans with per-person modifications',
        'Shared grocery lists with household collaboration',
        'Kid-friendly recipe mode',
        'Budget optimization for family meals',
        'Priority support'
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
