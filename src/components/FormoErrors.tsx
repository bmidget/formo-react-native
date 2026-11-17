import React from 'react'
import { Text, StyleSheet } from 'react-native'
import type { FormoFieldHandle } from '../types'
import { useFormoColorScheme } from './FormoContext'

export function FormoErrors({ field }: { field: FormoFieldHandle }) {
  const dark = useFormoColorScheme() === 'dark'
  if (!field.error) return null
  return <Text style={[styles.error, dark && styles.errorDark]}>{field.error}</Text>
}

const styles = StyleSheet.create({
  error: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 4,
  },
  errorDark: {
    color: '#f87171',
  },
})
