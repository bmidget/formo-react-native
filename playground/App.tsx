import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import {
  Formo,
  FormoButton,
  FormoErrors,
  FormoField,
  FormoForm,
  FormoInput,
  fromLaravel,
  useFormo,
} from 'formo-react-native'

function BuilderExample() {
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
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Builder + Validation + Outcomes</Text>
      <FormoForm form={form} />
      <StateInspector form={form} />
    </View>
  )
}

function LaravelModelExample() {
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
    <View style={styles.card}>
      <Text style={styles.cardTitle}>From Laravel Rules (IR v1)</Text>
      <FormoForm form={form} />
      <StateInspector form={form} />
    </View>
  )
}

function CustomLayoutExample() {
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
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Custom Field Layout</Text>
      <FormoForm form={form}>
        <View style={styles.row}>
          <View style={styles.rowLabel}>
            <Text style={styles.inlineLabel}>Email *</Text>
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
      <StateInspector form={form} />
    </View>
  )
}

function StateInspector({ form }: { form: ReturnType<typeof useFormo> }) {
  return (
    <View style={styles.debug}>
      <Text style={styles.debugTitle}>Live State</Text>
      <Text style={styles.debugText}>dirty: {String(form.dirty)}</Text>
      <Text style={styles.debugText}>values: {JSON.stringify(form.values)}</Text>
      <Text style={styles.debugText}>errors: {JSON.stringify(form.errors)}</Text>
      <Text style={styles.debugText}>outcome: {JSON.stringify(form.outcome)}</Text>
    </View>
  )
}

export default function App() {
  const [tab, setTab] = useState<'builder' | 'model' | 'custom'>('builder')

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>formo-react-native Playground</Text>
      <Text style={styles.subheading}>Rendered via react-native-web in Vite (same primitives as React Native)</Text>

      <View style={styles.tabs}>
        {(
          [
            ['builder', 'Builder'],
            ['model', 'From Model'],
            ['custom', 'Custom Layout'],
          ] as const
        ).map(([id, label]) => (
          <Pressable key={id} onPress={() => setTab(id)} style={[styles.tab, tab === id && styles.tabActive]}>
            <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'builder' ? <BuilderExample /> : null}
      {tab === 'model' ? <LaravelModelExample /> : null}
      {tab === 'custom' ? <CustomLayoutExample /> : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  page: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subheading: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  tabActive: {
    backgroundColor: '#111827',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  debug: {
    marginTop: 18,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1f2937',
  },
})
