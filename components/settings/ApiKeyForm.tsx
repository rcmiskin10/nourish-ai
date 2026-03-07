'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, Trash2, Save, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import {
  getMaskedAiApiKey,
  saveAiApiKey,
  deleteAiApiKey,
} from '@/lib/actions/settings'

export function ApiKeyForm() {
  const [maskedKey, setMaskedKey] = useState<string | null>(null)
  const [newKey, setNewKey] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getMaskedAiApiKey().then((key) => {
      setMaskedKey(key)
      setIsLoading(false)
    })
  }, [])

  const handleSave = async () => {
    if (!newKey.trim()) return

    setIsSaving(true)
    const result = await saveAiApiKey(newKey.trim())
    setIsSaving(false)

    if (result.success) {
      toast.success('API key saved')
      setNewKey('')
      setShowInput(false)
      // Refresh masked key
      const key = await getMaskedAiApiKey()
      setMaskedKey(key)
    } else {
      toast.error(result.error || 'Failed to save')
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteAiApiKey()
    setIsDeleting(false)

    if (result.success) {
      toast.success('API key removed')
      setMaskedKey(null)
    } else {
      toast.error(result.error || 'Failed to delete')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {maskedKey ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Anthropic API Key</Label>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                {maskedKey}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInput(!showInput)}
              >
                Update
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting || maskedKey === '(set via environment variable)'}
                className="text-destructive hover:text-destructive"
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No API key configured. The AI page designer requires an Anthropic API key to work.
        </p>
      )}

      {(showInput || !maskedKey) && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="apiKey">
              {maskedKey ? 'New API Key' : 'Anthropic API Key'}
            </Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-ant-..."
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="font-mono text-sm"
              />
              <Button
                onClick={handleSave}
                disabled={!newKey.trim() || isSaving}
                className="gap-1.5"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your API key from{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              console.anthropic.com
              <ExternalLink className="h-3 w-3" />
            </a>
            . Your key is encrypted before storage.
          </p>
        </div>
      )}
    </div>
  )
}
