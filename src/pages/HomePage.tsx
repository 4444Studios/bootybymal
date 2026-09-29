import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import before1 from '../assets/before1.JPG'
import after1 from '../assets/after1.JPG'
import before2 from '../assets/before2.JPEG'
import after2 from '../assets/after2.JPG'
import before3 from '../assets/before3.JPG'
import after3 from '../assets/after3.jpeg'
import trainer1 from '../assets/trainer1.JPG'
import trainer2 from '../assets/trainer2.JPG'
import trainer3 from '../assets/trainer3.JPG'
import trainer5 from '../assets/trainer5.JPG'
import trainer7 from '../assets/trainer7.JPG'
import trainer8 from '../assets/trainer8.JPG'
import bbmMark from '../assets/bbm-mark.png'
import bbmWordmark from '../assets/bbm-wordmark.jpg'
import ContactApplicationForm from '../components/ContactApplicationForm'
import SplashIntro from '../components/SplashIntro'
import AnimatedSection from '../components/shared/AnimatedSection'
import BeforeAfterSlider from '../components/shared/BeforeAfterSlider'
import QuoteCarousel from '../components/shared/QuoteCarousel'
import UgcMosaic from '../components/shared/UgcMosaic'
import { useParallaxBg } from '../hooks/useParallaxBg'
import { IG_ABOUT, IG_HERO, IG_PHILOSOPHY } from '../lib/images'
import { INSTAGRAM, MARQUEE, SERVICES, TIKTOK } from '../lib/site'
import '../editorial.css'

const TILE_IMGS = [trainer7, trainer2, trainer5]
const UGC_TILES = [
  { src: trainer1, alt: '' },
  { src: trainer3, alt: '' },
  { src: trainer8, alt: '' },
  { src: trainer5, alt: '' },
  { src: trainer2, alt: '' },
  { src: trainer7, alt: '' },
]

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const statementRef = useRef<HTMLElement>(null)
  const statementBgRef = useRef<HTMLDivElement>(null)
  
  useParallaxBg(statementRef, statementBgRef)

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

      <section className="ed-hero">
        <img src={IG_HERO} alt="" className="ed-hero__poster" />
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

      <AnimatedSection id="about" className="ed-about">
        <div className="ed-wrap ed-about__grid">
          <div>
            <p className="ed-eyebrow">Studio</p>
            <h2>About</h2>
            <p>
              Booty by Mal is coaching built for everyone - glute-focused programming, real
              accountability, and a plan that fits your life. Every client gets custom workouts,
              nutrition guidance, and direct access to Mal.
            </p>
          </div>
          <img src={IG_ABOUT} alt="Booty by Mal coaching" />
        </div>
      </AnimatedSection>

      <AnimatedSection id="results" className="ed-results">
        <div className="ed-wrap">
          <p className="ed-eyebrow">Transformation</p>
          <h2>Results</h2>
          <div className="ed-sliders-grid">
            <div className="ed-slider">
              <BeforeAfterSlider before={before1} after={after1} />
            </div>
            <div className="ed-slider">
              <BeforeAfterSlider before={before2} after={after2} />
            </div>
            <div className="ed-slider">
              <BeforeAfterSlider before={before3} after={after3} />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="services" className="ed-services lb-services-override">
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

      <AnimatedSection className="ed-quotes">
        <div className="ed-wrap">
          <p className="ed-eyebrow">Clients</p>
          <h2>In their words</h2>
          <QuoteCarousel />
        </div>
      </AnimatedSection>

      <AnimatedSection className="ed-ugc">
        <div className="ed-wrap">
          <p className="ed-eyebrow">Social</p>
          <h2>On Instagram</h2>
          <UgcMosaic tiles={UGC_TILES} />
        </div>
      </AnimatedSection>

      <section ref={statementRef} className="ed-statement">
        <div
          ref={statementBgRef}
          className="ed-statement__bg"
          style={{ backgroundImage: `url(${IG_PHILOSOPHY})` }}
          aria-hidden="true"
        />
        <p>Sculpt your glutes. Own your power.</p>
      </section>

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

      <footer className="footer" style={{ marginTop: '0', zIndex: 10, position: 'relative' }}>
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
