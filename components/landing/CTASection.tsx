'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { CTAProps, ColorPalette, DesignStyle } from '@/types/agents'
import { FadeIn } from './motion'

interface CTASectionProps {
  props: CTAProps
  isPreview?: boolean
  palette?: ColorPalette
  style?: DesignStyle
}

const PALETTE_GRADIENTS: Record<ColorPalette, string> = {
  violet: 'from-violet-600 via-purple-600 to-indigo-700',
  ocean: 'from-cyan-500 via-blue-600 to-indigo-700',
  sunset: 'from-orange-500 via-rose-500 to-pink-600',
  forest: 'from-emerald-500 via-teal-600 to-cyan-700',
  midnight: 'from-slate-900 via-purple-900 to-slate-900',
  electric: 'from-blue-600 via-indigo-600 to-violet-700',
  rose: 'from-rose-400 via-pink-500 to-purple-600',
  aurora: 'from-green-400 via-cyan-500 to-blue-600',
}

const PALETTE_ACCENTS: Record<ColorPalette, string> = {
  violet: 'bg-violet-500',
  ocean: 'bg-cyan-500',
  sunset: 'bg-orange-500',
  forest: 'bg-emerald-500',
  midnight: 'bg-purple-500',
  electric: 'bg-blue-500',
  rose: 'bg-rose-500',
  aurora: 'bg-green-500',
}

function CtaButton({ isPreview, ctaLink, className, children }: { isPreview?: boolean; ctaLink: string; className: string; children: React.ReactNode }) {
  if (isPreview) {
    return <Button size="lg" className={className}>{children}</Button>
  }
  return (
    <Link href={ctaLink}>
      <Button size="lg" className={className}>{children}</Button>
    </Link>
  )
}

export function CTASection({ props, isPreview, palette = 'violet', style = 'gradient' }: CTASectionProps) {
  const { headline, subheadline, ctaText, ctaLink } = props
  const gradient = PALETTE_GRADIENTS[palette]
  const accent = PALETTE_ACCENTS[palette]

  // Glassmorphic/Dark Style
  if (style === 'glassmorphic' || style === 'dark') {
    return (
      <section className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
        <div className={`absolute top-10 left-10 w-64 h-64 ${accent} rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob`} />
        <div className={`absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r ${gradient} rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-blob`} style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <FadeIn className="relative z-10 container mx-auto max-w-4xl text-center px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">{subheadline}</p>
          )}
          <CtaButton isPreview={isPreview} ctaLink={ctaLink} className={`h-12 px-8 text-base font-semibold bg-gradient-to-r ${gradient} hover:opacity-90 border-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25`}>
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </CtaButton>
        </FadeIn>
      </section>
    )
  }

  // Minimal Style
  if (style === 'minimal') {
    return (
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900">
        <FadeIn className="container mx-auto max-w-4xl text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">{subheadline}</p>
          )}
          <CtaButton isPreview={isPreview} ctaLink={ctaLink} className="h-12 px-8 text-base font-medium rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            {ctaText}
          </CtaButton>
        </FadeIn>
      </section>
    )
  }

  // Bold Style
  if (style === 'bold') {
    return (
      <section className={`py-20 md:py-28 bg-gradient-to-r ${gradient} relative overflow-hidden animate-gradient-shift`}>
        <div className="absolute top-10 right-10 w-40 h-40 border border-white/20 rounded-full animate-float" />
        <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/10 rounded-2xl rotate-12 animate-float" style={{ animationDelay: '2s' }} />

        <FadeIn className="relative z-10 container mx-auto max-w-4xl text-center px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">{subheadline}</p>
          )}
          <CtaButton isPreview={isPreview} ctaLink={ctaLink} className="h-14 px-10 text-lg font-bold bg-white text-slate-900 hover:bg-white/90 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)]">
            {ctaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </CtaButton>
        </FadeIn>
      </section>
    )
  }

  // Default Gradient Style
  return (
    <section className={`py-20 md:py-28 bg-gradient-to-r ${gradient} relative overflow-hidden animate-gradient-shift`}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <FadeIn className="relative z-10 container mx-auto max-w-4xl text-center px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {headline}
        </h2>
        {subheadline && (
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">{subheadline}</p>
        )}
        <CtaButton isPreview={isPreview} ctaLink={ctaLink} className="h-12 px-8 text-base font-semibold bg-white text-slate-900 hover:bg-white/95 rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
          {ctaText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </CtaButton>
      </FadeIn>
    </section>
  )
}
