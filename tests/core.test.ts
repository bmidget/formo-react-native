import { describe, expect, it } from 'vitest'
import { Formo } from '../src/core/builder'
import { buildInitialValues, normalize } from '../src/core/normalize'
import { validateField } from '../src/core/rules'

describe('Formo core (React Native port)', () => {
  it('builds a form with fluent .add() and nested groups', () => {
    const form = Formo.form('user')
      .add('email', 'input|email', { required: true })
      .add('newsletter', 'switch', true)
      .add('address', Formo.group().add('street', { required: true }))

    const node = normalize(form)
    expect(node.alias).toBe('user')
    expect(node.fields.map((f) => f.alias)).toEqual(['email', 'newsletter', 'address'])
    expect(node.fields[0].driver).toBe('input')
    expect(node.fields[0].type).toBe('email')
    expect(node.fields[2].driver).toBe('group')

    const initial = buildInitialValues(node)
    expect(initial).toEqual({
      email: '',
      newsletter: true,
      address: { street: '' },
    })
  })

  it('supports recursive object fields syntax', () => {
    const node = normalize({
      alias: 'profile',
      fields: {
        name: { required: true },
        bio: 'textarea',
        links: {
          fields: {
            website: 'input|url',
          },
        },
      },
    })

    expect(node.fields.map((f) => f.alias)).toEqual(['name', 'bio', 'links'])
    expect(node.fields[2].driver).toBe('group')
    expect(node.fields[2].fields[0].type).toBe('url')
  })

  it('validates built-in rules', async () => {
    const node = normalize({
      fields: {
        email: { driver: 'email', required: true, rules: 'email' },
        age: { driver: 'number', rules: 'numeric|min_value:18' },
      },
    })

    const emailNode = node.fields[0]
    const ageNode = node.fields[1]

    expect(await validateField(emailNode, '', {}, 'email')).toContain('required')
    expect(await validateField(emailNode, 'bad', {}, 'email')).toContain('valid email')
    expect(await validateField(emailNode, 'a@b.com', {}, 'email')).toBeUndefined()

    expect(await validateField(ageNode, '15', {}, 'age')).toContain('at least 18')
    expect(await validateField(ageNode, '21', {}, 'age')).toBeUndefined()
  })
})
