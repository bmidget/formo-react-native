import React from 'react'
import { TextInput, StyleSheet, type TextInputProps } from 'react-native'
import type { FormoFieldHandle } from '../types'

export interface FormoInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  field: FormoFieldHandle
}

export function FormoInput({ field, style, ...rest }: FormoInputProps) {
  const { node } = field
  return (
    <TextInput
      value={field.value == null ? '' : String(field.value)}
      onChangeText={(text) => field.setValue(text)}
      onBlur={() => field.setBlur()}
      editable={field.editable && !field.disabled}
      placeholder={node.placeholder}
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
      style={[styles.input, field.invalid && styles.invalid, style]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  invalid: {
    borderColor: '#dc2626',
  },
})
