import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import type { FormoFieldHandle } from '../types'
import { useFormoColorScheme, useFormoContext } from './FormoContext'

export interface FormoButtonProps {
  field: FormoFieldHandle
  onPress?: () => void
}

export function FormoButton({ field, onPress }: FormoButtonProps) {
  const form = useFormoContext()
  const dark = useFormoColorScheme() === 'dark'
  const isSubmit = field.node.attr?.type === 'submit' || field.node.driver === 'submit'

  return (
    <Pressable
      onPress={() => {
        if (onPress) onPress()
        else if (isSubmit) void form.submit()
      }}
      disabled={field.disabled || form.submitting}
      style={({ pressed }) => [
        styles.button,
        dark && styles.buttonDark,
        (pressed || form.submitting) && styles.pressed,
      ]}
    >
      <Text style={[styles.label, dark && styles.labelDark]}>{field.node.label ?? String(field.node.alias)}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#111827',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: '#f9fafb',
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  labelDark: {
    color: '#111827',
  },
})
