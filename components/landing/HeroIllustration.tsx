'use client'

import type { ColorPalette } from '@/types/agents'

interface HeroIllustrationProps {
  palette?: ColorPalette
  hint?: string
  headline?: string
  className?: string
}

const PALETTE_COLORS: Record<ColorPalette, { primary: string; secondary: string; accent: string; bg: string; bgLight: string; text: string; textDim: string }> = {
  violet: { primary: '#8b5cf6', secondary: '#6366f1', accent: '#a78bfa', bg: '#0f0b1e', bgLight: '#1a1533', text: '#e2e0f0', textDim: '#6b6890' },
  ocean: { primary: '#06b6d4', secondary: '#3b82f6', accent: '#67e8f9', bg: '#0a1520', bgLight: '#111d2e', text: '#d0e8f0', textDim: '#4a6b80' },
  sunset: { primary: '#f97316', secondary: '#f43f5e', accent: '#fb923c', bg: '#1a0f0a', bgLight: '#261810', text: '#f0e0d0', textDim: '#806050' },
  forest: { primary: '#10b981', secondary: '#14b8a6', accent: '#34d399', bg: '#0a1510', bgLight: '#0f1f18', text: '#d0f0e0', textDim: '#4a8060' },
  midnight: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#c4b5fd', bg: '#0a0815', bgLight: '#151228', text: '#e0ddf0', textDim: '#5a5580' },
  electric: { primary: '#3b82f6', secondary: '#6366f1', accent: '#60a5fa', bg: '#0a1020', bgLight: '#101830', text: '#d0e0f0', textDim: '#4a5a80' },
  rose: { primary: '#f43f5e', secondary: '#ec4899', accent: '#fb7185', bg: '#1a0a12', bgLight: '#261020', text: '#f0d0e0', textDim: '#804a60' },
  aurora: { primary: '#22c55e', secondary: '#06b6d4', accent: '#4ade80', bg: '#0a1510', bgLight: '#102018', text: '#d0f0d8', textDim: '#4a8055' },
}

type IllustrationType = 'writing' | 'analytics' | 'messaging' | 'ecommerce' | 'project' | 'code' | 'dashboard'

function detectType(hint?: string, headline?: string): IllustrationType {
  // Combine hint + headline for broader keyword matching
  const raw = [hint, headline].filter(Boolean).join(' ')
  if (!raw) return 'dashboard'
  const h = raw.toLowerCase()
  if (/writ|blog|content|editor|document|note|text|article|copy|script|story|publish/.test(h)) return 'writing'
  if (/analy|metric|data|chart|report|insight|track|monitor|stat|dashboard/.test(h)) return 'analytics'
  if (/chat|messag|inbox|email|mail|communi|slack|team|collab|conversation/.test(h)) return 'messaging'
  if (/shop|store|ecommerce|cart|product|pay|order|buy|sell|commerce|purchase|retail|market/.test(h)) return 'ecommerce'
  if (/project|task|kanban|board|manage|plan|sprint|agile|workflow|todo|roadmap/.test(h)) return 'project'
  if (/code|dev|api|deploy|build|git|terminal|program|engineer|debug|developer/.test(h)) return 'code'
  return 'dashboard'
}

// Shared window chrome
function WindowChrome({ c }: { c: typeof PALETTE_COLORS['violet'] }) {
  return (
    <>
      <rect y="0" width="560" height="36" fill={c.bgLight} />
      <line x1="0" y1="36" x2="560" y2="36" stroke={`${c.primary}15`} />
      <circle cx="18" cy="18" r="5" fill="#ff5f57" />
      <circle cx="34" cy="18" r="5" fill="#febc2e" />
      <circle cx="50" cy="18" r="5" fill="#28c840" />
      <rect x="200" y="8" width="200" height="20" rx="10" fill={`${c.primary}08`} stroke={`${c.primary}12`} />
      <rect x="218" y="15" width="80" height="5" rx="2.5" fill={`${c.primary}12`} />
    </>
  )
}

