import { describe, expect, it } from 'vitest'
import { Formo, formFromModel, fromJsonSchema, fromLaravel } from '../src/index'

describe('formo-react-native/schema', () => {
  it('converts Laravel rules into a Formo builder', () => {
    const model = fromLaravel({
      rules: {
        email: 'required|email|max:255',
        age: 'integer|min:18',
        terms: 'accepted',
      },
    })

    const form = Formo.fromModel(model, { only: ['email', 'terms'] }).toSchema()
    expect(form.fields).toHaveLength(2)
  })

  it('projects a JSON Schema into a form definition', () => {
    const model = fromJsonSchema({
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', minLength: 3 },
        published: { type: 'boolean' },
      },
    })

    const def = formFromModel(model)
    expect(Object.keys(def.fields ?? {})).toEqual(['title', 'published'])
  })
})
