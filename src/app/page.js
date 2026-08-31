'use client'
import { useEffect } from 'react'
import { useReveal, useMagnetic } from '@/hooks/useReveal'
import Loader from '@/components/Loader'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import FeaturedOffers from '@/components/FeaturedOffers'
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
import Footer from '@/components/Footer'

export default function Home() {
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
      <Loader />
      <Cursor />
      <Nav />
      <Hero />
      <FeaturedOffers />
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
      <Footer />
    </>
  )
}
