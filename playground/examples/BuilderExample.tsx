import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Formo, FormoForm, useFormo } from 'formo-react-native'
import { StateInspector } from '../components/StateInspector'

export default function BuilderExample({ colorScheme = 'light' }: { colorScheme?: 'light' | 'dark' }) {
  const dark = colorScheme === 'dark'
  const definition = useMemo(
    () =>
      Formo.form('signup')
        .add('name', 'text', { required: true, placeholder: 'Ada Lovelace' })
        .add('email', 'input|email', { required: true, rules: 'email', placeholder: 'ada@example.com' })
        .add('password', 'input|password', { required: true, rules: 'min:8' })
        .add('newsletter', 'switch', true, { label: 'Send product updates' })
        .add('save', 'button', { label: 'Create account', attr: { type: 'submit' } }),
    [],
  )

  const form = useFormo(definition, {
    onSubmit: async (values) => {
      await new Promise((r) => setTimeout(r, 250))
      return { saved: values }
    },
  })

  return (
    <View style={[styles.card, dark && styles.cardDark]}>
      <Text style={[styles.cardTitle, dark && styles.textDark]}>Builder + Validation + Outcomes</Text>
      <FormoForm form={form} colorScheme={colorScheme} />
      <StateInspector form={form} dark={dark} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardDark: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  textDark: {
    color: '#f9fafb',
  },
})
