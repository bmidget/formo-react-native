import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Formo, FormoForm, fromLaravel, useFormo } from 'formo-react-native'
import { StateInspector } from '../components/StateInspector'

export default function FromModelExample({ colorScheme = 'light' }: { colorScheme?: 'light' | 'dark' }) {
  const dark = colorScheme === 'dark'
  const definition = useMemo(() => {
    const model = fromLaravel({
      rules: {
        title: 'required|min:3|max:80',
        email: 'required|email',
        age: 'integer|min:18',
        terms: 'accepted',
      },
      attributes: {
        terms: 'Accept terms & conditions',
      },
    })
    return Formo.fromModel(model).add('submit', 'button', { label: 'Submit model form', attr: { type: 'submit' } })
  }, [])

  const form = useFormo(definition, {
    onSubmit: (values) => ({ ok: true, values }),
  })

  return (
    <View style={[styles.card, dark && styles.cardDark]}>
      <Text style={[styles.cardTitle, dark && styles.textDark]}>From Laravel Rules (IR v1)</Text>
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
