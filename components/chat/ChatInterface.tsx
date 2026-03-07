'use client'

import { useRef, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Loader2, Bot, User, Trash2, Plus, MessageSquare, ChevronDown, CheckCircle2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession, type Message } from '@/hooks/use-session'
import { MultipleChoiceButtons } from './MultipleChoiceButtons'
import { parseMultipleChoiceGroups, hasMultipleChoice } from '@/lib/utils/message-parser'
import type { AgentType, LandingPageStructure, MultipleChoiceOption, MultipleChoiceGroup, ChatStreamEvent } from '@/types/agents'

// Strip JSON code blocks from display (they're consumed by extractAIAction, not for the user)
function stripJsonBlocks(content: string): string {
  return content.replace(/```json\s*[\s\S]*?```/g, '').trim()
}

// Check if original content had JSON blocks (meaning a preview update was applied)
function hadJsonBlocks(content: string): boolean {
  return /```json\s*[\s\S]*?```/.test(content)
}

// Human-readable tool names for the activity indicator
const TOOL_DISPLAY_NAMES: Record<string, string> = {
  'WebSearch': 'Searching the web',
  'WebFetch': 'Fetching page',
  'mcp__page-designer__search_images': 'Searching images',
  'mcp__page-designer__generate_color_palette': 'Generating palette',
  'mcp__page-designer__analyze_seo': 'Analyzing SEO',
}

function getToolDisplayName(toolName: string): string {
  return TOOL_DISPLAY_NAMES[toolName] || `Running ${toolName}`
}

/**
 * Parse an NDJSON stream into ChatStreamEvents.
 * Falls back to treating non-JSON lines as raw text (backward compat).
 */
function parseNdjsonLine(line: string): ChatStreamEvent | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  try {
    return JSON.parse(trimmed) as ChatStreamEvent
  } catch {
    // Fallback: treat as raw text (backward compat with plain text streams)
    return { type: 'text', content: trimmed }
  }
}

interface ChatInterfaceProps {
  agentType: AgentType
  onMessage?: (message: Message) => void
  placeholder?: string
  currentPage?: LandingPageStructure
}

