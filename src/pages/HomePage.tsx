import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import before1 from '../assets/opt/before1.webp'
import after1 from '../assets/opt/after1.webp'
import before2 from '../assets/opt/before2.webp'
import after2 from '../assets/opt/after2.webp'
import before3 from '../assets/opt/before3.webp'
import after3 from '../assets/opt/after3.webp'
import trainer5 from '../assets/opt/trainer5.webp'
import trainer7 from '../assets/opt/trainer7.webp'
import trainer8 from '../assets/opt/trainer8.webp'
import bbmMark from '../assets/bbm-mark.png'
import bbmWordmark from '../assets/opt/bbm-wordmark.webp'
import ContactApplicationForm from '../components/ContactApplicationForm'
import SplashIntro from '../components/SplashIntro'
import AnimatedSection from '../components/shared/AnimatedSection'
import SceneBackdrop from '../components/shared/SceneBackdrop'
import TransformationCarousel from '../components/shared/TransformationCarousel'
import { IG_ABOUT, IG_CONTACT, IG_HERO, IG_OFFERINGS, IG_PHILOSOPHY, IG_RESULTS } from '../lib/images'
import { INSTAGRAM, MARQUEE, SERVICES, TIKTOK } from '../lib/site'
import '../editorial.css'

const TILE_IMGS = [trainer7, trainer8, trainer5]
const TRANSFORMATIONS = [
  { before: before1, after: after1 },
  { before: before2, after: after2 },
  { before: before3, after: after3 },
]

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (
        isMobileMenuOpen &&
        target &&
        !target.closest('.nav-container') &&
        !target.closest('#mobile-nav')
      ) {
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

  return (
    <div className="look-v2">
      <SplashIntro />

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={bbmMark} alt="Booty by Mal" width={1024} height={1024} />
          </Link>
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="nav-links nav-links--desktop">
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
            <a href="#contact" className="nav-cta-button" onClick={() => setIsMobileMenuOpen(false)}>
              Get Started →
            </a>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        <div
          id="mobile-nav"
          className={`nav-links nav-links--sheet${isMobileMenuOpen ? ' is-open' : ''}`}
        >
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
      </nav>

      <section className="ed-scene ed-hero">
        <SceneBackdrop src={IG_HERO} position="center top" eager />
        <div className="ed-hero__veil" />
        <div className="ed-hero__copy">
          <p className="hero-eyebrow" style={{ color: 'var(--ed-cream)' }}>Coaching · Glutes + confidence</p>
          <h1 className="hero-title" style={{ color: 'var(--ed-cream)' }}>
            <span className="line">Build your</span>
            <span className="line accent">booty.</span>
            <span className="line">Build your</span>
            <span className="line accent">confidence.</span>
          </h1>
          <p className="hero-subtitle" style={{ color: 'var(--ed-cream)' }}>Personalized training for those who are ready to show up</p>
          <a href="#contact" className="cta-button" style={{ display: 'inline-flex' }}>
            <span className="cta-button-inner">Begin Your Journey</span>
          </a>
        </div>
        <div className="ed-hero__marquee" aria-hidden="true">
          <div className="ed-hero__track">
            <span>{MARQUEE}</span>
            <span>{MARQUEE}</span>
          </div>
        </div>
      </section>

      <section id="about" className="ed-scene ed-about">
        <SceneBackdrop src={IG_ABOUT} />
        <AnimatedSection as="div">
          <div className="ed-wrap ed-about__copy">
            <p className="ed-eyebrow">Studio</p>
            <h2>About</h2>
            <p>
              Booty by Mal is coaching built for everyone - glute-focused programming, real
              accountability, and a plan that fits your life. Every client gets custom workouts,
              nutrition guidance, and direct access to Mal.
            </p>
          </div>
        </AnimatedSection>
      </section>

      <section id="results" className="ed-scene ed-results">
        <SceneBackdrop src={IG_RESULTS} />
        <AnimatedSection as="div">
          <div className="ed-wrap">
            <p className="ed-eyebrow">Transformation</p>
            <h2>Results</h2>
            <TransformationCarousel slides={TRANSFORMATIONS} />
          </div>
        </AnimatedSection>
      </section>

      <section id="services" className="ed-scene ed-services">
        <SceneBackdrop src={IG_OFFERINGS} />
        <AnimatedSection as="div">
          <div className="ed-wrap">
            <p className="ed-eyebrow">Offerings</p>
            <h2>How we train</h2>
            <div className="lb-tiles">
              {SERVICES.map((item, i) => (
                <article key={item.name}>
                  <img src={TILE_IMGS[i]} alt="" />
                  <h3>{item.name}</h3>
                  <p>{item.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="ed-scene ed-statement">
        <SceneBackdrop src={IG_PHILOSOPHY} />
        <p>Sculpt your glutes. Own your power.</p>
      </section>

      <div className="ed-scene ed-closing">
        <SceneBackdrop src={IG_CONTACT} />
        <AnimatedSection id="contact" className="ed-contact">
          <div className="ed-wrap ed-contact__inner">
            <p className="ed-eyebrow">Apply</p>
            <h2>Get started</h2>
            <p className="ed-contact__lead">
              Applications are reviewed personally. Tell Mal about your goals and she will be in touch.
            </p>
            <ContactApplicationForm />
          </div>
        </AnimatedSection>

        <footer className="footer ed-closing__footer">
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

      <a
        href={INSTAGRAM}
        className="ed-ig-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Booty by Mal on Instagram"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </svg>
      </a>
    </div>
  )
}