// ─── Writing / Editor ─────────────────────────────────────────
function WritingIllustration({ c }: { c: typeof PALETTE_COLORS['violet'] }) {
  return (
    <g>
      <WindowChrome c={c} />
      {/* Sidebar - document list */}
      <rect x="0" y="36" width="130" height="364" fill={c.bgLight} />
      <line x1="130" y1="36" x2="130" y2="400" stroke={`${c.primary}12`} />
      <rect x="12" y="48" width="32" height="5" rx="2.5" fill={c.textDim} opacity="0.3" />
      {/* Document items */}
      {[68, 100, 132, 164, 196].map((y, i) => (
        <g key={y}>
          <rect x="8" y={y} width="114" height="26" rx="6" fill={i === 0 ? `${c.primary}20` : 'transparent'} />
          {i === 0 && <rect x="10" y={y} width="2.5" height="26" rx="1.25" fill={c.primary} />}
          <rect x="18" y={y + 5} width={50 + i * 6} height="5" rx="2.5" fill={i === 0 ? c.primary : c.text} opacity={i === 0 ? 0.7 : 0.3} />
          <rect x="18" y={y + 14} width={36 + i * 4} height="4" rx="2" fill={c.textDim} opacity="0.2" />
        </g>
      ))}

      {/* Main editor area */}
      <rect x="130" y="36" width="430" height="364" fill={c.bg} />
      {/* Toolbar */}
      <rect x="130" y="36" width="430" height="32" fill={c.bgLight} />
      <line x1="130" y1="68" x2="560" y2="68" stroke={`${c.primary}10`} />
      {['B', 'I', 'U'].map((letter, i) => (
        <g key={letter}>
          <rect x={146 + i * 28} y="43" width="22" height="20" rx="4" fill={i === 0 ? `${c.primary}20` : 'transparent'} />
          <text x={157 + i * 28} y="57" fontSize="10" fontWeight={i === 0 ? '700' : '400'} fill={i === 0 ? c.primary : c.textDim} textAnchor="middle" opacity={i === 0 ? 0.9 : 0.4}>{letter}</text>
        </g>
      ))}
      {/* Separator */}
      <line x1="236" y1="46" x2="236" y2="60" stroke={`${c.primary}15`} />
      {/* More toolbar items */}
      {[248, 272, 296].map((x, i) => (
        <rect key={x} x={x} y="45" width="18" height="14" rx="3" fill={`${c.primary}${8 + i * 2}`} />
      ))}
      {/* AI button */}
      <rect x="480" y="43" width="60" height="20" rx="10" fill={c.primary} opacity="0.8" />
      <text x="510" y="56" fontSize="7" fill="white" opacity="0.9" textAnchor="middle">AI Write</text>

      {/* Document title */}
      <text x="160" y="100" fontSize="20" fontWeight="700" fill={c.text} opacity="0.85">The Future of Content</text>
      <rect x="160" y="110" width="80" height="4" rx="2" fill={c.textDim} opacity="0.2" />

      {/* Body text lines - realistic paragraph */}
      {[130, 142, 154, 166, 178].map((y, i) => (
        <rect key={y} x="160" y={y} width={280 + (i % 3) * 30 - i * 15} height="5" rx="2.5" fill={c.text} opacity="0.25" />
      ))}

      {/* Highlighted/selected text */}
      <rect x="160" y="196" width="200" height="18" rx="0" fill={`${c.primary}15`} />
      <rect x="160" y="200" width="200" height="5" rx="2.5" fill={c.primary} opacity="0.5" />
      <rect x="160" y="208" width="140" height="5" rx="2.5" fill={c.primary} opacity="0.5" />

      {/* More text lines */}
      {[226, 238, 250, 262, 274, 286].map((y, i) => (
        <rect key={y} x="160" y={y} width={260 + (i % 4) * 20 - i * 8} height="5" rx="2.5" fill={c.text} opacity="0.2" />
      ))}

      {/* AI suggestion popup */}
      <rect x="300" y="184" width="180" height="90" rx="10" fill={c.bgLight} stroke={`${c.primary}25`} />
      <rect x="300" y="184" width="180" height="90" rx="10" fill={`${c.primary}05`} />
      {/* Sparkle icon */}
      <circle cx="318" cy="200" r="8" fill={`${c.primary}20`} />
      <text x="318" y="204" fontSize="10" textAnchor="middle" fill={c.primary}>✦</text>
      <text x="332" y="203" fontSize="7" fontWeight="600" fill={c.primary} opacity="0.8">AI Suggestion</text>
      <rect x="312" y="214" width="156" height="4" rx="2" fill={c.accent} opacity="0.3" />
      <rect x="312" y="222" width="140" height="4" rx="2" fill={c.accent} opacity="0.25" />
      <rect x="312" y="230" width="100" height="4" rx="2" fill={c.accent} opacity="0.2" />
      {/* Accept / Reject buttons */}
      <rect x="312" y="244" width="50" height="18" rx="9" fill={c.primary} opacity="0.8" />
      <text x="337" y="256" fontSize="7" fill="white" opacity="0.9" textAnchor="middle">Accept</text>
      <rect x="368" y="244" width="50" height="18" rx="9" fill={`${c.primary}15`} />
      <text x="393" y="256" fontSize="7" fill={c.textDim} opacity="0.5" textAnchor="middle">Reject</text>

      {/* Word count footer */}
      <rect x="130" y="382" width="430" height="18" fill={c.bgLight} />
      <rect x="146" y="388" width="40" height="4" rx="2" fill={c.textDim} opacity="0.2" />
      <rect x="196" y="388" width="50" height="4" rx="2" fill={c.textDim} opacity="0.15" />
    </g>
  )
}

