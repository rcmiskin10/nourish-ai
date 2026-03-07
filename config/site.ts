import { Refrigerator, ShieldCheck, SlidersHorizontal, BarChart3, CalendarDays, Brain } from 'lucide-react'
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
  tagline: 'AI-powered meal plans tailored to your diet, your fridge, your life.',
  description: 'AI meal planning app that generates personalized recipes from your ingredients and dietary restrictions.',
  url: process.env.NEXT_PUBLIC_APP_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    || 'http://localhost:3000',
  company: 'NourishAI',

  mainNav: [
    { title: 'Features', href: '/features' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'FAQ', href: '/#faq' },
    { title: 'Blog', href: '/blog' }
  ],

  dashboardNav: [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Meal Plans', href: '/dashboard/meal_plans' },
    { title: 'My Pantry', href: '/dashboard/pantry' },
    { title: 'Settings', href: '/dashboard/settings' }
  ],

  hero: {
    badge: 'AI-Powered Nutrition',
    headline: 'Personalized Meal Plans From',
    headlineHighlight: 'What\'s Already in Your Fridge',
    subheadline: 'NourishAI uses artificial intelligence to generate safe, delicious recipes tailored to your dietary restrictions, food allergies, and nutritional goals — all from the ingredients you already have at home. No more food waste, no more guesswork.',
    primaryCta: { text: 'Start Eating Smarter — Free', href: '/register' },
    secondaryCta: { text: 'See How It Works', href: '/features' },
    socialProof: { text: 'Trusted by 12,000+ health-conscious eaters', rating: '4.8/5' },
  },

  features: [
    {
      icon: Refrigerator,
      title: 'Fridge-to-Plate AI',
      description: 'Type in what ingredients you have on hand and get 3-5 perfectly tailored recipes in seconds — no more staring at the fridge wondering what to cook.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: ShieldCheck,
      title: 'Allergy Severity Tiering',
      description: 'Distinguish between mild preferences, moderate intolerances, and life-threatening allergies with appropriate safety warnings and ingredient scrutiny levels.',
      gradient: 'from-rose-500 to-red-500',
    },
    {
      icon: SlidersHorizontal,
      title: 'Multi-Restriction Filtering',
      description: 'Combine keto + gluten-free + nut-free and still get delicious results. Our AI never returns zero results — it adapts and creates around your constraints.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Complete Nutritional Breakdown',
      description: 'Every generated recipe includes detailed calories, macronutrients, and key micronutrient data so you can track your nutritional goals with confidence.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CalendarDays,
      title: 'Smart Weekly Meal Plans',
      description: 'Generate a full week of meals in one tap, swap individual dishes, and get an auto-generated grocery list for only the ingredients you\'re missing.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Brain,
      title: 'Adaptive AI Learning',
      description: 'Rate recipes, skip meals, and save favorites — NourishAI learns your taste preferences over time and gets smarter with every interaction.',
      gradient: 'from-pink-500 to-fuchsia-500',
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
        { title: 'How It Works', href: '/features' },
        { title: 'Changelog', href: '/blog' }
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
        { title: 'Allergen Disclaimer', href: '/allergen-disclaimer' }
      ],
    }
  ],

  footerCopyright: '2026 NourishAI. All rights reserved.',

  social: {
    twitter: 'https://twitter.com/nourishai',
    discord: 'https://discord.gg/nourishai'
  },
}
