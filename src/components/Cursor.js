'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let rx = mx, ry = my
    let rafId

    const onMove = (e) => {
      if (!document.body.classList.contains('cursor-ready')) {
        document.body.classList.add('cursor-ready')
      }
      mx = e.clientX; my = e.clientY
      if (dot) dot.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`
    }

    function raf() {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      if (ring) ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`
      rafId = requestAnimationFrame(raf)
    }
    raf()
    window.addEventListener('mousemove', onMove)

    const hoverTargets = 'a, button, .dest__card, .why__row, .service, .faq__q, [data-cursor="hover"]'
    const onOver = (e) => { if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover') }
    const onOut = (e) => { if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover') }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  )
}
