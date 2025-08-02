'use client'

import { createContext, useState, useContext, Dispatch, SetStateAction } from 'react'

interface IGlobalState {
  hasSecretOption: boolean
  // theme: 'dark' | 'light';
}

interface IGlobalContext {
  globalState: IGlobalState
  setGlobalState: Dispatch<SetStateAction<IGlobalState>>
}

const initialState: IGlobalState = {
  hasSecretOption: false,
}

const GlobalContext = createContext<IGlobalContext | null>(null)

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalState, setGlobalState] = useState<IGlobalState>(initialState)

  return <GlobalContext.Provider value={{ globalState, setGlobalState }}>{children}</GlobalContext.Provider>
}

export const useGlobalState = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}