// ─── Analytics / Dashboard ────────────────────────────────────
function AnalyticsIllustration({ c }: { c: typeof PALETTE_COLORS['violet'] }) {
  const chartPoints = [
    { x: 56, y: 195 }, { x: 96, y: 175 }, { x: 136, y: 185 }, { x: 176, y: 155 },
    { x: 216, y: 140 }, { x: 256, y: 150 }, { x: 296, y: 125 }, { x: 336, y: 110 },
    { x: 376, y: 118 }, { x: 416, y: 95 }, { x: 456, y: 100 }, { x: 496, y: 80 },
  ]
  const chartLine = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const chartArea = `${chartLine} L496,230 L56,230 Z`

  return (
    <g>
      <WindowChrome c={c} />
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.primary} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Stat cards row */}
      {[
        { x: 24, val: '48.2K', label: 'Total Visitors', trend: '+24%' },
        { x: 158, val: '$12.8K', label: 'Revenue', trend: '+18%' },
        { x: 292, val: '3.2%', label: 'Conv. Rate', trend: '+0.4%' },
        { x: 426, val: '2m 34s', label: 'Avg. Session', trend: '+12s' },
      ].map((card) => (
        <g key={card.x}>
          <rect x={card.x} y="48" width="122" height="56" rx="8" fill={c.bgLight} stroke={`${c.primary}10`} />
          <text x={card.x + 14} y="72" fontSize="15" fontWeight="700" fill={c.text} opacity="0.85">{card.val}</text>
          <rect x={card.x + 14} y="80" width="52" height="4" rx="2" fill={c.textDim} opacity="0.3" />
          <rect x={card.x + 80} y="58" width="30" height="14" rx="7" fill="#10b98118" />
          <text x={card.x + 88} y="68" fontSize="7" fill="#34d399" opacity="0.9">{card.trend}</text>
        </g>
      ))}

      {/* Main chart */}
      <rect x="24" y="116" width="512" height="134" rx="8" fill={c.bgLight} stroke={`${c.primary}10`} />
      <text x="40" y="136" fontSize="9" fontWeight="600" fill={c.text} opacity="0.6">Visitors Over Time</text>
      {/* Grid */}
      {[160, 180, 200, 220].map((y) => (
        <line key={y} x1="48" y1={y} x2="520" y2={y} stroke={`${c.primary}06`} />
      ))}
      <path d={chartArea} fill="url(#areaGrad)" />
      <path d={chartLine} stroke={c.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Highlight dot */}
      <circle cx="496" cy="80" r="6" fill={c.primary} opacity="0.2" />
      <circle cx="496" cy="80" r="3" fill={c.primary} opacity="0.9" />

      {/* Bottom panels */}
      {/* Top pages */}
      <rect x="24" y="262" width="248" height="126" rx="8" fill={c.bgLight} stroke={`${c.primary}10`} />
      <text x="40" y="282" fontSize="8" fontWeight="600" fill={c.text} opacity="0.5">Top Pages</text>
      {['/pricing', '/features', '/blog/ai', '/docs', '/signup'].map((page, i) => (
        <g key={page}>
          <rect x="40" y={294 + i * 18} width={160 - i * 20} height="6" rx="3" fill={c.primary} opacity={0.5 - i * 0.08} />
          <text x="40" y={292 + i * 18} fontSize="6" fill={c.textDim} opacity="0.4">{page}</text>
        </g>
      ))}

      {/* Traffic sources */}
      <rect x="288" y="262" width="248" height="126" rx="8" fill={c.bgLight} stroke={`${c.primary}10`} />
      <text x="304" y="282" fontSize="8" fontWeight="600" fill={c.text} opacity="0.5">Traffic Sources</text>
      {/* Donut chart */}
      <circle cx="360" cy="340" r="30" fill="none" stroke={`${c.primary}15`} strokeWidth="12" />
      <circle cx="360" cy="340" r="30" fill="none" stroke={c.primary} strokeWidth="12" strokeDasharray="94 94" strokeDashoffset="0" opacity="0.8" />
      <circle cx="360" cy="340" r="30" fill="none" stroke={c.secondary} strokeWidth="12" strokeDasharray="47 141" strokeDashoffset="-94" opacity="0.6" />
      <circle cx="360" cy="340" r="30" fill="none" stroke={c.accent} strokeWidth="12" strokeDasharray="28 160" strokeDashoffset="-141" opacity="0.5" />
      {/* Legend */}
      {['Organic', 'Direct', 'Social', 'Referral'].map((src, i) => (
        <g key={src}>
          <circle cx="420" cy={310 + i * 16} r="3" fill={[c.primary, c.secondary, c.accent, c.textDim][i]} opacity="0.7" />
          <text x="428" y={313 + i * 16} fontSize="6" fill={c.textDim} opacity="0.4">{src}</text>
        </g>
      ))}
    </g>
  )
}

