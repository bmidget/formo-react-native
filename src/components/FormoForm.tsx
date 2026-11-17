import React from 'react'
import { View, type ViewProps } from 'react-native'
import type { FormoController, FormoDefinition } from '../types'
import { useFormo, type UseFormoOptions } from '../hooks/useFormo'
import { FormoContext } from './FormoContext'
import { FormoField } from './FormoField'

export interface FormoFormProps extends ViewProps {
  form: FormoDefinition | FormoController
  options?: UseFormoOptions
  children?: React.ReactNode
}

function isController(value: FormoDefinition | FormoController): value is FormoController {
  return typeof (value as FormoController)?.validate === 'function' && typeof (value as FormoController)?.submit === 'function'
}

function FormoFormWithDef({
  definition,
  options,
  children,
  ...rest
}: {
  definition: FormoDefinition
  options?: UseFormoOptions
  children?: React.ReactNode
} & ViewProps) {
  const controller = useFormo(definition, options)
  return (
    <FormoContext.Provider value={controller}>
      <View {...rest}>
        {children ??
          Object.values(controller.fields).map((field) => <FormoField key={field.path} field={field} />)}
      </View>
    </FormoContext.Provider>
  )
}

export function FormoForm({ form, options, children, ...rest }: FormoFormProps) {
  if (!isController(form)) {
    return (
      <FormoFormWithDef definition={form} options={options} {...rest}>
        {children}
      </FormoFormWithDef>
    )
  }

  return (
    <FormoContext.Provider value={form}>
      <View {...rest}>
        {children ?? Object.values(form.fields).map((field) => <FormoField key={field.path} field={field} />)}
      </View>
    </FormoContext.Provider>
  )
}
