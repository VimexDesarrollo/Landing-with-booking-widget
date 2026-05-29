'use client'
import { createContext, useContext, useState } from 'react'

const LangContext = createContext({ lang: 'es', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState('es')
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext)
  const t = (en, es) => lang === 'en' ? en : es
  return { lang, setLang, t }
}
