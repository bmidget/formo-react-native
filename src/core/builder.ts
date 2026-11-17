import type { FieldDef, FieldInput } from '../types'
import { formFromModel, type FormFromModelOptions } from '../schema/form'
import type { FormoModel } from '../schema/ir'
import { cleanAlias, isPlainObject } from './utils'

/**
 * Minimal React Native port of Formo's fluent form builder.
 * Pure TypeScript — no React or React Native imports.
 */
export class Formo {
  #def: FieldDef
  #fields: Formo[] = []

  static form(def: FieldDef | string = {}): Formo {
    const d = typeof def === 'string' ? { alias: def } : def
    return new Formo({ alias: 'formo', driver: 'form', ...d })
  }

  static group(alias?: string | FieldDef, def: FieldDef = {}): Formo {
    const d = isPlainObject(alias) ? alias : { ...def, alias }
    return new Formo({ driver: 'group', ...d })
  }

  static fromModel(model: FormoModel, options: FormFromModelOptions = {}): Formo {
    return new Formo(formFromModel(model, options) as FieldDef)
  }

  constructor(def: FieldDef | string = {}) {
    const d = typeof def === 'string' ? { alias: def } : { ...def }
    const fields = d.fields
    delete d.fields
    if (d.alias !== undefined) d.alias = cleanAlias(d.alias)
    this.#def = d

    if (Array.isArray(fields)) {
      for (const f of fields) this.#fields.push(Formo.#toFormo(f))
    } else if (isPlainObject(fields)) {
      for (const [alias, f] of Object.entries(fields)) {
        const childDef = typeof f === 'string' ? { alias, driver: f } : { alias, ...f }
        this.#fields.push(new Formo(childDef))
      }
    }
  }

  static #toFormo(input: FieldInput | Formo): Formo {
    if (input instanceof Formo) return input
    if (typeof input === 'string') return new Formo({ alias: input })
    if (Array.isArray(input)) {
      const [alias, driver, val, opts] = input
      return new Formo({ ...(opts ?? {}), alias, ...(driver ? { driver } : {}), ...(input.length >= 3 ? { val } : {}) })
    }
    return new Formo(input as FieldDef)
  }

  alias(): string | number | undefined {
    return this.#def.alias
  }

  add(aliasOrField: string | FieldDef | Formo, driver?: string | FieldDef | Formo, valOrOpts?: unknown, opts?: FieldDef): this {
    let field: Formo
    if (aliasOrField instanceof Formo) {
      field = aliasOrField
    } else if (driver instanceof Formo) {
      field = driver
      if (field.alias() === undefined && typeof aliasOrField === 'string') field.set('alias', cleanAlias(aliasOrField))
    } else if (isPlainObject(aliasOrField)) {
      field = new Formo(aliasOrField)
    } else if (isPlainObject(driver)) {
      field = new Formo({ ...driver, alias: aliasOrField })
    } else {
      const def: FieldDef = { ...(opts ?? {}), alias: aliasOrField }
      if (typeof driver === 'string') def.driver = driver
      if (isPlainObject(valOrOpts)) Object.assign(def, valOrOpts)
      else if (valOrOpts !== undefined) def.val = valOrOpts
      field = new Formo(def)
    }
    this.#fields.push(field)
    return this
  }

  find(alias: string): Formo | undefined {
    for (const child of this.#fields) {
      if (String(child.alias()) === alias) return child
      const nested = child.find(alias)
      if (nested) return nested
    }
    return undefined
  }

  remove(alias: string): this {
    this.#fields = this.#fields.filter((f) => String(f.alias()) !== alias)
    return this
  }

  set(key: string, value: unknown): this {
    this.#def[key] = value
    return this
  }

  toSchema(): FieldDef {
    return {
      ...this.#def,
      ...(this.#fields.length > 0 ? { fields: this.#fields.map((f) => f.toSchema()) } : {}),
    }
  }
}
