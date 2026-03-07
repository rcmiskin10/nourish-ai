import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk'
import { z } from 'zod'

/**
 * search_images — Search stock photos from Unsplash.
 * Returns image URLs with alt text for use in landing pages.
 */
const searchImagesTool = tool(
  'search_images',
  'Search for stock photos by keyword. Returns image URLs suitable for landing pages. Use descriptive queries like "modern office workspace" or "team collaboration".',
  {
    query: z.string().describe('Search query for images (e.g. "startup team meeting")'),
    count: z.number().min(1).max(10).default(3).describe('Number of images to return (1-10)'),
  },
  async (args) => {
    const { query, count } = args
    const accessKey = process.env.UNSPLASH_ACCESS_KEY

    if (!accessKey) {
      // Fallback: return placeholder images from picsum when no Unsplash key
      const images = Array.from({ length: count }, (_, i) => ({
        url: `https://picsum.photos/seed/${encodeURIComponent(query)}-${i}/800/600`,
        alt: `${query} - image ${i + 1}`,
        credit: 'Lorem Picsum',
      }))
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ images, source: 'picsum_fallback' }),
          },
        ],
      }
    }

    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`
      const res = await fetch(url, {
        headers: { Authorization: `Client-ID ${accessKey}` },
      })
      const data = await res.json()

      const images = (data.results || []).map((photo: any) => ({
        url: photo.urls?.regular || photo.urls?.small,
        alt: photo.alt_description || photo.description || query,
        credit: photo.user?.name || 'Unsplash',
        creditUrl: photo.user?.links?.html,
      }))

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ images, source: 'unsplash' }),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ error: 'Failed to search images', details: String(error) }),
          },
        ],
        isError: true,
      }
    }
  }
)

/**
 * generate_color_palette — Generate a color palette from mood/industry/base color.
 * Pure algorithmic function, no external API needed.
 */
const generateColorPaletteTool = tool(
  'generate_color_palette',
  'Generate a harmonious color palette for a landing page based on mood, industry, or a base hex color. Returns primary, secondary, accent, background, and text colors.',
  {
    mood: z
      .string()
      .optional()
      .describe('Desired mood (e.g. "professional", "playful", "bold", "calm", "energetic")'),
    industry: z
      .string()
      .optional()
      .describe('Industry or category (e.g. "fintech", "healthcare", "gaming", "education")'),
    baseColor: z
      .string()
      .optional()
      .describe('Base hex color to build palette from (e.g. "#6366f1")'),
  },
  async (args) => {
    const { mood, industry, baseColor } = args

    // Predefined palettes by mood/industry
    const palettes: Record<string, { primary: string; secondary: string; accent: string; background: string; text: string }> = {
      professional: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa', background: '#f8fafc', text: '#1e293b' },
      playful: { primary: '#a855f7', secondary: '#ec4899', accent: '#f59e0b', background: '#fefce8', text: '#1c1917' },
      bold: { primary: '#dc2626', secondary: '#f97316', accent: '#eab308', background: '#18181b', text: '#fafafa' },
      calm: { primary: '#0d9488', secondary: '#06b6d4', accent: '#67e8f9', background: '#f0fdfa', text: '#134e4a' },
      energetic: { primary: '#7c3aed', secondary: '#2563eb', accent: '#06b6d4', background: '#0f172a', text: '#e2e8f0' },
      modern: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#a78bfa', background: '#fafaf9', text: '#1c1917' },
      // Industry-specific
      fintech: { primary: '#059669', secondary: '#10b981', accent: '#34d399', background: '#f0fdf4', text: '#064e3b' },
      healthcare: { primary: '#0284c7', secondary: '#38bdf8', accent: '#7dd3fc', background: '#f0f9ff', text: '#0c4a6e' },
      gaming: { primary: '#7c3aed', secondary: '#a855f7', accent: '#c084fc', background: '#09090b', text: '#fafafa' },
      education: { primary: '#2563eb', secondary: '#3b82f6', accent: '#93c5fd', background: '#eff6ff', text: '#1e3a5f' },
      ecommerce: { primary: '#ea580c', secondary: '#f97316', accent: '#fdba74', background: '#fff7ed', text: '#431407' },
      saas: { primary: '#4f46e5', secondary: '#6366f1', accent: '#818cf8', background: '#eef2ff', text: '#312e81' },
    }

    let palette: typeof palettes[string]

    if (baseColor) {
      // Generate palette from base color using simple color theory
      const hex = baseColor.replace('#', '')
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)

      // Lighten for secondary
      const lighten = (c: number, amount: number) => Math.min(255, Math.round(c + (255 - c) * amount))
      // Darken for text
      const darken = (c: number, amount: number) => Math.round(c * (1 - amount))

      palette = {
        primary: baseColor,
        secondary: `#${lighten(r, 0.3).toString(16).padStart(2, '0')}${lighten(g, 0.3).toString(16).padStart(2, '0')}${lighten(b, 0.3).toString(16).padStart(2, '0')}`,
        accent: `#${lighten(r, 0.5).toString(16).padStart(2, '0')}${lighten(g, 0.5).toString(16).padStart(2, '0')}${lighten(b, 0.5).toString(16).padStart(2, '0')}`,
        background: r + g + b > 380 ? '#18181b' : '#fafaf9',
        text: r + g + b > 380 ? '#fafafa' : '#1c1917',
      }
    } else {
      const key = (industry?.toLowerCase() || mood?.toLowerCase() || 'modern')
      palette = palettes[key] || palettes.modern
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            palette,
            mood: mood || 'auto',
            industry: industry || 'general',
            css: {
              '--color-primary': palette.primary,
              '--color-secondary': palette.secondary,
              '--color-accent': palette.accent,
              '--color-background': palette.background,
              '--color-text': palette.text,
            },
          }),
        },
      ],
    }
  }
)

