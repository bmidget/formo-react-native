import type { ComponentType } from 'react'

export type RuleFn = (value: unknown, params: unknown[], ctx: { values: Record<string, any>; path: string }) => boolean | string | Promise<boolean | string>

export type RuleSpec =
  | string
  | [string, unknown[]?]
  | RuleFn
  | Record<string, unknown>

export interface FieldDef {
  alias?: string | number
  driver?: string
  type?: string
  val?: unknown
  value?: unknown
  label?: string
  placeholder?: string
  message?: string
  required?: boolean
  editable?: boolean
  disabled?: boolean
  render?: boolean
  ignore?: boolean | Record<string, unknown>
  rules?: RuleSpec | RuleSpec[]
  opts?: Record<string, string> | Array<{ label: string; value: unknown }>
  options?: Record<string, string> | Array<{ label: string; value: unknown }>
  fields?: FieldInput[] | Record<string, FieldDef | string>
  component?: ComponentType<any>
  attr?: Record<string, any>
  [key: string]: unknown
}

export type FieldInput = string | FieldDef | [string, string?, unknown?, FieldDef?]

export interface FieldNode {
  alias: string | number
  driver: string
  type?: string
  val?: unknown
  label?: string
  placeholder?: string
  message?: string
  required: boolean
  editable: boolean
  disabled: boolean
  render: boolean
  rules: RuleSpec[]
  options: Array<{ label: string; value: unknown }>
  fields: FieldNode[]
  component?: ComponentType<any>
  attr: Record<string, any>
  raw: FieldDef
}

export type FormoDefinition = FieldDef | { toSchema(): FieldDef }

export type OutcomeResult = 'success' | 'invalid' | 'rejected'
export type RejectedReason = 'validation' | 'session' | 'server' | 'handler' | 'error'

export interface FormoOutcome {
  result: OutcomeResult
  reason?: RejectedReason
  data?: unknown
  errors?: Record<string, string>
  error?: unknown
}

export interface FormoFieldHandle {
  path: string
  node: FieldNode
  value: unknown
  error: string | undefined
  invalid: boolean
  touched: boolean
  required: boolean
  editable: boolean
  disabled: boolean
  setValue: (value: unknown) => void
  setBlur: () => void
}

export interface FormoController {
  root: FieldNode
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  dirty: boolean
  submitting: boolean
  outcome: FormoOutcome | null
  fields: Record<string, FormoFieldHandle>
  val: (path: string, value?: unknown) => any
  load: (values: Record<string, any>) => void
  reset: (values?: Record<string, any>) => void
  setErrors: (errors: Record<string, string | string[]>) => void
  validate: () => Promise<boolean>
  submit: (handler?: (values: Record<string, any>) => unknown) => Promise<boolean>
}
