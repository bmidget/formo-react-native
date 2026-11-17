import type { FieldNode, RuleSpec } from '../types'
import { isEmptyValue } from './utils'

function parseRuleItem(spec: RuleSpec): { name: string; params: unknown[]; fn?: Function } {
  if (typeof spec === 'function') return { name: spec.name || 'custom', params: [], fn: spec }
  if (Array.isArray(spec)) return { name: String(spec[0]), params: spec[1] ?? [] }
  if (typeof spec === 'string') {
    const [name, raw] = spec.split(':')
    const params = raw !== undefined ? raw.split(',') : []
    return { name, params }
  }
  return { name: 'object', params: [spec] }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function validateField(
  node: FieldNode,
  value: unknown,
  values: Record<string, any>,
  path: string,
): Promise<string | undefined> {
  if (!node.editable) return undefined

  for (const spec of node.rules) {
    const { name, params, fn } = parseRuleItem(spec)
    if (fn) {
      const res = await fn(value, params, { values, path })
      if (res === false) return `${node.label ?? node.alias} is invalid`
      if (typeof res === 'string') return res
      continue
    }

    if (name === 'required' || name === 'not_empty') {
      if (isEmptyValue(value)) return `${node.label ?? node.alias} is required`
    } else if (name === 'accepted') {
      if (value !== true && value !== 1 && value !== '1' && value !== 'on' && value !== 'yes') {
        return `${node.label ?? node.alias} must be accepted`
      }
    } else if (!isEmptyValue(value)) {
      if (name === 'email' && !EMAIL_RE.test(String(value))) {
        return `${node.label ?? node.alias} must be a valid email`
      } else if ((name === 'min' || name === 'min_length') && String(value).length < Number(params[0] ?? params[1])) {
        return `${node.label ?? node.alias} must be at least ${params[0] ?? params[1]} characters`
      } else if ((name === 'max' || name === 'max_length') && String(value).length > Number(params[0] ?? params[1])) {
        return `${node.label ?? node.alias} must be at most ${params[0] ?? params[1]} characters`
      } else if (name === 'numeric' && Number.isNaN(Number(value))) {
        return `${node.label ?? node.alias} must be a number`
      } else if (name === 'min_value' && Number(value) < Number(params[0])) {
        return `${node.label ?? node.alias} must be at least ${params[0]}`
      } else if (name === 'max_value' && Number(value) > Number(params[0])) {
        return `${node.label ?? node.alias} must be at most ${params[0]}`
      }
    }
  }

  return undefined
}
