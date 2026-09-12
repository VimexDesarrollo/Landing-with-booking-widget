'use client'
import { useEffect } from 'react'
import { useReveal, useMagnetic } from '@/hooks/useReveal'
import Hero from '@/components/Hero'
import FeaturedOffers from '@/components/FeaturedOffers'
import Marketplace from '@/components/Marketplace'

export default function HomeClient() {
  useReveal()
  useMagnetic()

  useEffect(() => {
    const onAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (id.length > 1) {
        const target = document.querySelector(id)
        if (target) {
          e.preventDefault()
          window.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
        }
      }
    }
    document.addEventListener('click', onAnchor)
    return () => document.removeEventListener('click', onAnchor)
  }, [])

  return (
    <>
      <Hero />
      <FeaturedOffers />
      <Marketplace />
    </>
  )
}
