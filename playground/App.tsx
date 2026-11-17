import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
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

type Scheme = 'light' | 'dark'

function BuilderExample({ scheme }: { scheme: Scheme }) {
  const dark = scheme === 'dark'
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
      <FormoForm form={form} colorScheme={scheme} />
      <StateInspector form={form} dark={dark} />
    </View>
  )
}

function LaravelModelExample({ scheme }: { scheme: Scheme }) {
  const dark = scheme === 'dark'
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
      <FormoForm form={form} colorScheme={scheme} />
      <StateInspector form={form} dark={dark} />
    </View>
  )
}

function CustomLayoutExample({ scheme }: { scheme: Scheme }) {
  const dark = scheme === 'dark'
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
      <FormoForm form={form} colorScheme={scheme}>
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

function StateInspector({ form, dark }: { form: ReturnType<typeof useFormo>; dark: boolean }) {
  return (
    <View style={[styles.debug, dark && styles.debugDark]}>
      <Text style={[styles.debugTitle, dark && styles.textDark]}>Live State</Text>
      <Text style={[styles.debugText, dark && styles.debugTextDark]}>dirty: {String(form.dirty)}</Text>
      <Text style={[styles.debugText, dark && styles.debugTextDark]}>values: {JSON.stringify(form.values)}</Text>
      <Text style={[styles.debugText, dark && styles.debugTextDark]}>errors: {JSON.stringify(form.errors)}</Text>
      <Text style={[styles.debugText, dark && styles.debugTextDark]}>outcome: {JSON.stringify(form.outcome)}</Text>
    </View>
  )
}

export default function App() {
  const systemScheme = useColorScheme()
  const [override, setOverride] = useState<Scheme | null>(null)
  const scheme: Scheme = override ?? (systemScheme === 'dark' ? 'dark' : 'light')
  const dark = scheme === 'dark'
  const [tab, setTab] = useState<'builder' | 'model' | 'custom'>('builder')

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = dark ? '#0b0f19' : '#f9fafb'
      document.documentElement.style.colorScheme = scheme
    }
  }, [dark, scheme])

  return (
    <ScrollView
      style={[styles.viewport, dark && styles.viewportDark]}
      contentContainerStyle={styles.page}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.heading, dark && styles.textDark]}>formo-react-native Playground</Text>
          <Text style={[styles.subheading, dark && styles.mutedDark]}>
            Rendered via react-native-web in Vite (same primitives as React Native)
          </Text>
        </View>
        <Pressable
          onPress={() => setOverride(dark ? 'light' : 'dark')}
          style={[styles.themeBtn, dark && styles.themeBtnDark]}
        >
          <Text style={[styles.themeBtnText, dark && styles.textDark]}>
            {dark ? 'Light mode' : 'Dark mode'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {(
          [
            ['builder', 'Builder'],
            ['model', 'From Model'],
            ['custom', 'Custom Layout'],
          ] as const
        ).map(([id, label]) => {
          const active = tab === id
          return (
            <Pressable
              key={id}
              onPress={() => setTab(id)}
              style={[
                styles.tab,
                dark && styles.tabDark,
                active && (dark ? styles.tabActiveDark : styles.tabActive),
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  dark && styles.tabTextDark,
                  active && (dark ? styles.tabTextActiveDark : styles.tabTextActive),
                ]}
              >
                {label}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {tab === 'builder' ? <BuilderExample scheme={scheme} /> : null}
      {tab === 'model' ? <LaravelModelExample scheme={scheme} /> : null}
      {tab === 'custom' ? <CustomLayoutExample scheme={scheme} /> : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  viewportDark: {
    backgroundColor: '#0b0f19',
  },
  page: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
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
  },
  themeBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  themeBtnDark: {
    borderColor: '#374151',
    backgroundColor: '#1f2937',
  },
  themeBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
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
  tabDark: {
    backgroundColor: '#1f2937',
  },
  tabActive: {
    backgroundColor: '#111827',
  },
  tabActiveDark: {
    backgroundColor: '#f9fafb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tabTextDark: {
    color: '#d1d5db',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabTextActiveDark: {
    color: '#111827',
  },
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
  debug: {
    marginTop: 18,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  debugDark: {
    backgroundColor: '#1f2937',
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
  debugTextDark: {
    color: '#d1d5db',
  },
  textDark: {
    color: '#f9fafb',
  },
  mutedDark: {
    color: '#9ca3af',
  },
})
