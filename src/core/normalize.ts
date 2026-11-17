import type { FieldDef, FieldInput, FieldNode, FormoDefinition, RuleSpec } from '../types'
import { humanize, isPlainObject } from './utils'

const INPUT_TYPES = new Set(['text', 'email', 'password', 'number', 'tel', 'url', 'search'])

function toFieldDef(input: FieldInput): FieldDef {
  if (typeof input === 'string') return { alias: input }
  if (Array.isArray(input)) {
    const [alias, driver, val, opts] = input
    return { ...(opts ?? {}), alias, ...(driver ? { driver } : {}), ...(input.length >= 3 ? { val } : {}) }
  }
  return input
}

function normalizeOptions(raw: FieldDef['opts'] | FieldDef['options']): Array<{ label: string; value: unknown }> {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return Object.entries(raw).map(([value, label]) => ({ label: String(label), value }))
}

function normalizeRules(rules: FieldDef['rules'], required?: boolean): RuleSpec[] {
  const list: RuleSpec[] = []
  if (required) list.push('required')
  if (!rules) return list
  if (typeof rules === 'string') {
    for (const part of rules.split('|').filter(Boolean)) list.push(part)
  } else if (Array.isArray(rules)) {
    if (typeof rules[0] === 'string' && (rules.length === 1 || Array.isArray(rules[1]))) {
      list.push(rules as RuleSpec)
    } else {
      for (const item of rules) {
        if (item !== undefined) list.push(item as RuleSpec)
      }
    }
  } else {
    list.push(rules)
  }
  return list
}

function normalizeNode(def: FieldDef, fallbackDriver = 'input'): FieldNode {
  let driver = typeof def.driver === 'string' && def.driver ? def.driver : ''
  let type = def.type

  if (driver.includes('|')) {
    ;[driver, type] = driver.split('|')
  }
  if (driver === 'bool') driver = 'checkbox'
  if (driver && INPUT_TYPES.has(driver)) {
    type = driver
    driver = 'input'
  }
  const hasFields = Array.isArray(def.fields) ? def.fields.length > 0 : isPlainObject(def.fields) && Object.keys(def.fields).length > 0
  if (!driver) {
    driver = hasFields ? 'group' : fallbackDriver
  }

  const children: FieldNode[] = []
  if (Array.isArray(def.fields)) {
    for (const child of def.fields) children.push(normalizeNode(toFieldDef(child)))
  } else if (isPlainObject(def.fields)) {
    for (const [alias, child] of Object.entries(def.fields)) {
      const childDef = typeof child === 'string' ? { alias, driver: child } : { alias, ...child }
      children.push(normalizeNode(childDef))
    }
  }

  const alias = def.alias ?? 'formo'
  return {
    alias,
    driver,
    type,
    val: def.val ?? def.value,
    label: def.label ?? humanize(alias),
    placeholder: def.placeholder ?? def.attr?.placeholder,
    message: def.message,
    required: Boolean(def.required),
    editable: def.editable !== false,
    disabled: Boolean(def.disabled),
    render: def.render !== false,
    rules: normalizeRules(def.rules, def.required),
    options: normalizeOptions(def.opts ?? def.options),
    fields: children,
    component: def.component,
    attr: { ...(def.attr ?? {}) },
    raw: def,
  }
}

export function normalize(input: FormoDefinition): FieldNode {
  const def = typeof (input as any)?.toSchema === 'function' ? (input as any).toSchema() : (input as FieldDef)
  return normalizeNode(def, 'form')
}

export function buildInitialValues(node: FieldNode): Record<string, any> {
  const out: Record<string, any> = {}
  for (const child of node.fields) {
    if (child.driver === 'group' || child.fields.length > 0) {
      out[String(child.alias)] = buildInitialValues(child)
    } else if (child.val !== undefined) {
      out[String(child.alias)] = child.val
    } else if (child.driver === 'checkbox' || child.driver === 'switch') {
      out[String(child.alias)] = false
    } else {
      out[String(child.alias)] = ''
    }
  }
  return out
}
