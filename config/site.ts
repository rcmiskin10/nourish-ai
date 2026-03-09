import { Refrigerator, ShieldCheck, Brain, BarChart3, CalendarDays, ShoppingCart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  external?: boolean
}

export interface FooterLink {
  title: string
  href: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

export interface HeroContent {
  badge: string
  headline: string
  headlineHighlight: string
  subheadline: string
  primaryCta: { text: string; href: string }
  secondaryCta: { text: string; href: string }
  socialProof?: { text: string; rating: string }
}

export interface SiteConfig {
  name: string
  tagline: string
  description: string
  url: string
  company: string
  mainNav: NavItem[]
  dashboardNav: NavItem[]
  hero: HeroContent
  features: Feature[]
  techStack: Array<{ name: string; color: string }>
  footerSections: FooterSection[]
  footerCopyright: string
  social: {
    twitter?: string
    github?: string
    discord?: string
  }
}

export const siteConfig: SiteConfig = {
  name: 'NourishAI',
  tagline: 'AI-powered meal plans from what\'s already in your fridge',
  description: 'NourishAI generates personalized meal plans and recipes based on dietary restrictions, available ingredients, and nutritional goals.',
  url: process.env.NEXT_PUBLIC_APP_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    || 'http://localhost:3000',
  company: 'NourishAI',

  mainNav: [
    { title: 'Features', href: '/features' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'FAQ', href: '/#faq' }
  ],

  dashboardNav: [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Meal Plans', href: '/dashboard/meal_plans' },
    { title: 'Settings', href: '/dashboard/settings' }
  ],

  hero: {
    badge: 'AI-Powered Nutrition',
    headline: 'Turn Your Fridge Into',
    headlineHighlight: 'Personalized Meal Plans',
    subheadline: 'Tell NourishAI what\'s in your kitchen and your dietary needs — get instant, nutritionally accurate recipes that respect every restriction, allergy, and health goal. No more wasted food, no more guesswork.',
    primaryCta: { text: 'Get Started Free', href: '/register' },
    secondaryCta: { text: 'See How It Works', href: '/features' },
    socialProof: { text: 'Loved by 5,000+ home cooks with dietary restrictions', rating: '4.8/5' },
  },

  features: [
    {
      icon: Refrigerator,
      title: 'Fridge-to-Plate AI',
      description: 'Input the ingredients you already have and get perfectly matched recipes in seconds — reducing food waste and saving money.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: ShieldCheck,
      title: 'Complex Allergy Stacking',
      description: 'Stack unlimited dietary restrictions and allergies with confidence scoring so you know every recipe is safe for your unique needs.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: Brain,
      title: 'Adaptive Taste Learning',
      description: 'Rate recipes and NourishAI learns your preferences over time, delivering increasingly personalized suggestions you\'ll actually love.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Detailed Nutritional Breakdowns',
      description: 'Every recipe includes verified calorie, macro, and micronutrient data sourced from USDA databases — no guesswork, no hidden info.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CalendarDays,
      title: 'Smart Meal Planning',
      description: 'Generate daily or weekly meal plans optimized for your nutritional goals, available ingredients, and taste preferences.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: ShoppingCart,
      title: 'Intelligent Grocery Lists',
      description: 'Auto-generate grocery lists that account for what you already own — buy only what you need and eliminate over-purchasing.',
      gradient: 'from-green-500 to-emerald-500',
    }
  ],

  techStack: [
    { name: 'Next.js', color: 'bg-black text-white' },
    { name: 'Supabase', color: 'bg-emerald-600 text-white' },
    { name: 'Stripe', color: 'bg-purple-600 text-white' },
    { name: 'OpenAI', color: 'bg-gray-800 text-white' },
    { name: 'Tailwind CSS', color: 'bg-sky-500 text-white' }
  ],

  footerSections: [
    {
      title: 'Product',
      links: [
        { title: 'Features', href: '/features' },
        { title: 'Pricing', href: '/pricing' },
        { title: 'FAQ', href: '/#faq' }
      ],
    },
    {
      title: 'Company',
      links: [
        { title: 'About', href: '/about' },
        { title: 'Blog', href: '/blog' },
        { title: 'Contact', href: '/contact' }
      ],
    },
    {
      title: 'Legal',
      links: [
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
        { title: 'Allergen Disclaimer', href: '/disclaimer' }
      ],
    }
  ],

  footerCopyright: '2026 NourishAI. All rights reserved.',

  social: {
    twitter: 'https://twitter.com/nourishai',
    discord: 'https://discord.gg/nourishai'
  },
}
