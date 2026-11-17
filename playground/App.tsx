import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import BuilderExample from './examples/BuilderExample'
import FromModelExample from './examples/FromModelExample'
import CustomLayoutExample from './examples/CustomLayoutExample'

type Scheme = 'light' | 'dark'

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
    <ScrollView style={[styles.viewport, dark && styles.viewportDark]} contentContainerStyle={styles.page}>
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

      {tab === 'builder' ? <BuilderExample colorScheme={scheme} /> : null}
      {tab === 'model' ? <FromModelExample colorScheme={scheme} /> : null}
      {tab === 'custom' ? <CustomLayoutExample colorScheme={scheme} /> : null}
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
  textDark: {
    color: '#f9fafb',
  },
  mutedDark: {
    color: '#9ca3af',
  },
})
