import { UtensilsCrossed } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type FieldType =
  | 'text'
  | 'rich-text'
  | 'number'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multi-select'
  | 'tags'
  | 'url'
  | 'email'

export interface EntityField {
  name: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  description?: string
  options?: string[]
  defaultValue?: string | number | boolean
  showInList?: boolean
  showInForm?: boolean
}

export interface EntityConfig {
  name: string
  pluralName: string
  slug: string
  icon: LucideIcon
  fields: EntityField[]
  titleField: string
  descriptionField?: string
  defaultSort: { field: string; direction: 'asc' | 'desc' }
  allowCreate: boolean
  allowEdit: boolean
  allowDelete: boolean
  allowExport: boolean
}

export const entityConfig: EntityConfig = {
  name: 'Meal Plan',
  pluralName: 'Meal Plans',
  slug: 'meal_plans',
  icon: UtensilsCrossed,

  fields: [
    {
      name: 'plan_name',
      label: 'Plan Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Weekly Keto Plan',
      showInList: true,
      showInForm: true,
    },
    {
      name: 'dietary_restrictions',
      label: 'Dietary Restrictions',
      type: 'multi-select',
      required: false,
      options: ['keto', 'vegan', 'gluten_free', 'dairy_free', 'nut_allergy', 'soy_allergy'],
      showInList: true,
      showInForm: true,
    },
    {
      name: 'nutritional_goals',
      label: 'Nutritional Goals',
      type: 'multi-select',
      required: false,
      options: ['weight_loss', 'muscle_gain', 'maintenance', 'heart_health'],
      showInList: true,
      showInForm: true,
    },
    {
      name: 'generation_date',
      label: 'Generation Date',
      type: 'date',
      required: true,
      showInList: true,
      showInForm: true,
    },
    {
      name: 'available_ingredients',
      label: 'Available Ingredients',
      type: 'tags',
      required: false,
      placeholder: 'e.g., chicken, broccoli, rice',
      showInList: false,
      showInForm: true,
    },
    {
      name: 'total_calories',
      label: 'Total Calories',
      type: 'number',
      required: false,
      placeholder: 'e.g., 2000',
      showInList: false,
      showInForm: true,
    },
    {
      name: 'recipes',
      label: 'Generated Recipes',
      type: 'rich-text',
      required: false,
      placeholder: 'AI-generated recipes will appear here...',
      showInList: false,
      showInForm: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: ['draft', 'active', 'completed', 'archived'],
      defaultValue: 'draft',
      showInList: false,
      showInForm: true,
    },
    {
      name: 'is_favorite',
      label: 'Favorite',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      showInList: false,
      showInForm: true,
    }
  ],

  titleField: 'plan_name',
  descriptionField: 'nutritional_goals',
  defaultSort: { field: 'generation_date', direction: 'desc' },

  allowCreate: true,
  allowEdit: true,
  allowDelete: true,
  allowExport: true,
}

export function getListFields(): EntityField[] {
  return entityConfig.fields.filter((f) => f.showInList !== false)
}

export function getFormFields(): EntityField[] {
  return entityConfig.fields.filter((f) => f.showInForm !== false)
}

export function fieldTypeToSql(type: FieldType): string {
  const mapping: Record<FieldType, string> = {
    text: 'TEXT',
    'rich-text': 'TEXT',
    number: 'INTEGER',
    currency: 'NUMERIC(10,2)',
    date: 'DATE',
    datetime: 'TIMESTAMPTZ',
    boolean: 'BOOLEAN DEFAULT FALSE',
    select: 'TEXT',
    'multi-select': 'TEXT[]',
    tags: 'TEXT[]',
    url: 'TEXT',
    email: 'TEXT',
  }
  return mapping[type] || 'TEXT'
}

export function fieldTypeToZod(field: EntityField): string {
  const base: Record<FieldType, string> = {
    text: 'z.string()',
    'rich-text': 'z.string()',
    number: 'z.coerce.number()',
    currency: 'z.coerce.number()',
    date: 'z.string()',
    datetime: 'z.string()',
    boolean: 'z.boolean()',
    select: `z.enum([${field.options?.map((o) => `'${o}'`).join(', ') || "'draft'"}])`,
    'multi-select': 'z.array(z.string())',
    tags: 'z.array(z.string())',
    url: 'z.string().url()',
    email: 'z.string().email()',
  }
  let schema = base[field.type] || 'z.string()'
  if (!field.required) {
    schema += '.optional()'
  }
  return schema
}