/**
 * analyze_seo — Analyze SEO quality of page content.
 * Scores title, description, headings, and provides suggestions.
 */
const analyzeSeoTool = tool(
  'analyze_seo',
  'Analyze the SEO quality of landing page content. Checks title length, meta description, heading hierarchy, keyword usage, and provides an overall score with actionable suggestions.',
  {
    title: z.string().describe('Page title / meta title'),
    description: z.string().describe('Meta description'),
    headings: z
      .array(z.object({ level: z.number(), text: z.string() }))
      .optional()
      .describe('Array of headings with level (1-6) and text'),
    keywords: z.array(z.string()).optional().describe('Target keywords to check for'),
    bodyText: z.string().optional().describe('Main body text content for keyword density analysis'),
  },
  async (args) => {
    const { title, description, headings, keywords, bodyText } = args
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 100

    // Title analysis
    if (title.length < 30) {
      issues.push('Title is too short (under 30 chars)')
      suggestions.push('Aim for 50-60 characters in your title for optimal SEO')
      score -= 15
    } else if (title.length > 60) {
      issues.push('Title is too long (over 60 chars) — may be truncated in search results')
      suggestions.push('Trim title to under 60 characters')
      score -= 10
    }

    // Description analysis
    if (description.length < 70) {
      issues.push('Meta description is too short (under 70 chars)')
      suggestions.push('Write a compelling 120-160 character meta description')
      score -= 15
    } else if (description.length > 160) {
      issues.push('Meta description is too long (over 160 chars)')
      suggestions.push('Trim meta description to 120-160 characters')
      score -= 10
    }

    // Heading hierarchy
    if (headings && headings.length > 0) {
      const h1s = headings.filter((h) => h.level === 1)
      if (h1s.length === 0) {
        issues.push('No H1 heading found')
        suggestions.push('Add exactly one H1 heading as the main page title')
        score -= 20
      } else if (h1s.length > 1) {
        issues.push(`Multiple H1 headings found (${h1s.length})`)
        suggestions.push('Use only one H1 per page — convert extras to H2')
        score -= 10
      }

      // Check for heading gaps (e.g., H1 → H3 skipping H2)
      const levels = headings.map((h) => h.level).sort()
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) {
          issues.push(`Heading hierarchy gap: H${levels[i - 1]} → H${levels[i]}`)
          score -= 5
        }
      }
    }

    // Keyword analysis
    if (keywords && keywords.length > 0 && bodyText) {
      const lower = bodyText.toLowerCase()
      for (const kw of keywords) {
        const count = (lower.match(new RegExp(kw.toLowerCase(), 'g')) || []).length
        if (count === 0) {
          issues.push(`Keyword "${kw}" not found in body text`)
          suggestions.push(`Include "${kw}" naturally in your content`)
          score -= 5
        }
      }

      // Check title for primary keyword
      if (!title.toLowerCase().includes(keywords[0].toLowerCase())) {
        issues.push(`Primary keyword "${keywords[0]}" not in title`)
        suggestions.push(`Include "${keywords[0]}" in your page title`)
        score -= 10
      }
    }

    score = Math.max(0, score)

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            score,
            grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
            issues,
            suggestions,
            analysis: {
              titleLength: title.length,
              titleOptimal: title.length >= 30 && title.length <= 60,
              descriptionLength: description.length,
              descriptionOptimal: description.length >= 70 && description.length <= 160,
              headingCount: headings?.length || 0,
              h1Count: headings?.filter((h) => h.level === 1).length || 0,
            },
          }),
        },
      ],
    }
  }
)

/**
 * Create the MCP server with all page designer tools.
 */
export function createPageDesignerMcpServer() {
  return createSdkMcpServer({
    name: 'page-designer',
    version: '1.0.0',
    tools: [searchImagesTool, generateColorPaletteTool, analyzeSeoTool],
  })
}
