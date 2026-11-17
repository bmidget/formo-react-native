import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { FormoFieldHandle } from '../types'
import { FormoButton } from './FormoButton'
import { useFormoColorScheme } from './FormoContext'
import { FormoErrors } from './FormoErrors'
import { FormoInput } from './FormoInput'
import { FormoSwitch } from './FormoSwitch'

export interface FormoFieldProps {
  field: FormoFieldHandle
  children?: (field: FormoFieldHandle) => React.ReactNode
}

function DefaultControl({ field }: { field: FormoFieldHandle }) {
  const { node } = field
  if (node.component) {
    const Custom = node.component
    return <Custom field={field} />
  }
  if (node.driver === 'button' || node.driver === 'submit') return <FormoButton field={field} />
  if (node.driver === 'checkbox' || node.driver === 'switch') return <FormoSwitch field={field} />
  return <FormoInput field={field} />
}

export function FormoField({ field, children }: FormoFieldProps) {
  if (!field.node.render) return null
  if (children) return <>{children(field)}</>

  const { node } = field
  const isButton = node.driver === 'button' || node.driver === 'submit'
  const dark = useFormoColorScheme() === 'dark'

  return (
    <View style={styles.field}>
      {!isButton && node.label ? (
        <Text style={[styles.label, dark && styles.labelDark]}>
          {node.label}
          {field.required ? ' *' : ''}
        </Text>
      ) : null}
      <DefaultControl field={field} />
      {node.message ? <Text style={[styles.help, dark && styles.helpDark]}>{node.message}</Text> : null}
      <FormoErrors field={field} />
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#111827',
  },
  labelDark: {
    color: '#e5e7eb',
  },
  help: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  helpDark: {
    color: '#9ca3af',
  },
})
