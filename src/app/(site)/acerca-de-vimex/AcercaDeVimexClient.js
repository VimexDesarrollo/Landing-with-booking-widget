'use client'
import { useEffect } from 'react'
import { useReveal, useMagnetic } from '@/hooks/useReveal'
import FeelAtHome from '@/components/FeelAtHome'
import MarqueeBand from '@/components/MarqueeBand'
import Services from '@/components/Services'
import Stats from '@/components/Stats'
import RivieraMaya from '@/components/RivieraMaya'
import Destinations from '@/components/Destinations'
import Stack from '@/components/Stack'
import WhyVimex from '@/components/WhyVimex'
import WhyChooseUs from '@/components/WhyChooseUs'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'

export default function AcercaDeVimexClient() {
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
      <FeelAtHome />
      <MarqueeBand />
      <Services />
      <Stats />
      <RivieraMaya />
      <Destinations />
      <Stack />
      <WhyVimex />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  )
}