// ─── Chat / Messaging ─────────────────────────────────────────
function MessagingIllustration({ c }: { c: typeof PALETTE_COLORS['violet'] }) {
  return (
    <g>
      <WindowChrome c={c} />
      {/* Sidebar - conversation list */}
      <rect x="0" y="36" width="160" height="364" fill={c.bgLight} />
      <line x1="160" y1="36" x2="160" y2="400" stroke={`${c.primary}12`} />
      {/* Search bar */}
      <rect x="12" y="46" width="136" height="24" rx="12" fill={`${c.primary}08`} stroke={`${c.primary}12`} />
      <rect x="30" y="55" width="50" height="4" rx="2" fill={c.textDim} opacity="0.2" />
      {/* Conversations */}
      {[82, 122, 162, 202, 242].map((y, i) => (
        <g key={y}>
          <rect x="8" y={y} width="144" height="34" rx="6" fill={i === 1 ? `${c.primary}15` : 'transparent'} />
          <circle cx="28" cy={y + 17} r="12" fill={`${c.primary}${15 + i * 5}`} />
          <text x="28" y={y + 20} fontSize="8" fontWeight="600" fill={c.text} opacity="0.5" textAnchor="middle">{['SM', 'JD', 'AK', 'RL', 'MN'][i]}</text>
          <rect x="46" y={y + 7} width={50 + i * 4} height="5" rx="2.5" fill={c.text} opacity={i === 1 ? 0.6 : 0.3} />
          <rect x="46" y={y + 17} width={60 + i * 3} height="4" rx="2" fill={c.textDim} opacity="0.2" />
          {i === 1 && <circle cx="138" cy={y + 12} r="4" fill={c.primary} opacity="0.7" />}
          {i === 1 && <text x="138" y={y + 15} fontSize="6" fill="white" textAnchor="middle">3</text>}
        </g>
      ))}

      {/* Chat area */}
      {/* Incoming messages */}
      <rect x="180" y="56" width="200" height="40" rx="12" fill={c.bgLight} stroke={`${c.primary}10`} />
      <rect x="192" y="66" width="160" height="5" rx="2.5" fill={c.text} opacity="0.3" />
      <rect x="192" y="76" width="120" height="5" rx="2.5" fill={c.text} opacity="0.25" />

      <rect x="180" y="108" width="160" height="30" rx="12" fill={c.bgLight} stroke={`${c.primary}10`} />
      <rect x="192" y="118" width="130" height="5" rx="2.5" fill={c.text} opacity="0.3" />

      {/* Outgoing messages */}
      <rect x="310" y="152" width="220" height="40" rx="12" fill={c.primary} opacity="0.2" />
      <rect x="310" y="152" width="220" height="40" rx="12" fill="none" stroke={`${c.primary}25`} />
      <rect x="322" y="162" width="180" height="5" rx="2.5" fill={c.primary} opacity="0.5" />
      <rect x="322" y="172" width="140" height="5" rx="2.5" fill={c.primary} opacity="0.4" />

      {/* Incoming with AI indicator */}
      <rect x="180" y="206" width="260" height="64" rx="12" fill={c.bgLight} stroke={`${c.primary}15`} />
      <circle cx="196" cy="220" r="8" fill={`${c.primary}25`} />
      <text x="196" y="223" fontSize="9" textAnchor="middle" fill={c.primary}>✦</text>
      <text x="210" y="223" fontSize="7" fontWeight="600" fill={c.primary} opacity="0.7">AI Assistant</text>
      <rect x="192" y="234" width="220" height="5" rx="2.5" fill={c.text} opacity="0.3" />
      <rect x="192" y="244" width="180" height="5" rx="2.5" fill={c.text} opacity="0.25" />
      <rect x="192" y="254" width="140" height="5" rx="2.5" fill={c.text} opacity="0.2" />

      {/* Outgoing */}
      <rect x="340" y="284" width="190" height="30" rx="12" fill={c.primary} opacity="0.2" />
      <rect x="340" y="284" width="190" height="30" rx="12" fill="none" stroke={`${c.primary}25`} />
      <rect x="352" y="295" width="150" height="5" rx="2.5" fill={c.primary} opacity="0.4" />

      {/* Typing indicator */}
      <rect x="180" y="328" width="60" height="26" rx="13" fill={c.bgLight} stroke={`${c.primary}10`} />
      {[194, 208, 222].map((cx) => (
        <circle key={cx} cx={cx} cy="341" r="3" fill={c.textDim} opacity="0.3" />
      ))}

      {/* Input area */}
      <rect x="160" y="368" width="400" height="32" fill={c.bgLight} />
      <line x1="160" y1="368" x2="560" y2="368" stroke={`${c.primary}10`} />
      <rect x="176" y="376" width="300" height="16" rx="8" fill={`${c.primary}06`} stroke={`${c.primary}10`} />
      <rect x="190" y="382" width="80" height="4" rx="2" fill={c.textDim} opacity="0.15" />
      <rect x="508" y="376" width="36" height="16" rx="8" fill={c.primary} opacity="0.7" />
      <text x="526" y="387" fontSize="7" fill="white" opacity="0.9" textAnchor="middle">Send</text>
    </g>
  )
}

