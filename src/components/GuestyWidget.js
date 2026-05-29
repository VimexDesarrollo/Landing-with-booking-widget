'use client'
import { useEffect } from 'react'

const CSS_URL = 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css'
const JS_URL  = 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js'

export default function GuestyWidget() {
  useEffect(() => {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement('link')
      link.rel   = 'stylesheet'
      link.href  = CSS_URL
      document.head.appendChild(link)
    }

    const init = () => {
      try {
        window.GuestySearchBarWidget?.create({
          siteUrl: 'vimexmx.guestybookings.com',
          color:   '#7ed7e6',
        })
      } catch {}
    }

    if (window.GuestySearchBarWidget) { init(); return }

    if (!document.querySelector(`script[src="${JS_URL}"]`)) {
      const script  = document.createElement('script')
      script.src    = JS_URL
      script.async  = true
      script.onload = init
      document.head.appendChild(script)
    }
  }, [])

  return <div id="search-widget_IO312PWQ" />
}
