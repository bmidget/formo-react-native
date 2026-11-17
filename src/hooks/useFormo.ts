import { useCallback, useMemo, useRef, useState } from 'react'
import type {
  FieldNode,
  FormoController,
  FormoDefinition,
  FormoFieldHandle,
  FormoOutcome,
} from '../types'
import { buildInitialValues, normalize } from '../core/normalize'
import { validateField } from '../core/rules'
import { deepClone, deepEqual, getPath, setPath } from '../core/utils'

export interface UseFormoOptions {
  initialValues?: Record<string, any>
  onSubmit?: (values: Record<string, any>) => unknown
  onSuccess?: (data: unknown, outcome: FormoOutcome) => void
  onInvalid?: (errors: Record<string, string>, outcome: FormoOutcome) => void
  onRejected?: (outcome: FormoOutcome) => void
  onSettled?: (outcome: FormoOutcome) => void
}

function collectLeafNodes(node: FieldNode, prefix = '', out: Array<{ path: string; node: FieldNode }> = []) {
  for (const child of node.fields) {
    const path = prefix ? `${prefix}.${child.alias}` : String(child.alias)
    if (child.driver === 'group' || child.fields.length > 0) {
      collectLeafNodes(child, path, out)
    } else {
      out.push({ path, node: child })
    }
  }
  return out
}

/**
 * Rough React/React Native runtime hook for Formo.
 * Manages values, validation, outcome events, and field handles.
 */
export function useFormo(definition: FormoDefinition, options: UseFormoOptions = {}): FormoController {
  const root = useMemo(() => normalize(definition), [definition])
  const baseline = useMemo(
    () => ({ ...buildInitialValues(root), ...deepClone(options.initialValues ?? {}) }),
    [root, options.initialValues],
  )

  const [values, setValues] = useState<Record<string, any>>(() => deepClone(baseline))
  const [errors, setErrorsState] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [outcome, setOutcome] = useState<FormoOutcome | null>(null)
  const submitLock = useRef<Promise<boolean> | null>(null)

  const leaves = useMemo(() => collectLeafNodes(root), [root])

  const val = useCallback(
    (path: string, nextValue?: unknown) => {
      if (arguments.length === 1) return getPath(values, path)
      setValues((prev) => {
        const copy = deepClone(prev)
        setPath(copy, path, nextValue)
        return copy
      })
      return nextValue
    },
    [values],
  )

  const load = useCallback((next: Record<string, any>) => {
    setValues((prev) => ({ ...prev, ...deepClone(next) }))
  }, [])

  const reset = useCallback(
    (next?: Record<string, any>) => {
      setValues(deepClone(next ?? baseline))
      setErrorsState({})
      setTouched({})
    },
    [baseline],
  )

  const setErrors = useCallback((next: Record<string, string | string[]>) => {
    const flat: Record<string, string> = {}
    for (const [k, v] of Object.entries(next)) {
      const msg = Array.isArray(v) ? v[0] : v
      if (msg) flat[k] = msg
    }
    setErrorsState(flat)
  }, [])

  const validate = useCallback(async () => {
    const nextErrors: Record<string, string> = {}
    for (const { path, node } of leaves) {
      const msg = await validateField(node, getPath(values, path), values, path)
      if (msg) nextErrors[path] = msg
    }
    setErrorsState(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [leaves, values])

  const submit = useCallback(
    async (handler?: (vals: Record<string, any>) => unknown): Promise<boolean> => {
      if (submitLock.current) return submitLock.current

      const run = (async () => {
        setSubmitting(true)
        try {
          const valid = await validate()
          if (!valid) {
            const inv: FormoOutcome = { result: 'invalid', errors }
            setOutcome(inv)
            options.onInvalid?.(errors, inv)
            options.onSettled?.(inv)
            return false
          }

          const fn = handler ?? options.onSubmit
          const data = fn ? await fn(deepClone(values)) : undefined
          if (data === false) {
            const rej: FormoOutcome = { result: 'rejected', reason: 'handler' }
            setOutcome(rej)
            options.onRejected?.(rej)
            options.onSettled?.(rej)
            return false
          }

          const ok: FormoOutcome = { result: 'success', data }
          setOutcome(ok)
          options.onSuccess?.(data, ok)
          options.onSettled?.(ok)
          return true
        } catch (err) {
          const rej: FormoOutcome = { result: 'rejected', reason: 'error', error: err }
          setOutcome(rej)
          options.onRejected?.(rej)
          options.onSettled?.(rej)
          return false
        } finally {
          setSubmitting(false)
          submitLock.current = null
        }
      })()

      submitLock.current = run
      return run
    },
    [validate, errors, options, values],
  )

  const fields = useMemo(() => {
    const map: Record<string, FormoFieldHandle> = {}
    for (const { path, node } of leaves) {
      const error = errors[path]
      map[path] = {
        path,
        node,
        value: getPath(values, path),
        error,
        invalid: Boolean(error),
        touched: Boolean(touched[path]),
        required: node.required,
        editable: node.editable,
        disabled: node.disabled,
        setValue: (v) => val(path, v),
        setBlur: () => setTouched((prev) => ({ ...prev, [path]: true })),
      }
    }
    return map
  }, [leaves, errors, touched, values, val])

  return {
    root,
    values,
    errors,
    touched,
    dirty: !deepEqual(values, baseline),
    submitting,
    outcome,
    fields,
    val,
    load,
    reset,
    setErrors,
    validate,
    submit,
  }
}
