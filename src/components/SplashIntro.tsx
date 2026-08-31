import { useEffect, useLayoutEffect, useState } from 'react'
import bbmLogoSvg from '../assets/bbm-logo.svg'

const SPLASH_KEY = 'bbm-splash-seen'

function shouldShow(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (sessionStorage.getItem(SPLASH_KEY)) return false
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

export default function SplashIntro() {
  const [active, setActive] = useState(shouldShow)
  const [exiting, setExiting] = useState(false)

  useLayoutEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    const holdMs = window.matchMedia('(max-width: 768px)').matches ? 1400 : 2000
    const t1 = window.setTimeout(() => setExiting(true), holdMs)
    const t2 = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_KEY, '1')
      } catch {
        /* ignore quota / private mode */
      }
      setActive(false)
      setExiting(false)
    }, holdMs + 700)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [active])

  if (!active) return null

  return (
    <div className={`splash-intro ${exiting ? 'splash-intro--exit' : ''}`} aria-hidden="true">
      <div className="splash-intro__curtain" />
      <div className="splash-intro__grain" aria-hidden="true" />
      <div className="splash-intro__inner">
        <div className="splash-intro__brand">
          <img src={bbmLogoSvg} alt="" className="splash-intro__logo" width={737} height={631} />
        </div>
        <div className="splash-intro__rule" />
      </div>
    </div>
  )
}
