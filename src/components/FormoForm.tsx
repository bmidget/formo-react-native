import React from 'react'
import { useColorScheme, View, type ViewProps } from 'react-native'
import type { FormoController, FormoDefinition } from '../types'
import { useFormo, type UseFormoOptions } from '../hooks/useFormo'
import { FormoColorSchemeContext, FormoContext } from './FormoContext'
import { FormoField } from './FormoField'

export interface FormoFormProps extends ViewProps {
  form: FormoDefinition | FormoController
  options?: UseFormoOptions
  colorScheme?: 'light' | 'dark'
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

export function FormoForm({ form, options, colorScheme, children, ...rest }: FormoFormProps) {
  const systemScheme = useColorScheme()
  const scheme = colorScheme ?? (systemScheme === 'dark' ? 'dark' : 'light')

  if (!isController(form)) {
    return (
      <FormoColorSchemeContext.Provider value={scheme}>
        <FormoFormWithDef definition={form} options={options} {...rest}>
          {children}
        </FormoFormWithDef>
      </FormoColorSchemeContext.Provider>
    )
  }

  return (
    <FormoColorSchemeContext.Provider value={scheme}>
      <FormoContext.Provider value={form}>
        <View {...rest}>
          {children ?? Object.values(form.fields).map((field) => <FormoField key={field.path} field={field} />)}
        </View>
      </FormoContext.Provider>
    </FormoColorSchemeContext.Provider>
  )
}
