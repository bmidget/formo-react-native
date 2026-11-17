import React from 'react'
import { Switch, type SwitchProps } from 'react-native'
import type { FormoFieldHandle } from '../types'

export interface FormoSwitchProps extends Omit<SwitchProps, 'value' | 'onValueChange'> {
  field: FormoFieldHandle
}

export function FormoSwitch({ field, ...rest }: FormoSwitchProps) {
  return (
    <Switch
      value={Boolean(field.value)}
      onValueChange={(next) => field.setValue(next)}
      disabled={!field.editable || field.disabled}
      {...rest}
    />
  )
}
