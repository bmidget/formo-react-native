import React from 'react'
import { TextInput, StyleSheet, type TextInputProps } from 'react-native'
import type { FormoFieldHandle } from '../types'
import { useFormoColorScheme } from './FormoContext'

export interface FormoInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  field: FormoFieldHandle
}

export function FormoInput({ field, style, placeholderTextColor, ...rest }: FormoInputProps) {
  const { node } = field
  const dark = useFormoColorScheme() === 'dark'

  return (
    <TextInput
      value={field.value == null ? '' : String(field.value)}
      onChangeText={(text) => field.setValue(text)}
      onBlur={() => field.setBlur()}
      editable={field.editable && !field.disabled}
      placeholder={node.placeholder}
      placeholderTextColor={placeholderTextColor ?? (dark ? '#6b7280' : '#9ca3af')}
      secureTextEntry={node.type === 'password'}
      keyboardType={
        node.type === 'email'
          ? 'email-address'
          : node.type === 'number'
            ? 'numeric'
            : node.type === 'tel'
              ? 'phone-pad'
              : node.type === 'url'
                ? 'url'
                : 'default'
      }
      multiline={node.driver === 'textarea'}
      style={[styles.input, dark && styles.inputDark, field.invalid && styles.invalid, style]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    color: '#111827',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  inputDark: {
    borderColor: '#374151',
    backgroundColor: '#111827',
    color: '#f9fafb',
  },
  invalid: {
    borderColor: '#ef4444',
  },
})
