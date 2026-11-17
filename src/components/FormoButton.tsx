import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import type { FormoFieldHandle } from '../types'
import { useFormoContext } from './FormoContext'

export interface FormoButtonProps {
  field: FormoFieldHandle
  onPress?: () => void
}

export function FormoButton({ field, onPress }: FormoButtonProps) {
  const form = useFormoContext()
  const isSubmit = field.node.attr?.type === 'submit' || field.node.driver === 'submit'

  return (
    <Pressable
      onPress={() => {
        if (onPress) onPress()
        else if (isSubmit) void form.submit()
      }}
      disabled={field.disabled || form.submitting}
      style={({ pressed }) => [styles.button, (pressed || form.submitting) && styles.pressed]}
    >
      <Text style={styles.label}>{field.node.label ?? String(field.node.alias)}</Text>
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
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})
