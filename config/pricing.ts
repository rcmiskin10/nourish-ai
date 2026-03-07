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
    meal_plans: 3,
    ai_recipes_per_week: 5
  },

  plans: [
    {
      id: 'free',
      name: 'Free',
      description: 'Get started with basic AI-powered meal planning',
      price: { monthly: 0 },
      limits: {
        meal_plans: 3,
        ai_recipes_per_week: 5
      },
      features: [
        'Up to 5 AI-generated recipes per week',
        '1 dietary restriction filter',
        'Basic nutritional breakdown (calories & macros)',
        'Limited recipe library access',
        'Save up to 3 meal plans',
        'Ad-supported experience'
      ],
      cta: 'Get Started Free',
    },
    {
      id: 'plus',
      name: 'NourishAI Plus',
      description: 'Unlimited AI recipes with advanced personalization',
      price: { monthly: 6.99, yearly: 49.99 },
      priceId: process.env.STRIPE_PRICE_PLUS,
      limits: {
        meal_plans: -1,
        ai_recipes_per_week: -1
      },
      features: [
        'Unlimited AI recipe generation',
        'Combine up to 3 dietary restrictions',
        'Full weekly meal plan generation',
        'Smart grocery list with pantry subtraction',
        'Micronutrient tracking',
        'Adaptive AI learning from your ratings',
        'Ad-free experience',
        'Recipe history & favorites'
      ],
      highlighted: true,
      cta: 'Start Free Trial',
    },
    {
      id: 'family',
      name: 'NourishAI Family',
      description: 'Complete household meal planning for the whole family',
      price: { monthly: 11.99, yearly: 89.99 },
      priceId: process.env.STRIPE_PRICE_FAMILY,
      limits: {
        meal_plans: -1,
        ai_recipes_per_week: -1
      },
      features: [
        'Everything in Plus',
        'Multi-profile support (up to 6 members)',
        'Allergy severity tiering with cross-contamination alerts',
        'Cultural cuisine preferences',
        'Food waste tracking dashboard',
        'Priority access to new AI features',
        'Grocery delivery integration (Instacart)',
        'Priority email support'
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
