import { Refrigerator, ShieldCheck, Brain, BarChart3, Users, Leaf } from 'lucide-react'
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
  tagline: 'Turn your fridge into personalized, allergy-safe meals in seconds',
  description: 'AI-powered meal planning app that generates personalized recipes from your available ingredients and dietary restrictions.',
  url: process.env.NEXT_PUBLIC_APP_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    || 'http://localhost:3000',
  company: 'NourishAI',

  mainNav: [
    { title: 'Features', href: '/features' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'How It Works', href: '/features#how-it-works' },
    { title: 'FAQ', href: '/pricing#faq' }
  ],

  dashboardNav: [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Meal Plans', href: '/dashboard/entities' },
    { title: 'My Pantry', href: '/dashboard/pantry' },
    { title: 'Dietary Profiles', href: '/dashboard/profiles' },
    { title: 'Grocery List', href: '/dashboard/grocery-list' }
  ],

  hero: {
    badge: 'AI-Powered Meal Planning',
    headline: 'Turn Your Fridge Into Delicious,',
    headlineHighlight: 'Allergy-Safe Meals Instantly',
    subheadline: 'Tell NourishAI what\'s in your kitchen and your dietary needs — keto, vegan, gluten-free, nut allergy, or any combination — and get personalized, nutritionally balanced recipes in seconds. No more food waste, no more guesswork, no more anxiety about hidden allergens.',
    primaryCta: { text: 'Start Cooking Free', href: '/register' },
    secondaryCta: { text: 'See How It Works', href: '/features' },
    socialProof: { text: 'Loved by 2,000+ health-conscious home cooks', rating: '4.9/5' },
  },

  features: [
    {
      icon: Refrigerator,
      title: 'Fridge-to-Plate AI',
      description: 'Input what you have on hand and get instant, complete recipes that maximize your available ingredients and minimize food waste.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: ShieldCheck,
      title: 'Deep Allergy Intelligence',
      description: 'Goes beyond simple filters — our allergy engine understands cross-reactivity, hidden allergens in processed foods, and severity levels to keep you safe.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: Brain,
      title: 'AI-Powered Personalization',
      description: 'The more you use NourishAI, the better it knows your taste. Our adaptive AI learns from your feedback to suggest meals you\'ll actually love.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Complete Nutritional Breakdowns',
      description: 'Every recipe comes with detailed calorie, macro, and micronutrient data aligned to your specific health and fitness goals.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Multi-Profile Household Planning',
      description: 'One family member is keto, another is vegan? Create unified meal plans that accommodate everyone\'s restrictions with smart substitutions.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Leaf,
      title: 'Waste Reduction Tracking',
      description: 'Prioritizes soon-to-expire ingredients, tracks your usage patterns, and gives you a monthly food waste reduction score to help the planet.',
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
        { title: 'How It Works', href: '/features#how-it-works' },
        { title: 'Recipes', href: '/recipes' }
      ],
    },
    {
      title: 'Company',
      links: [
        { title: 'About', href: '/about' },
        { title: 'Blog', href: '/blog' },
        { title: 'Careers', href: '/careers' },
        { title: 'Contact', href: '/contact' }
      ],
    },
    {
      title: 'Legal',
      links: [
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
        { title: 'Allergen Disclaimer', href: '/allergen-disclaimer' },
        { title: 'Cookie Policy', href: '/cookies' }
      ],
    }
  ],

  footerCopyright: '2026 NourishAI. All rights reserved.',

  social: {
    twitter: 'https://twitter.com/nourishai',
    discord: 'https://discord.gg/nourishai'
  },
}
