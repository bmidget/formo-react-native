import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { FormoController } from 'formo-react-native'

export function StateInspector({ form, dark = false }: { form: FormoController; dark?: boolean }) {
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

const styles = StyleSheet.create({
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
})
