import { query } from '@anthropic-ai/claude-agent-sdk'
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk'
import { getAgentConfig } from './config'
import { createPageDesignerMcpServer } from './mcp-tools'
import type { AgentType, ChatRequest, ChatStreamEvent, ConversationContext } from '@/types/agents'

// Map agent model preferences to Anthropic model IDs
const MODEL_MAP = {
  sonnet: 'claude-sonnet-4-5-20250929',
  opus: 'claude-opus-4-6',
  haiku: 'claude-haiku-4-5-20251001',
} as const

/**
 * Convert an SDKMessage from the Agent SDK into NDJSON ChatStreamEvents.
 */
function sdkMessageToEvents(msg: SDKMessage): ChatStreamEvent[] {
  const events: ChatStreamEvent[] = []

  switch (msg.type) {
    case 'stream_event': {
      // Partial assistant message — streaming text deltas
      const event = (msg as any).event
      if (!event) break

      // content_block_delta with text_delta
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        events.push({
          type: 'text',
          content: event.delta.text,
        })
      }
      break
    }

    case 'assistant': {
      // Full assistant message — extract any tool_use blocks
      const message = (msg as any).message
      if (!message?.content) break

      for (const block of message.content) {
        if (block.type === 'tool_use') {
          events.push({
            type: 'tool_call',
            toolName: block.name,
            toolInput: block.input as Record<string, unknown>,
          })
        }
        if (block.type === 'tool_result') {
          const output = typeof block.content === 'string'
            ? block.content
            : Array.isArray(block.content)
              ? block.content.map((c: any) => c.text || '').join('')
              : ''
          events.push({
            type: 'tool_result',
            toolName: (block as any).tool_name || '',
            toolOutput: output,
          })
        }
      }
      break
    }

    case 'tool_progress': {
      // Tool is running — emit a tool_call event for the activity indicator
      events.push({
        type: 'tool_call',
        toolName: (msg as any).tool_name || 'tool',
        toolInput: {},
      })
      break
    }

    case 'result': {
      events.push({ type: 'done' })
      break
    }
  }

  return events
}

export class AgentOrchestrator {
  async runAgent(request: ChatRequest & { apiKey?: string }): Promise<ReadableStream<Uint8Array>> {
    const { agentType, prompt, messages, context, apiKey } = request
    const config = getAgentConfig(agentType)
    const modelId = MODEL_MAP[config.model]

    // Build system prompt with context
    const systemPrompt = this.buildSystemPrompt(config.systemPrompt, context)

    // Build the full prompt from conversation history
    const fullPrompt = this.buildPrompt(prompt, messages, context)

    // Create MCP server for page designer tools
    const mcpServer = createPageDesignerMcpServer()

    // Build clean env — strip CLAUDECODE to avoid nested session detection
    const cleanEnv: Record<string, string> = {}
    for (const [key, val] of Object.entries(process.env)) {
      if (key === 'CLAUDECODE') continue
      if (val !== undefined) cleanEnv[key] = val
    }

    // Only set API key if explicitly provided — otherwise let Claude Code
    // fall back to the user's Claude subscription (OAuth/Max plan)
    const resolvedApiKey = apiKey || process.env.ANTHROPIC_API_KEY
    if (resolvedApiKey) {
      cleanEnv.ANTHROPIC_API_KEY = resolvedApiKey
    } else {
      delete cleanEnv.ANTHROPIC_API_KEY
    }

    console.log('[Orchestrator] CLAUDECODE in cleanEnv:', cleanEnv.CLAUDECODE ?? '(not set)')
    console.log('[Orchestrator] Auth mode:', resolvedApiKey ? 'API key' : 'Claude subscription (OAuth)')
    console.log('[Orchestrator] claudePath:', process.env.CLAUDE_CODE_PATH || '/Users/rcmiskin/.claude/local/claude')

    // Run the Agent SDK query
    const agentQuery = query({
      prompt: fullPrompt,
      options: {
        systemPrompt,
        model: modelId,
        maxTurns: 5,
        maxBudgetUsd: 0.50,
        includePartialMessages: true,
        permissionMode: 'bypassPermissions',
        pathToClaudeCodeExecutable: process.env.CLAUDE_CODE_PATH || '/Users/rcmiskin/.claude/local/claude',
        mcpServers: {
          'page-designer': mcpServer,
        },
        allowedTools: [
          'WebSearch',
          'WebFetch',
          'mcp__page-designer__search_images',
          'mcp__page-designer__generate_color_palette',
          'mcp__page-designer__analyze_seo',
        ],
        // Explicitly block dangerous tools — defense in depth
        disallowedTools: [
          'Bash',
          'Read',
          'Write',
          'Edit',
          'Glob',
          'Grep',
          'NotebookEdit',
          'Task',
        ],
        stderr: (data: string) => {
          console.error('[Agent SDK stderr]', data)
        },
        env: cleanEnv,
      },
    })

    // Bridge the async generator to a ReadableStream of NDJSON
    const encoder = new TextEncoder()

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const msg of agentQuery) {
            const events = sdkMessageToEvents(msg)
            for (const event of events) {
              const line = JSON.stringify(event) + '\n'
              controller.enqueue(encoder.encode(line))
            }
          }

          // Ensure a done event is always sent
          const doneLine = JSON.stringify({ type: 'done' }) + '\n'
          controller.enqueue(encoder.encode(doneLine))
        } catch (error) {
          const errorEvent: ChatStreamEvent = {
            type: 'error',
            error: error instanceof Error ? error.message : 'Agent query failed',
          }
          const line = JSON.stringify(errorEvent) + '\n'
          controller.enqueue(encoder.encode(line))
        } finally {
          controller.close()
        }
      },
    })
  }

  /**
   * Build system prompt with injected context about current page.
   */
  private buildSystemPrompt(
    basePrompt: string,
    context?: ConversationContext
  ): string {
    if (!context?.currentPage) return basePrompt

    const pageContext = `
## Current Page Context

The user has an existing landing page that they may want to modify. Here is the current structure:

\`\`\`json
${JSON.stringify(context.currentPage, null, 2)}
\`\`\`

When the user asks for changes, use the "patch" action format to make surgical updates rather than regenerating the entire page.
`

    return `${basePrompt}\n\n${pageContext}`
  }

  /**
   * Build a single prompt string from conversation history.
   * The Agent SDK takes a single prompt, so we concatenate the history.
   */
  private buildPrompt(
    prompt: string,
    messages?: Array<{ role: 'user' | 'assistant'; content: string }>,
    context?: ConversationContext
  ): string {
    if (!messages || messages.length === 0) {
      return prompt
    }

    // Format conversation history into a single prompt
    const history = messages.map((m) => {
      const role = m.role === 'user' ? 'User' : 'Assistant'
      return `${role}: ${m.content}`
    }).join('\n\n')

    return `Here is the conversation so far:\n\n${history}\n\nPlease continue the conversation from where the last message left off. Respond to the most recent user message.`
  }
}
