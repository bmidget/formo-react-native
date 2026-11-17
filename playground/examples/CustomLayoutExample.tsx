import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FormoButton, FormoErrors, FormoField, FormoForm, FormoInput, useFormo } from 'formo-react-native'
import { StateInspector } from '../components/StateInspector'

export default function CustomLayoutExample({ colorScheme = 'light' }: { colorScheme?: 'light' | 'dark' }) {
  const dark = colorScheme === 'dark'
  const form = useFormo(
    {
      alias: 'custom',
      fields: {
        email: { driver: 'email', required: true, rules: 'email', placeholder: 'you@example.com' },
        note: { driver: 'textarea', placeholder: 'Optional note...' },
        send: { driver: 'button', label: 'Send', attr: { type: 'submit' } },
      },
    },
    {
      onSubmit: (values) => ({ sent: values }),
    },
  )

  return (
    <View style={[styles.card, dark && styles.cardDark]}>
      <Text style={[styles.cardTitle, dark && styles.textDark]}>Custom Field Layout</Text>
      <FormoForm form={form} colorScheme={colorScheme}>
        <View style={styles.row}>
          <View style={styles.rowLabel}>
            <Text style={[styles.inlineLabel, dark && styles.textDark]}>Email *</Text>
          </View>
          <View style={styles.rowControl}>
            <FormoField field={form.fields.email}>
              {(field) => (
                <>
                  <FormoInput field={field} />
                  <FormoErrors field={field} />
                </>
              )}
            </FormoField>
          </View>
        </View>
        <FormoField field={form.fields.note} />
        <FormoButton field={form.fields.send} />
      </FormoForm>
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  rowLabel: {
    width: 90,
    paddingTop: 10,
  },
  inlineLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  rowControl: {
    flex: 1,
  },
  textDark: {
    color: '#f9fafb',
  },
})
