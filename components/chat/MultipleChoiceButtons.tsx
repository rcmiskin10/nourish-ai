'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import type { MultipleChoiceOption, MultipleChoiceGroup } from '@/types/agents'

interface MultipleChoiceButtonsProps {
  groups: MultipleChoiceGroup[]
  onSelect: (choice: MultipleChoiceOption) => void
  /** Called with combined selections when multiple groups are present */
  onSubmitAll?: (selections: Record<number, MultipleChoiceOption>) => void
  disabled?: boolean
}

export function MultipleChoiceButtons({
  groups,
  onSelect,
  onSubmitAll,
  disabled = false,
}: MultipleChoiceButtonsProps) {
  const [selections, setSelections] = useState<Record<number, MultipleChoiceOption>>({})

  if (!groups || groups.length === 0) return null

  const isMultiGroup = groups.length > 1
  const allAnswered = isMultiGroup && Object.keys(selections).length === groups.length

  const handleClick = (groupIndex: number, choice: MultipleChoiceOption) => {
    if (isMultiGroup) {
      // Multi-group: track selections, submit when all answered
      setSelections(prev => ({ ...prev, [groupIndex]: choice }))
    } else {
      // Single group: immediate send (original behavior)
      onSelect(choice)
    }
  }

  const handleSubmitAll = () => {
    if (!allAnswered) return
    if (onSubmitAll) {
      onSubmitAll(selections)
    } else {
      // Fallback: build combined response text
      const combined: MultipleChoiceOption = {
        key: Object.values(selections).map(s => s.key).join(', '),
        label: Object.entries(selections)
          .map(([i, s]) => `${Number(i) + 1}. ${s.key}`)
          .join(', '),
      }
      onSelect(combined)
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-3">
      {groups.map((group, groupIndex) => {
        const selectedKey = selections[groupIndex]?.key
        return (
          <div key={groupIndex} className="flex flex-col gap-2">
            {group.header && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                {group.header}
              </p>
            )}
            {!group.header && isMultiGroup && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                Question {groupIndex + 1}
              </p>
            )}
            {group.choices.map((choice, index) => {
              const isSelected = selectedKey === choice.key
              return (
                <Button
                  key={`${groupIndex}-${index}-${choice.key}`}
                  variant="outline"
                  className={`justify-start text-left h-auto py-3 px-4 whitespace-normal transition-colors ${
                    isSelected
                      ? 'bg-violet-50 border-violet-400 dark:bg-violet-950 dark:border-violet-600 ring-1 ring-violet-400 dark:ring-violet-600'
                      : 'hover:bg-violet-50 hover:border-violet-300 dark:hover:bg-violet-950 dark:hover:border-violet-700'
                  }`}
                  onClick={() => handleClick(groupIndex, choice)}
                  disabled={disabled}
                >
                  <span className="inline-flex items-center gap-3 w-full">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full text-sm font-semibold flex items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white'
                        : 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white'
                    }`}>
                      {isSelected ? '✓' : choice.key}
                    </span>
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-medium text-sm">{choice.label}</span>
                      {choice.description && (
                        <span className="text-xs text-muted-foreground">
                          {choice.description}
                        </span>
                      )}
                    </span>
                  </span>
                </Button>
              )
            })}
          </div>
        )
      })}

      {/* Submit button when multiple groups */}
      {isMultiGroup && (
        <Button
          className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          onClick={handleSubmitAll}
          disabled={disabled || !allAnswered}
        >
          <Send className="h-4 w-4" />
          Submit answers ({Object.keys(selections).length}/{groups.length})
        </Button>
      )}
    </div>
  )
}