export function ChatInterface({
  agentType,
  onMessage,
  placeholder = 'Type your message...',
  currentPage,
}: ChatInterfaceProps) {
  const {
    session,
    sessions,
    isLoading: isSessionLoading,
    createSession,
    loadSession,
    updateSession,
    deleteSession,
  } = useSession({ agentType })

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [toolActivity, setToolActivity] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const messages = session?.messages || []

  // Display messages with streaming content if active
  const displayMessages = streamingContent !== null && messages.length > 0
    ? messages.map((msg, idx) =>
        idx === messages.length - 1 && msg.role === 'assistant'
          ? { ...msg, content: streamingContent }
          : msg
      )
    : messages

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayMessages, streamingContent, toolActivity])

  const handleNewChat = async () => {
    await createSession()
  }

  const handleSelectSession = async (sessionId: string) => {
    await loadSession(sessionId)
  }

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId)
    // If we deleted the current session and there are others, load the first one
    if (session?.id === sessionId && sessions.length > 1) {
      const remaining = sessions.filter((s) => s.id !== sessionId)
      if (remaining.length > 0) {
        await loadSession(remaining[0].id)
      }
    }
  }

  /**
   * Process an NDJSON stream from the chat API.
   * Returns the accumulated text content.
   */
  const processNdjsonStream = async (reader: ReadableStreamDefaultReader<Uint8Array>): Promise<string> => {
    const decoder = new TextDecoder()
    let content = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Process complete lines
      const lines = buffer.split('\n')
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || ''

      for (const line of lines) {
        const event = parseNdjsonLine(line)
        if (!event) continue

        switch (event.type) {
          case 'text':
            if (event.content) {
              content += event.content
              setStreamingContent(content)
            }
            break
          case 'tool_call':
            if (event.toolName) {
              setToolActivity(getToolDisplayName(event.toolName))
            }
            break
          case 'tool_result':
            setToolActivity(null)
            break
          case 'error':
            console.error('[ChatInterface] Stream error:', event.error)
            break
          case 'done':
            setToolActivity(null)
            break
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      const event = parseNdjsonLine(buffer)
      if (event?.type === 'text' && event.content) {
        content += event.content
        setStreamingContent(content)
      }
    }

    return content
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !session) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    const updatedMessages = [...messages, userMessage]
    await updateSession({ messages: updatedMessages })

    // Update title if this is the first message
    if (messages.length === 0) {
      const title = input.trim().slice(0, 50) + (input.trim().length > 50 ? '...' : '')
      await updateSession({ title })
    }

    setInput('')
    setIsLoading(true)
    setToolActivity(null)

    try {
      // Build messages array for full conversation history
      const conversationMessages = [...updatedMessages].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentType,
          prompt: userMessage.content,
          messages: conversationMessages,
          sessionId: session.id,
          context: currentPage ? { currentPage } : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to send message')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      }

      // Add empty assistant message to session
      const withAssistant = [...updatedMessages, assistantMessage]
      await updateSession({ messages: withAssistant })

      // Start streaming
      setStreamingContent('')

      const content = await processNdjsonStream(reader)

      // Streaming complete - save final content to database
      setStreamingContent(null)
      setToolActivity(null)
      const finalMessages = withAssistant.map((msg) =>
        msg.id === assistantMessage.id ? { ...msg, content } : msg
      )
      await updateSession({ messages: finalMessages })

      console.log('[ChatInterface] Calling onMessage with content length:', content.length)
      onMessage?.({ ...assistantMessage, content })
    } catch (error) {
      console.error('Chat error:', error)
      setStreamingContent(null)
      setToolActivity(null)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, an error occurred. Please try again.',
      }
      await updateSession({ messages: [...updatedMessages, errorMessage] })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Handle multi-group submission (when AI asks multiple questions at once)
  const handleMultiGroupSubmit = (selections: Record<number, MultipleChoiceOption>) => {
    // Build a readable combined answer like "1. B\n2. A\n3. C"
    const answerText = Object.entries(selections)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, choice]) => choice.key)
      .join(', ')
    handleChoiceSelect({ key: answerText, label: answerText })
  }

  // Handle multiple-choice selection
  const handleChoiceSelect = async (choice: MultipleChoiceOption) => {
    if (isLoading || !session) return

    // Send the choice key as the user's response
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: choice.key,
    }

    const updatedMessages = [...messages, userMessage]
    await updateSession({ messages: updatedMessages })

    setIsLoading(true)
    setToolActivity(null)

    try {
      // Build messages array for full conversation history
      const conversationMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentType,
          prompt: choice.key,
          messages: conversationMessages,
          sessionId: session.id,
          context: currentPage ? { currentPage } : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to send message')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      }

      const withAssistant = [...updatedMessages, assistantMessage]
      await updateSession({ messages: withAssistant })

      setStreamingContent('')

      const content = await processNdjsonStream(reader)

      setStreamingContent(null)
      setToolActivity(null)
      const finalMessages = withAssistant.map((msg) =>
        msg.id === assistantMessage.id ? { ...msg, content } : msg
      )
      await updateSession({ messages: finalMessages })

      onMessage?.({ ...assistantMessage, content })
    } catch (error) {
      console.error('Chat error:', error)
      setStreamingContent(null)
      setToolActivity(null)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, an error occurred. Please try again.',
      }
      await updateSession({ messages: [...updatedMessages, errorMessage] })
    } finally {
      setIsLoading(false)
    }
  }

  // Check if the last assistant message has choices (and it's not being streamed)
  const lastMessage = displayMessages[displayMessages.length - 1]
  const showChoices =
    !isLoading &&
    streamingContent === null &&
    lastMessage?.role === 'assistant' &&
    hasMultipleChoice(lastMessage.content)
  const choiceGroups: MultipleChoiceGroup[] = showChoices ? parseMultipleChoiceGroups(lastMessage.content) : []

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with session selector */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              <span className="max-w-[200px] truncate">
                {session?.title || 'New Chat'}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px]">
            <DropdownMenuItem onClick={handleNewChat} className="gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </DropdownMenuItem>
            {sessions.length > 0 && <DropdownMenuSeparator />}
            {sessions.map((s) => (
              <DropdownMenuItem
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                className={`flex items-center justify-between group ${
                  s.id === session?.id ? 'bg-accent' : ''
                }`}
              >
                <span className="truncate max-w-[200px]">{s.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteSession(s.id)
                  }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {displayMessages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="text-xs text-muted-foreground"
          >
            <Plus className="h-3 w-3 mr-1" />
            New
          </Button>
        )}
      </div>

      {/* Messages area - scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 min-h-0"
      >
        <div className="space-y-4">
          {displayMessages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with the AI agent.</p>
              <p className="text-sm mt-2">
                Describe what you want to create or ask for help.
              </p>
            </div>
          )}
          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 overflow-hidden ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="text-sm leading-relaxed">
                    {hadJsonBlocks(message.content) && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Preview updated
                      </div>
                    )}
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-strong:text-inherit">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {stripJsonBlocks(message.content)}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {message.content}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {/* Loading indicator with tool activity */}
          {isLoading && (streamingContent === null || displayMessages[displayMessages.length - 1]?.role === 'user') && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
              </div>
            </div>
          )}
          {/* Tool activity indicator */}
          {toolActivity && (
            <div className="ml-11">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
                {toolActivity}
              </div>
            </div>
          )}
          {/* Multiple choice buttons */}
          {showChoices && choiceGroups.length > 0 && (
            <div className="ml-11">
              <MultipleChoiceButtons
                groups={choiceGroups}
                onSelect={handleChoiceSelect}
                onSubmitAll={handleMultiGroupSubmit}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <form onSubmit={handleSubmit} className="border-t p-4 flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[60px] max-h-[120px] resize-none rounded-xl"
            disabled={isLoading || !session}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || !session}
            className="h-[60px] w-[60px] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