// ─── E-Commerce ───────────────────────────────────────────────
function EcommerceIllustration({ c }: { c: typeof PALETTE_COLORS['violet'] }) {
  return (
    <g>
      <WindowChrome c={c} />
      {/* Nav bar */}
      <rect x="0" y="36" width="560" height="28" fill={c.bgLight} />
      <line x1="0" y1="64" x2="560" y2="64" stroke={`${c.primary}10`} />
      {['Home', 'Shop', 'Sale', 'New'].map((item, i) => (
        <text key={item} x={30 + i * 50} y="54" fontSize="7" fill={i === 1 ? c.primary : c.textDim} opacity={i === 1 ? 0.8 : 0.4} fontWeight={i === 1 ? '600' : '400'}>{item}</text>
      ))}
      {/* Cart icon */}
      <rect x="510" y="44" width="20" height="14" rx="3" fill={`${c.primary}15`} />
      <circle cx="528" cy="46" r="5" fill={c.primary} opacity="0.7" />
      <text x="528" y="49" fontSize="6" fill="white" textAnchor="middle">2</text>

      {/* Featured product */}
      <rect x="24" y="76" width="320" height="200" rx="10" fill={c.bgLight} stroke={`${c.primary}10`} />
      {/* Product image placeholder */}
      <rect x="36" y="88" width="296" height="130" rx="8" fill={`${c.primary}08`} />
      <circle cx="184" cy="153" r="24" fill={`${c.primary}12`} />
      <rect x="168" y="145" width="32" height="16" rx="3" fill={`${c.primary}20`} />
      {/* Sale badge */}
      <rect x="276" y="96" width="44" height="18" rx="9" fill={c.primary} opacity="0.8" />
      <text x="298" y="108" fontSize="8" fontWeight="700" fill="white" textAnchor="middle">-30%</text>
      {/* Product info */}
      <rect x="36" y="226" width="140" height="6" rx="3" fill={c.text} opacity="0.5" />
      <text x="36" y="252" fontSize="14" fontWeight="700" fill={c.text} opacity="0.8">$79.99</text>
      <text x="96" y="252" fontSize="10" fill={c.textDim} opacity="0.3" textDecoration="line-through">$119.99</text>
      {/* Stars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <text key={i} x={280 + i * 12} y="250" fontSize="10" fill={i < 4 ? c.primary : c.textDim} opacity={i < 4 ? 0.7 : 0.2}>★</text>
      ))}

      {/* Side products */}
      {[
        { y: 76, name: 'Premium Headphones' },
        { y: 168, name: 'Smart Watch Pro' },
      ].map((prod, i) => (
        <g key={i}>
          <rect x="358" y={prod.y} width="178" height="80" rx="8" fill={c.bgLight} stroke={`${c.primary}10`} />
          <rect x="370" y={prod.y + 10} width="60" height="60" rx="6" fill={`${c.primary}08`} />
          <rect x="370" y={prod.y + 28} width="60" height="24" rx="4" fill={`${c.primary}10`} />
          <rect x="440" y={prod.y + 14} width="80" height="5" rx="2.5" fill={c.text} opacity="0.4" />
          <rect x="440" y={prod.y + 28} width="50" height="7" rx="3.5" fill={c.text} opacity="0.6" />
          <rect x="440" y={prod.y + 46} width="70" height="18" rx="9" fill={c.primary} opacity="0.15" stroke={`${c.primary}30`} />
          <text x="475" y={prod.y + 58} fontSize="7" fill={c.primary} opacity="0.7" textAnchor="middle">Add to Cart</text>
        </g>
      ))}

      {/* Bottom product grid */}
      {[24, 158, 292, 426].map((x, i) => (
        <g key={x}>
          <rect x={x} y="290" width="122" height="98" rx="8" fill={c.bgLight} stroke={`${c.primary}08`} />
          <rect x={x + 8} y="298" width="106" height="50" rx="5" fill={`${c.primary}06`} />
          <rect x={x + 8} y="356" width="70" height="5" rx="2.5" fill={c.text} opacity="0.3" />
          <rect x={x + 8} y="366" width="40" height="6" rx="3" fill={c.text} opacity="0.5" />
          <rect x={x + 8} y="376" width="50" height="4" rx="2" fill={c.primary} opacity={0.4 - i * 0.05} />
        </g>
      ))}
    </g>
  )
}

// ─── Project Management ───────────────────────────────────────
function ProjectIllustration({ c }: { c: typeof PALETTE_COLORS['violet'] }) {
  return (
    <g>
      <WindowChrome c={c} />
      {/* Sidebar */}
      <rect x="0" y="36" width="140" height="364" fill={c.bgLight} />
      <line x1="140" y1="36" x2="140" y2="400" stroke={`${c.primary}12`} />
      {/* Project name */}
      <rect x="14" y="48" width="20" height="20" rx="5" fill={c.primary} opacity="0.6" />
      <text x="24" y="63" fontSize="12" fontWeight="700" fill="white" textAnchor="middle">P</text>
      <rect x="42" y="52" width="60" height="5" rx="2.5" fill={c.text} opacity="0.5" />
      <rect x="42" y="62" width="40" height="4" rx="2" fill={c.textDim} opacity="0.2" />

      {/* Nav items */}
      {['Board', 'Timeline', 'List', 'Calendar', 'Docs'].map((item, i) => (
        <g key={item}>
          <rect x="8" y={88 + i * 30} width="124" height="26" rx="5" fill={i === 0 ? `${c.primary}18` : 'transparent'} />
          {i === 0 && <rect x="10" y={88 + i * 30} width="2.5" height="26" rx="1.25" fill={c.primary} />}
          <rect x="22" y={96 + i * 30} width="14" height="10" rx="3" fill={i === 0 ? `${c.primary}40` : `${c.primary}12`} />
          <text x="44" y={104 + i * 30} fontSize="7" fill={i === 0 ? c.primary : c.textDim} opacity={i === 0 ? 0.8 : 0.4}>{item}</text>
        </g>
      ))}

      {/* Kanban columns */}
      {[
        { x: 154, title: 'To Do', count: 4, color: c.textDim },
        { x: 290, title: 'In Progress', count: 3, color: c.primary },
        { x: 426, title: 'Done', count: 5, color: '#22c55e' },
      ].map((col) => (
        <g key={col.x}>
          <rect x={col.x} y="48" width="122" height="16" rx="0" fill="transparent" />
          <circle cx={col.x + 6} cy="56" r="4" fill={col.color} opacity="0.5" />
          <text x={col.x + 16} y="60" fontSize="8" fontWeight="600" fill={c.text} opacity="0.5">{col.title}</text>
          <rect x={col.x + 90} y="50" width="16" height="12" rx="6" fill={`${c.primary}12`} />
          <text x={col.x + 98} y="59" fontSize="7" fill={c.textDim} opacity="0.4" textAnchor="middle">{col.count}</text>

          {/* Cards */}
          {[0, 1, 2].map((cardIdx) => {
            const cy = 74 + cardIdx * 78
            if (cardIdx >= col.count) return null
            return (
              <g key={cardIdx}>
                <rect x={col.x} y={cy} width="122" height="68" rx="8" fill={c.bgLight} stroke={`${c.primary}10`} />
                {/* Color accent */}
                <rect x={col.x + 8} y={cy + 8} width={24 + cardIdx * 8} height="6" rx="3" fill={col.color} opacity="0.4" />
                {/* Card title */}
                <rect x={col.x + 8} y={cy + 22} width={80 + cardIdx * 6} height="5" rx="2.5" fill={c.text} opacity="0.4" />
                <rect x={col.x + 8} y={cy + 32} width={50 + cardIdx * 10} height="4" rx="2" fill={c.textDim} opacity="0.2" />
                {/* Footer: avatar + date */}
                <circle cx={col.x + 18} cy={cy + 52} r="7" fill={`${c.primary}${15 + cardIdx * 8}`} />
                <rect x={col.x + 32} y={cy + 50} width="30" height="4" rx="2" fill={c.textDim} opacity="0.15" />
                {/* Priority dot */}
                <circle cx={col.x + 110} cy={cy + 52} r="3" fill={cardIdx === 0 ? '#f43f5e' : cardIdx === 1 ? '#f59e0b' : '#22c55e'} opacity="0.6" />
              </g>
            )
          })}
        </g>
      ))}
    </g>
  )
}

