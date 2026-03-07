'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { encryptToken, decryptToken } from '@/lib/crypto'
import { isAdmin } from './admin'

const ANTHROPIC_KEY = 'anthropic_api_key'

// Helper to access untyped site_settings table
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function siteSettings() {
  const supabase = createAdminClient()
  return (supabase as any).from('site_settings')
}

/**
 * Get the Anthropic API key — from site_settings (encrypted) or env var fallback.
 * Used by the chat API route. Does NOT require admin — any authenticated request can read.
 */
export async function getAiApiKey(): Promise<string | null> {
  try {
    const { data } = await siteSettings()
      .select('value')
      .eq('key', ANTHROPIC_KEY)
      .single()

    if (data?.value) {
      return decryptToken(data.value)
    }
  } catch {
    // Table might not exist yet or other DB error — fall through to env var
  }

  return process.env.ANTHROPIC_API_KEY || null
}

/**
 * Check if an Anthropic API key is configured (DB or env var).
 * Lightweight check for UI banners — no decryption needed.
 */
export async function hasAiApiKey(): Promise<boolean> {
  try {
    const { data } = await siteSettings()
      .select('key')
      .eq('key', ANTHROPIC_KEY)
      .single()

    if (data) return true
  } catch {
    // Fall through
  }

  return !!process.env.ANTHROPIC_API_KEY
}

/**
 * Get a masked version of the stored API key for display.
 * Admin only.
 */
export async function getMaskedAiApiKey(): Promise<string | null> {
  if (!(await isAdmin())) return null

  try {
    const { data } = await siteSettings()
      .select('value')
      .eq('key', ANTHROPIC_KEY)
      .single()

    if (data?.value) {
      const key = decryptToken(data.value)
      if (key.length > 12) {
        return key.slice(0, 8) + '...' + key.slice(-4)
      }
      return '****'
    }
  } catch {
    // Fall through
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return '(set via environment variable)'
  }

  return null
}

/**
 * Save an Anthropic API key (encrypted).
 * Admin only.
 */
export async function saveAiApiKey(apiKey: string): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized' }
  }

  if (!apiKey.trim()) {
    return { success: false, error: 'API key cannot be empty' }
  }

  try {
    const encrypted = encryptToken(apiKey.trim())

    const { error } = await siteSettings()
      .upsert(
        { key: ANTHROPIC_KEY, value: encrypted, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )

    if (error) {
      console.error('Error saving API key:', error)
      return { success: false, error: 'Failed to save API key' }
    }

    return { success: true }
  } catch (err) {
    console.error('Error saving API key:', err)
    return { success: false, error: 'Failed to save API key' }
  }
}

/**
 * Delete the stored Anthropic API key.
 * Admin only.
 */
export async function deleteAiApiKey(): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const { error } = await siteSettings()
      .delete()
      .eq('key', ANTHROPIC_KEY)

    if (error) {
      console.error('Error deleting API key:', error)
      return { success: false, error: 'Failed to delete API key' }
    }

    return { success: true }
  } catch (err) {
    console.error('Error deleting API key:', err)
    return { success: false, error: 'Failed to delete API key' }
  }
}
