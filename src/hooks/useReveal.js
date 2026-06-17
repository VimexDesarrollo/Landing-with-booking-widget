'use client'
import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
    document.body.classList.add('anim-ready')
    const t = setTimeout(() => document.body.classList.remove('anim-ready'), 6000)

    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' })

    els.forEach((el) => io.observe(el))

    function revealVisible() {
      const vh = window.innerHeight
      els.forEach((el) => {
        if (el.classList.contains('in-view')) return
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.95 && r.bottom > 0) el.classList.add('in-view')
      })
    }
    requestAnimationFrame(() => requestAnimationFrame(revealVisible))
    window.addEventListener('scroll', revealVisible, { passive: true })
    window.addEventListener('resize', revealVisible)
    const fallback = setTimeout(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) el.classList.add('in-view')
      })
    }, 5000)

    return () => {
      clearTimeout(t)
      clearTimeout(fallback)
      io.disconnect()
      window.removeEventListener('scroll', revealVisible)
      window.removeEventListener('resize', revealVisible)
    }
  }, [])
}

export function useMagnetic() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-magnetic]')
    const handlers = []
    els.forEach((el) => {
      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        const x = e.clientX - r.left - r.width / 2
        const y = e.clientY - r.top - r.height / 2
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
      }
      const onLeave = () => { el.style.transform = 'translate(0,0)' }
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      handlers.push({ el, onMove, onLeave })
    })
    return () => {
      handlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])
}