// ─── Code / Developer Tools ───────────────────────────────────
function CodeIllustration({ c }: { c: typeof PALETTE_COLORS['violet'] }) {
  return (
    <g>
      <WindowChrome c={c} />
      {/* File tree sidebar */}
      <rect x="0" y="36" width="150" height="364" fill={c.bgLight} />
      <line x1="150" y1="36" x2="150" y2="400" stroke={`${c.primary}12`} />
      <text x="14" y="56" fontSize="7" fontWeight="600" fill={c.textDim} opacity="0.4">EXPLORER</text>
      {/* File tree */}
      {[
        { indent: 0, name: 'src/', icon: '▾', isDir: true },
        { indent: 1, name: 'components/', icon: '▾', isDir: true },
        { indent: 2, name: 'Button.tsx', icon: '', isDir: false },
        { indent: 2, name: 'Card.tsx', icon: '', isDir: false },
        { indent: 1, name: 'lib/', icon: '▸', isDir: true },
        { indent: 1, name: 'app/', icon: '▸', isDir: true },
        { indent: 0, name: 'package.json', icon: '', isDir: false },
        { indent: 0, name: 'tsconfig.json', icon: '', isDir: false },
      ].map((file, i) => (
        <g key={i}>
          <rect x="6" y={64 + i * 20} width="138" height="18" rx="3" fill={i === 2 ? `${c.primary}15` : 'transparent'} />
          <text x={14 + file.indent * 12} y={76 + i * 20} fontSize="7" fill={file.isDir ? c.primary : c.text} opacity={file.isDir ? 0.6 : 0.35}>
            {file.icon ? `${file.icon} ` : '  '}{file.name}
          </text>
        </g>
      ))}

      {/* Editor area */}
      <rect x="150" y="36" width="410" height="254" fill={c.bg} />
      {/* Tabs */}
      <rect x="150" y="36" width="410" height="24" fill={c.bgLight} />
      <rect x="152" y="38" width="90" height="20" rx="0" fill={c.bg} />
      <text x="168" y="52" fontSize="7" fill={c.primary} opacity="0.7">Button.tsx</text>
      <text x="268" y="52" fontSize="7" fill={c.textDim} opacity="0.3">Card.tsx</text>

      {/* Line numbers */}
      {Array.from({ length: 14 }, (_, i) => (
        <text key={i} x="164" y={76 + i * 15} fontSize="8" fill={c.textDim} opacity="0.2" textAnchor="end">{i + 1}</text>
      ))}

      {/* Code lines - syntax highlighted */}
      {[
        { tokens: [{ t: 'import', c: c.secondary }, { t: ' { Button }', c: c.text }, { t: ' from', c: c.secondary }, { t: " '@/ui'", c: c.accent }] },
        { tokens: [{ t: 'import', c: c.secondary }, { t: ' { cn }', c: c.text }, { t: ' from', c: c.secondary }, { t: " '@/lib'", c: c.accent }] },
        { tokens: [] },
        { tokens: [{ t: 'interface', c: c.secondary }, { t: ' Props', c: '#22c55e' }, { t: ' {', c: c.textDim }] },
        { tokens: [{ t: '  variant', c: c.primary }, { t: ':', c: c.textDim }, { t: " 'primary'", c: c.accent }, { t: ' |', c: c.textDim }, { t: " 'ghost'", c: c.accent }] },
        { tokens: [{ t: '  size', c: c.primary }, { t: ':', c: c.textDim }, { t: " 'sm'", c: c.accent }, { t: ' |', c: c.textDim }, { t: " 'lg'", c: c.accent }] },
        { tokens: [{ t: '}', c: c.textDim }] },
        { tokens: [] },
        { tokens: [{ t: 'export', c: c.secondary }, { t: ' function', c: c.secondary }, { t: ' Hero', c: '#f59e0b' }, { t: '(', c: c.textDim }] },
        { tokens: [{ t: '  { variant, size }', c: c.text }, { t: ': Props', c: '#22c55e' }] },
        { tokens: [{ t: ') {', c: c.textDim }] },
        { tokens: [{ t: '  return', c: c.secondary }, { t: ' (', c: c.textDim }] },
        { tokens: [{ t: '    <div', c: c.primary }, { t: ' className=', c: c.accent }, { t: '{cn(', c: c.textDim }] },
        { tokens: [{ t: '      "flex items-center"', c: c.accent }] },
      ].map((line, lineIdx) => {
        let xPos = 174
        return (
          <g key={lineIdx}>
            {/* Active line highlight */}
            {lineIdx === 8 && <rect x="150" y={66 + lineIdx * 15} width="410" height="15" fill={`${c.primary}08`} />}
            {line.tokens.map((token, tIdx) => {
              const el = <text key={tIdx} x={xPos} y={76 + lineIdx * 15} fontSize="8" fill={token.c} opacity="0.7">{token.t}</text>
              xPos += token.t.length * 4.8
              return el
            })}
          </g>
        )
      })}

      {/* Terminal at bottom */}
      <rect x="150" y="290" width="410" height="110" fill={c.bgLight} />
      <line x1="150" y1="290" x2="560" y2="290" stroke={`${c.primary}15`} />
      <text x="166" y="306" fontSize="7" fontWeight="600" fill={c.textDim} opacity="0.4">TERMINAL</text>
      <text x="166" y="322" fontSize="8" fill="#22c55e" opacity="0.6">$ npm run dev</text>
      <text x="166" y="338" fontSize="8" fill={c.textDim} opacity="0.35">  ▲ Next.js 15.5</text>
      <text x="166" y="354" fontSize="8" fill={c.textDim} opacity="0.35">  - Local: http://localhost:3000</text>
      <text x="166" y="370" fontSize="8" fill="#22c55e" opacity="0.5">  ✓ Ready in 842ms</text>
      {/* Cursor */}
      <text x="166" y="386" fontSize="8" fill="#22c55e" opacity="0.6">$</text>
      <rect x="176" y="379" width="6" height="10" fill={c.primary} opacity="0.5" />
    </g>
  )
}

