import { useEffect, type RefObject } from 'react'

const MOBILE_QUERY = '(max-width: 768px)'

export function useParallaxBg(
  sectionRef: RefObject<HTMLElement | null>,
  bgRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const section = sectionRef.current
    const bg = bgRef.current
    if (!section || !bg) return

    const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0

    const updateParallax = () => {
      if (!window.matchMedia(MOBILE_QUERY).matches || reduceMotion()) {
        bg.style.transform = ''
        return
      }
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const centerOffset = rect.top + rect.height / 2 - vh / 2
      bg.style.transform = `translate3d(0, ${centerOffset * -0.22}px, 0)`
    }

    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateParallax)
    }

    const mq = window.matchMedia(MOBILE_QUERY)
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    mq.addEventListener('change', schedule)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      mq.removeEventListener('change', schedule)
      bg.style.transform = ''
    }
  }, [sectionRef, bgRef])
}
