'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import type { FAQProps, ColorPalette, DesignStyle } from '@/types/agents'
import { cn } from '@/lib/utils'
import { FadeIn, StaggerContainer, StaggerItem, motion, AnimatePresence } from './motion'

interface FAQSectionProps {
  props: FAQProps
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

const PALETTE_COLORS: Record<ColorPalette, { text: string; bg: string; border: string }> = {
  violet: { text: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  ocean: { text: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  sunset: { text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  forest: { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  midnight: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  electric: { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  rose: { text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  aurora: { text: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
}

function AccordionAnswer({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function FAQSection({ props, palette = 'violet', style = 'gradient' }: FAQSectionProps) {
  const { headline, questions } = props
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const gradient = PALETTE_GRADIENTS[palette]
  const colors = PALETTE_COLORS[palette]

  // Glassmorphic/Dark Style
  if (style === 'glassmorphic' || style === 'dark') {
    return (
      <section className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 container mx-auto max-w-3xl px-4">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-12">
              {headline}
            </h2>
          </FadeIn>
          <StaggerContainer className="space-y-4">
            {questions.map((item, index) => (
              <StaggerItem key={index}>
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors duration-300">
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="font-medium text-white">{item.question}</span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    </motion.div>
                  </button>
                  {openIndex === index && (
                    <AccordionAnswer>
                      <div className="px-6 pb-4 text-slate-400 leading-relaxed">
                        {item.answer}
                      </div>
                    </AccordionAnswer>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    )
  }

  // Bold Style
  if (style === 'bold') {
    return (
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn className="text-center mb-12">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-6`}>
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
              {headline}
            </h2>
          </FadeIn>
          <StaggerContainer className="space-y-4">
            {questions.map((item, index) => (
              <StaggerItem key={index}>
                <div className="relative group">
                  {openIndex === index && (
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-50 blur`} />
                  )}
                  <div className="relative bg-white dark:bg-slate-800 rounded-xl border-0 shadow-lg overflow-hidden">
                    <button
                      className="w-full px-6 py-5 text-left flex items-center justify-between"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      <span className="font-bold text-slate-900 dark:text-white">{item.question}</span>
                      <motion.div
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className={`h-5 w-5 ${colors.text}`} />
                      </motion.div>
                    </button>
                    {openIndex === index && (
                      <AccordionAnswer>
                        <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.answer}
                        </div>
                      </AccordionAnswer>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    )
  }

  // Minimal Style
  if (style === 'minimal') {
    return (
      <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
              {headline}
            </h2>
          </FadeIn>
          <StaggerContainer className="space-y-0 divide-y divide-slate-200 dark:divide-slate-800">
            {questions.map((item, index) => (
              <StaggerItem key={index}>
                <div>
                  <button
                    className="w-full px-0 py-5 text-left flex items-center justify-between"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="font-medium text-slate-900 dark:text-white">{item.question}</span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    </motion.div>
                  </button>
                  {openIndex === index && (
                    <AccordionAnswer>
                      <div className="pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.answer}
                      </div>
                    </AccordionAnswer>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    )
  }

  // Default Gradient Style
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
      <div className="container mx-auto max-w-3xl px-4">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-slate-900 dark:text-white mb-12">
            {headline}
          </h2>
        </FadeIn>
        <StaggerContainer className="space-y-4">
          {questions.map((item, index) => (
            <StaggerItem key={index}>
              <div
                className={cn(
                  'border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-300',
                  openIndex === index && colors.border
                )}
              >
                <button
                  className={cn(
                    'w-full px-6 py-4 text-left flex items-center justify-between transition-colors',
                    openIndex === index && colors.bg
                  )}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium text-slate-900 dark:text-white">{item.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 transition-colors',
                        openIndex === index ? colors.text : 'text-slate-400'
                      )}
                    />
                  </motion.div>
                </button>
                {openIndex === index && (
                  <AccordionAnswer>
                    <div className="px-6 pb-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.answer}
                    </div>
                  </AccordionAnswer>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