// ─── Default Dashboard ────────────────────────────────────────
function DashboardIllustration({ c }: { c: typeof PALETTE_COLORS['violet'] }) {
  const chartPoints = [
    { x: 168, y: 210 }, { x: 198, y: 195 }, { x: 228, y: 202 }, { x: 258, y: 178 },
    { x: 288, y: 165 }, { x: 318, y: 172 }, { x: 348, y: 148 }, { x: 378, y: 135 }, { x: 398, y: 142 },
  ]
  const chartLine = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const chartArea = `${chartLine} L398,248 L168,248 Z`

  return (
    <g>
      <WindowChrome c={c} />
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.primary} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="sidebarGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.bgLight} />
          <stop offset="100%" stopColor={c.bg} />
        </linearGradient>
      </defs>

      {/* Sidebar */}
      <rect x="0" y="36" width="136" height="364" fill="url(#sidebarGrad)" />
      <line x1="136" y1="36" x2="136" y2="400" stroke={`${c.primary}12`} />
      <rect x="16" y="50" width="24" height="24" rx="6" fill={c.primary} opacity="0.8" />
      <text x="22" y="67" fontSize="14" fontWeight="800" fill="white" opacity="0.9">D</text>
      <rect x="48" y="54" width="56" height="7" rx="3.5" fill={c.text} opacity="0.5" />
      {[100, 130, 160, 190].map((y, i) => (
        <g key={y}>
          <rect x="8" y={y} width="120" height="26" rx="5" fill={i === 0 ? `${c.primary}20` : 'transparent'} />
          {i === 0 && <rect x="10" y={y} width="2.5" height="26" rx="1.25" fill={c.primary} />}
          <rect x="24" y={y + 6} width="14" height="14" rx="3" fill={i === 0 ? `${c.primary}40` : `${c.primary}12`} />
          <rect x="46" y={y + 10} width={44 + i * 6} height="5" rx="2.5" fill={i === 0 ? c.primary : `${c.primary}15`} opacity={i === 0 ? 0.7 : 1} />
        </g>
      ))}

      {/* Stat cards */}
      {[
        { x: 152, val: '2,847', trend: '+12%' },
        { x: 253, val: '94.2%', trend: '+3.1%' },
        { x: 354, val: '23', trend: '+2' },
        { x: 455, val: '1.4d', trend: '-0.3d' },
      ].map((card, i) => (
        <g key={card.x}>
          <rect x={card.x} y="48" width="93" height="60" rx="8" fill={c.bgLight} stroke={`${c.primary}12`} />
          <circle cx={card.x + 18} cy="64" r="8" fill={`${c.primary}15`} />
          <text x={card.x + 12} y="92" fontSize="12" fontWeight="700" fill={c.text} opacity="0.85">{card.val}</text>
          <rect x={card.x + 12} y="98" width="50" height="4" rx="2" fill={c.textDim} opacity="0.3" />
          <rect x={card.x + 58} y="58" width="26" height="12" rx="6" fill={i < 3 ? '#10b98118' : '#f4735018'} />
          <text x={card.x + 64} y="67" fontSize="6" fill={i < 3 ? '#34d399' : '#fb923c'} opacity="0.9">{card.trend}</text>
        </g>
      ))}

      {/* Chart */}
      <rect x="152" y="118" width="256" height="136" rx="8" fill={c.bgLight} stroke={`${c.primary}10`} />
      <rect x="164" y="128" width="64" height="6" rx="3" fill={c.text} opacity="0.5" />
      {[155, 175, 195, 215, 235].map((y) => (
        <line key={y} x1="168" y1={y} x2="398" y2={y} stroke={`${c.primary}06`} />
      ))}
      <path d={chartArea} fill="url(#chartGrad)" />
      <path d={chartLine} stroke={c.primary} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="378" cy="135" r="6" fill={c.primary} opacity="0.15" />
      <circle cx="378" cy="135" r="3" fill={c.primary} opacity="0.8" />

      {/* Activity panel */}
      <rect x="418" y="118" width="130" height="270" rx="8" fill={c.bgLight} stroke={`${c.primary}10`} />
      <rect x="430" y="128" width="46" height="6" rx="3" fill={c.text} opacity="0.5" />
      {[148, 180, 212, 244, 276, 308, 340].map((y, i) => (
        <g key={y}>
          <circle cx="438" cy={y + 8} r="6" fill={`${c.primary}${12 + i * 3}`} />
          <rect x="450" y={y + 3} width={50 + (i % 3) * 8} height="4" rx="2" fill={c.text} opacity="0.3" />
          <rect x="450" y={y + 11} width={35 + (i % 2) * 10} height="3" rx="1.5" fill={c.textDim} opacity="0.15" />
        </g>
      ))}

      {/* Bottom panel */}
      <rect x="152" y="264" width="256" height="124" rx="8" fill={c.bgLight} stroke={`${c.primary}10`} />
      <rect x="164" y="274" width="56" height="6" rx="3" fill={c.text} opacity="0.5" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={164 + i * 83} y="290" width="75" height="88" rx="6" fill={c.bg} stroke={`${c.primary}08`} />
          <rect x={164 + i * 83} y="290" width="3" height="88" rx="1.5" fill={[c.primary, c.accent, c.secondary][i]} opacity="0.5" />
          <rect x={174 + i * 83} y="300" width="48" height="4" rx="2" fill={c.text} opacity="0.3" />
          <rect x={174 + i * 83} y="310" width="36" height="3" rx="1.5" fill={c.textDim} opacity="0.2" />
          <rect x={174 + i * 83} y="358" width="40" height="3" rx="1.5" fill={`${c.primary}10`} />
          <rect x={174 + i * 83} y="358" width={i === 2 ? 40 : i === 1 ? 24 : 12} height="3" rx="1.5" fill={[c.primary, c.accent, c.secondary][i]} opacity="0.4" />
        </g>
      ))}
    </g>
  )
}

