import React from 'react'
import { Text, StyleSheet } from 'react-native'
import type { FormoFieldHandle } from '../types'

export function FormoErrors({ field }: { field: FormoFieldHandle }) {
  if (!field.error) return null
  return <Text style={styles.error}>{field.error}</Text>
}

const styles = StyleSheet.create({
  error: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 4,
  },
})
