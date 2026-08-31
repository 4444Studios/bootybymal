import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import aboutImage from '../assets/about.webp'
import heroImage from '../assets/hero.webp'
import philosophyImage from '../assets/philosophy.webp'
import bbmMark from '../assets/bbm-mark.png'
import bbmWordmark from '../assets/bbm-wordmark.jpg'
import bbmLogoSvg from '../assets/bbm-logo.svg'
import ContactApplicationForm from '../components/ContactApplicationForm'
import ResultsCarousel from '../components/ResultsCarousel'

const INSTAGRAM = 'https://www.instagram.com/bootybyemal/'
const TIKTOK = 'https://www.tiktok.com/@xoxomalini'

function shouldShowIntroSplash(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

function HomePage() {
  const philosophySectionRef = useRef<HTMLElement>(null)
  const philosophyBgRef = useRef<HTMLDivElement>(null)

  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [showFloatingCta, setShowFloatingCta] = useState<boolean>(false)

  const [splashActive, setSplashActive] = useState(shouldShowIntroSplash)
  const [splashExiting, setSplashExiting] = useState(false)

  useLayoutEffect(() => {
    if (!splashActive) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [splashActive])

  useEffect(() => {
    if (!splashActive) return
    const holdMs = window.matchMedia('(max-width: 768px)').matches ? 1400 : 2000
    const exitMs = 700
    const t1 = window.setTimeout(() => setSplashExiting(true), holdMs)
    const t2 = window.setTimeout(() => {
      setSplashActive(false)
      setSplashExiting(false)
    }, holdMs + exitMs)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [splashActive])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      const contactSection = document.getElementById('contact')
      const heroHeight = window.innerHeight
      const contactTop = contactSection?.offsetTop || Infinity
      const scrollPosition = window.scrollY + window.innerHeight

      setShowFloatingCta(
        window.scrollY > heroHeight * 0.5 && scrollPosition < contactTop + 100
      )
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (isMobileMenuOpen && target && !target.closest('.nav-container')) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMobileMenuOpen)
    if (!isMobileMenuOpen) return
    const prev = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.classList.remove('menu-open')
      document.body.style.overflow = prev
      document.documentElement.style.overflow = prevHtml
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    )

    const hiddenElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    hiddenElements.forEach(el => observer.observe(el))

    return () => {
      hiddenElements.forEach(el => observer.unobserve(el))
    }
  }, [])

  useEffect(() => {
    const section = philosophySectionRef.current
    const bg = philosophyBgRef.current
    if (!section || !bg) return

    const mobileQuery = '(max-width: 768px)'
    const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0

    const updateParallax = () => {
      if (!window.matchMedia(mobileQuery).matches || reduceMotion()) {
        bg.style.transform = ''
        return
      }
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const centerOffset = rect.top + rect.height / 2 - vh / 2
      const y = centerOffset * -0.22
      bg.style.transform = `translate3d(0, ${y}px, 0)`
    }

    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateParallax)
    }

    const mq = window.matchMedia(mobileQuery)
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
  }, [])

  const marqueeItems = [
    'Glute-Focused',
    'Women-First',
    '1 on 1',
    'Online Coaching',
    'Group Training',
    '60-Day Commitment',
  ]

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {splashActive && (
        <div
          className={`splash-intro ${splashExiting ? 'splash-intro--exit' : ''}`}
          aria-hidden="true"
        >
          <div className="splash-intro__curtain" />
          <div className="splash-intro__grain" aria-hidden="true" />
          <div className="splash-intro__inner">
            <div className="splash-intro__brand">
              <img
                src={bbmLogoSvg}
                alt=""
                className="splash-intro__logo"
                width={737}
                height={631}
              />
            </div>
            <div className="splash-intro__rule" />
          </div>
        </div>
      )}

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={bbmMark} alt="Booty by Mal" width={1024} height={1024} />
          </a>
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
          )}
          <div
            id="mobile-nav"
            className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}
          >
            <button
              className="mobile-nav-close"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </a>
            <a href="#results" onClick={() => setIsMobileMenuOpen(false)}>
              Results
            </a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>
              Services
            </a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
              Apply
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Instagram
            </a>
            <a
              href={TIKTOK}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link-mobile-only"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              TikTok
            </a>
            <a href="#contact" className="nav-cta-button" onClick={() => setIsMobileMenuOpen(false)}>
              Get Started →
            </a>
          </div>
        </div>
      </nav>

      <main id="main-content">
        <section className="hero">
          <div
            className="hero-bg"
            aria-hidden="true"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-content">
            <p className="hero-eyebrow">Coaching for women · Glutes + confidence</p>
            <h1 className="hero-title">
              <span className="line">Build your</span>
              <span className="line accent">booty.</span>
              <span className="line">Build your</span>
              <span className="line accent">confidence.</span>
            </h1>
            <p className="hero-subtitle">Personalized training for women who are ready to show up</p>
            <a href="#contact" className="cta-button">
              <span className="cta-button-inner">Begin Your Journey</span>
            </a>
          </div>
          <a href="#about" className="hero-scroll-hint" aria-label="Scroll to about">
            <span className="hero-scroll-line" aria-hidden="true" />
            <span className="hero-scroll-label">Discover</span>
          </a>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="marquee__item">
                {item}
                <span className="marquee__dot"> ·</span>
              </span>
            ))}
          </div>
        </div>

        <section id="about" className="about">
          <div className="section-container">
            <div className="about-wrapper">
              <div className="about-text reveal-left">
                <p className="section-eyebrow">Coaching</p>
                <h2 className="section-title">About</h2>
                <p className="large-text">
                  <span className="inline-logo">Booty by Mal</span> is coaching built for women —
                  glute-focused programming, real accountability, and a plan that fits your life. Every
                  client gets custom workouts, nutrition guidance, and direct access to Mal. This is
                  high-touch training for women who want results and are ready for a 60-day commitment.
                </p>
              </div>
              <div className="about-image-wrapper reveal-right">
                <img
                  src={aboutImage}
                  alt="Booty by Mal coaching"
                  className="about-image"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="results" className="results">
          <div className="section-container">
            <div className="section-header reveal">
              <h2 className="section-eyebrow results-eyebrow">Results</h2>
            </div>
            <div className="reveal delay-100">
              <ResultsCarousel />
            </div>
          </div>
        </section>

        <section id="services" className="services">
          <div className="section-container">
            <div className="section-header reveal">
              <p className="section-eyebrow">Offerings</p>
              <h2 className="section-title">Services</h2>
            </div>
            <div className="services-grid">
              <div className="service-card reveal delay-100">
                <h3>1 on 1</h3>
                <p>
                  Private coaching tailored to your body, schedule, and goals. Hands-on guidance,
                  real-time form cues, and a program that evolves with you.
                </p>
              </div>
              <div className="service-card reveal delay-200">
                <h3>Online coaching</h3>
                <p>
                  Custom programming, weekly check-ins, and direct access to Mal — so you can train
                  anywhere and still stay accountable.
                </p>
              </div>
              <div className="service-card reveal delay-300">
                <h3>Group Training</h3>
                <p>
                  Train with other women who are locked in. Shared energy, structured sessions, and
                  the same 60-day commitment to showing up.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={philosophySectionRef} className="philosophy">
          <div
            ref={philosophyBgRef}
            className="philosophy-bg"
            style={{ backgroundImage: `url(${philosophyImage})` }}
            aria-hidden="true"
          />
          <div className="philosophy-content">
            <div className="philosophy-text reveal-scale">
              <h2>Sculpt your glutes</h2>
              <h2>Own your power</h2>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="section-container">
            <div className="contact-content reveal">
              <p className="section-eyebrow">Apply</p>
              <h2 className="section-title">Get Started</h2>
              <p className="contact-description">
                Applications are reviewed personally. Tell Mal about your goals and she&apos;ll be in
                touch to talk through what&apos;s possible for you.
              </p>

              <ContactApplicationForm />
            </div>
          </div>
        </section>

        <a
          href="#contact"
          className={`floating-cta ${showFloatingCta ? '' : 'hidden'}`}
          aria-label="Start your application"
        >
          Apply now
        </a>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={bbmWordmark} alt="Booty by Mal" width={1024} height={682} />
          </div>
          <div className="footer-links">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={TIKTOK} target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
