/**
 * Application-level token encryption using AES-256-GCM.
 *
 * Tokens are encrypted before storage and decrypted only when needed
 * for API calls. Even if the database is fully compromised, tokens
 * are useless without the TOKEN_ENCRYPTION_KEY env var.
 *
 * Format: "enc:v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>"
 * - Versioned prefix for future algorithm upgrades
 * - Random 12-byte IV per encryption (never reused)
 * - 16-byte auth tag for tamper detection (GCM authenticated encryption)
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12    // 96-bit IV recommended for GCM
const TAG_LENGTH = 16   // 128-bit auth tag
const PREFIX = 'enc:v1:'

function getKey(): Buffer | null {
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY
  if (!keyHex) {
    console.warn('TOKEN_ENCRYPTION_KEY not set — tokens will be stored unencrypted')
    return null
  }

  const key = Buffer.from(keyHex, 'hex')
  if (key.length !== 32) {
    console.warn('TOKEN_ENCRYPTION_KEY must be exactly 32 bytes (64 hex chars) — skipping encryption')
    return null
  }

  return key
}

/**
 * Encrypt a plaintext token for storage.
 * Returns a prefixed string that can be stored in the database.
 */
export function encryptToken(plaintext: string): string {
  const key = getKey()
  if (!key) return plaintext // No encryption key — store as plaintext

  const iv = crypto.randomBytes(IV_LENGTH)

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return `${PREFIX}${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

/**
 * Decrypt an encrypted token from storage.
 *
 * If the value doesn't have the encryption prefix, it's returned as-is
 * for backward compatibility with tokens stored before encryption was enabled.
 */
export function decryptToken(stored: string): string {
  // Backward compat: unencrypted tokens pass through unchanged
  if (!stored.startsWith(PREFIX)) {
    return stored
  }

  const key = getKey()
  if (!key) {
    console.warn('Cannot decrypt token — TOKEN_ENCRYPTION_KEY not set')
    return stored // Return raw encrypted string — will likely fail at API call
  }

  const parts = stored.slice(PREFIX.length).split(':')
  if (parts.length !== 3) {
    throw new Error('Malformed encrypted token')
  }

  const iv = Buffer.from(parts[0], 'hex')
  const authTag = Buffer.from(parts[1], 'hex')
  const ciphertext = Buffer.from(parts[2], 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return decrypted.toString('utf8')
}

/**
 * Check if a stored value is encrypted.
 */
export function isEncrypted(stored: string): boolean {
  return stored.startsWith(PREFIX)
}
