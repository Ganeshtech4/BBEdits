'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    // Smooth scroll using GSAP
    let ctx = gsap.context(() => {
      const scrollContent = scrollContainer.querySelector('[data-scroll-content]') as HTMLElement
      if (!scrollContent) return

      let scrollTween = gsap.to(scrollContent, {
        y: () => -(scrollContent.scrollHeight - window.innerHeight),
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: () => `+=${scrollContent.scrollHeight - window.innerHeight}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      return () => {
        scrollTween.kill()
      }
    })

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div ref={scrollRef} className="smooth-scroll-wrapper">
      <div data-scroll-content className="smooth-scroll-content">
        {children}
      </div>
    </div>
  )
}
