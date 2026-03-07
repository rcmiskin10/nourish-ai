'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { LandingPageEditor } from '@/components/editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Save,
  Globe,
  ExternalLink,
  Loader2,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Pencil,
  Eye,
  Paintbrush,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Message } from '@/hooks/use-session'
import type { LandingPageStructure } from '@/types/agents'
import {
  extractAIAction,
  actionToLandingPage,
  applyPatches,
} from '@/lib/utils/message-parser'
// AI auth: subscription (OAuth) is used when no API key is set

const AUTOSAVE_KEY = 'saasify_landing_page_autosave'

function getAutoSavedPage(): LandingPageStructure | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function setAutoSavedPage(page: LandingPageStructure | null): void {
  if (typeof window === 'undefined') return
  try {
    if (page) {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(page))
    } else {
      localStorage.removeItem(AUTOSAVE_KEY)
    }
  } catch {
    // Storage full or unavailable
  }
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile'
type ViewMode = 'preview' | 'edit'

const previewWidths: Record<PreviewMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

export default function GeneratorPage() {
  const [landingPage, setLandingPage] = useState<LandingPageStructure | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [pageName, setPageName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [savedPageId, setSavedPageId] = useState<string | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop')
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [iframeReady, setIframeReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Keep a ref to landingPage for the iframe ready handler
  const landingPageRef = useRef(landingPage)
  landingPageRef.current = landingPage

  // Listen for iframe ready signal
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'preview-ready') {
        setIframeReady(true)
        // Send current landing page immediately on ready
        if (landingPageRef.current && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: 'preview-update', landingPage: landingPageRef.current },
            '*'
          )
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Send landing page data to iframe whenever it changes
  useEffect(() => {
    if (iframeReady && landingPage && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'preview-update', landingPage },
        '*'
      )
    }
  }, [landingPage, iframeReady])

  // Load auto-saved page on mount + check AI config
  useEffect(() => {
    const savedPage = getAutoSavedPage()
    if (savedPage) {
      setLandingPage(savedPage)
      toast.info('Restored your previous work')
    }
    // No API key check needed — uses Claude subscription (OAuth) when no key is set
  }, [])

  // Auto-save when landing page changes
  useEffect(() => {
    if (!landingPage) return

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    setAutoSaveStatus('saving')

    autoSaveTimeoutRef.current = setTimeout(() => {
      setAutoSavedPage(landingPage)
      setAutoSaveStatus('saved')
      setTimeout(() => setAutoSaveStatus('idle'), 2000)
    }, 1000)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [landingPage])

  const handleMessage = useCallback((message: Message) => {
    if (message.role === 'assistant') {
      const action = extractAIAction(message.content)

      if (!action) {
        const mentionsChanges = /\b(change|update|patch|modify|replace)\b/i.test(message.content)
        const hasExistingPage = !!landingPage
        if (mentionsChanges && hasExistingPage && !message.content.includes('```json')) {
          toast.info('Ask the AI to "apply the changes" to update your page.')
        }
        return
      }

      if (action.action === 'generate') {
        const structure = actionToLandingPage(action)
        if (structure && structure.sections && structure.sections.length > 0) {
          setLandingPage(structure)
          toast.success('Landing page generated!')
        }
      } else if (action.action === 'patch' && action.changes && landingPage) {
        const updated = applyPatches(landingPage, action.changes)
        setLandingPage(updated)
        toast.success(`Applied ${action.changes.length} change(s)`)
      }
    }
  }, [landingPage])

  const handleEditorChange = useCallback((structure: LandingPageStructure) => {
    setLandingPage(structure)
    if (savedPageId) {
      setSavedPageId(null)
    }
  }, [savedPageId])

  const handleSave = async () => {
    if (!landingPage || !pageName.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pageName.trim(),
          content: landingPage,
          theme: landingPage.theme,
          metadata: landingPage.metadata,
        }),
      })

      if (!response.ok) throw new Error('Failed to save landing page')

      const { page } = await response.json()
      setSavedPageId(page.id)
      setShowSaveDialog(false)
      setAutoSavedPage(null)
      toast.success('Landing page saved!')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save landing page')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!savedPageId) {
      toast.error('Please save the landing page first')
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/landing-pages/${savedPageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: true }),
      })

      if (!response.ok) throw new Error('Failed to publish')

      toast.success('Published! Your homepage now shows this landing page.')
    } catch (error) {
      console.error('Publish error:', error)
      toast.error('Failed to publish landing page')
    } finally {
      setIsPublishing(false)
    }
  }

  const openFullPreview = () => {
    if (landingPage) {
      sessionStorage.setItem('previewLandingPage', JSON.stringify(landingPage))
      window.open('/dashboard/generator/preview', '_blank')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-violet-600" />
            <h1 className="text-lg font-semibold">Page Designer</h1>
          </div>

          {/* Auto-save indicator */}
          {landingPage && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {autoSaveStatus === 'saving' && (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Saved</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Preview mode toggles */}
          {landingPage && (
            <>
              <div className="flex items-center border rounded-lg p-0.5">
                <Button
                  variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center border rounded-lg p-0.5">
                <Button
                  variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 px-2.5 text-xs gap-1.5"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </Button>
                <Button
                  variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 px-2.5 text-xs gap-1.5"
                  onClick={() => setViewMode('edit')}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>

              <div className="w-px h-6 bg-border" />

              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={openFullPreview}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Full Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => setShowSaveDialog(true)}
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </Button>
              {savedPageId && (
                <Button
                  size="sm"
                  className="h-7 text-xs gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Globe className="h-3.5 w-3.5" />
                  )}
                  Publish
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main content — side by side */}
      <div className="flex flex-1 min-h-0">
        {/* Chat panel — fixed width */}
        <div className="w-[420px] border-r flex flex-col min-h-0">
          <ChatInterface
            agentType="landing-generator"
            placeholder="Describe your product to generate a landing page..."
            onMessage={handleMessage}
            currentPage={landingPage || undefined}
          />
        </div>

        {/* Preview panel — flexible width */}
        <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 overflow-hidden min-h-0">
          {landingPage ? (
            <div className="flex justify-center h-full">
              {viewMode === 'preview' ? (
                <div
                  className="h-full transition-all duration-300 mx-auto"
                  style={{
                    width: previewWidths[previewMode],
                    maxWidth: '100%',
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    src="/preview-embed"
                    className="w-full h-full border-0 bg-white dark:bg-neutral-950"
                    title="Landing page preview"
                  />
                </div>
              ) : (
                <div className="w-full h-full overflow-auto">
                  <LandingPageEditor
                    structure={landingPage}
                    onChange={handleEditorChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-violet-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Design your landing page</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Describe your product in the chat and the AI will generate a
                  stunning landing page. You can then refine colors, copy, and
                  layout through conversation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Landing Page</DialogTitle>
            <DialogDescription>
              Give your landing page a name to save it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pageName">Page Name</Label>
              <Input
                id="pageName"
                placeholder="My Awesome Landing Page"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!pageName.trim() || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
