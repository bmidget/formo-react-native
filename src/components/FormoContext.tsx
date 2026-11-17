import { createContext, useContext } from 'react'
import type { FormoController } from '../types'

export const FormoContext = createContext<FormoController | null>(null)

export function useFormoContext(): FormoController {
  const ctx = useContext(FormoContext)
  if (!ctx) {
    throw new Error('[formo-react-native] Component must be used inside <FormoForm> or passed a :field handle')
  }
  return ctx
}