const ILLUSTRATION_MAP: Record<IllustrationType, React.FC<{ c: typeof PALETTE_COLORS['violet'] }>> = {
  writing: WritingIllustration,
  analytics: AnalyticsIllustration,
  messaging: MessagingIllustration,
  ecommerce: EcommerceIllustration,
  project: ProjectIllustration,
  code: CodeIllustration,
  dashboard: DashboardIllustration,
}

export function HeroIllustration({ palette = 'violet', hint, headline, className = '' }: HeroIllustrationProps) {
  const c = PALETTE_COLORS[palette]
  const type = detectType(hint, headline)
  const Illustration = ILLUSTRATION_MAP[type]

  return (
    <div className={`relative ${className}`}>
      {/* Glow behind */}
      <div
        className="absolute -inset-4 blur-3xl opacity-25 rounded-3xl"
        style={{ background: `radial-gradient(ellipse at 50% 40%, ${c.primary}50, ${c.secondary}20, transparent 70%)` }}
      />

      {/* Perspective wrapper */}
      <div className="relative" style={{ perspective: '1200px' }}>
        <div style={{ transform: 'rotateX(2deg)' }}>
          <svg
            viewBox="0 0 560 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative w-full h-auto"
            style={{ filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))' }}
          >
            <defs>
              <clipPath id="windowClip">
                <rect x="0" y="0" width="560" height="400" rx="12" />
              </clipPath>
            </defs>
            <g clipPath="url(#windowClip)">
              <rect width="560" height="400" fill={c.bg} />
              <Illustration c={c} />
              <rect x="0" y="0" width="560" height="400" rx="12" fill="none" stroke={`${c.primary}15`} strokeWidth="1" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
