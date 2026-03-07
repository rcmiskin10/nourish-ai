'use client'

import { useEffect, useState } from 'react'
import { LandingPageRenderer } from '@/components/landing/LandingPageRenderer'
import type { LandingPageStructure } from '@/types/agents'

/**
 * Minimal page that renders a landing page from postMessage data.
 * Used as an iframe src by the generator page so the preview gets
 * its own viewport and CSS media queries fire correctly.
 */
export default function EmbedPreviewPage() {
  const [landingPage, setLandingPage] = useState<LandingPageStructure | null>(null)

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'preview-update' && event.data.landingPage) {
        setLandingPage(event.data.landingPage)
      }
    }
    window.addEventListener('message', handler)

    // Signal to parent that we're ready
    window.parent.postMessage({ type: 'preview-ready' }, '*')

    return () => window.removeEventListener('message', handler)
  }, [])

  if (!landingPage) {
    return <div className="min-h-screen" />
  }

  return <LandingPageRenderer structure={landingPage} isPreview={true} />
}
