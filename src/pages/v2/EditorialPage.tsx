import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import beforeImg from '../../assets/placeholders/result-1.webp'
import afterImg from '../../assets/placeholders/result-2.webp'
import bbmMark from '../../assets/bbm-mark.png'
import ContactApplicationForm from '../../components/ContactApplicationForm'
import SplashIntro from '../../components/SplashIntro'
import VersionPicker from '../../components/VersionPicker'
import AnimatedSection from '../../components/shared/AnimatedSection'
import BeforeAfterSlider from '../../components/shared/BeforeAfterSlider'
import QuoteCarousel from '../../components/shared/QuoteCarousel'
import UgcMosaic from '../../components/shared/UgcMosaic'
import { useParallaxBg } from '../../hooks/useParallaxBg'
import { IG_ABOUT, IG_HERO, IG_PHILOSOPHY } from '../../lib/images'
import { INSTAGRAM, MARQUEE, SERVICES, TIKTOK } from '../../lib/site'
import './editorial.css'

const UGC_TILES = [
  { src: IG_ABOUT, alt: '' },
  { src: IG_HERO, alt: '' },
  { src: IG_PHILOSOPHY, alt: '' },
  { src: IG_HERO, alt: '' },
  { src: IG_PHILOSOPHY, alt: '' },
  { src: IG_ABOUT, alt: '' },
]

export default function EditorialPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const statementRef = useRef<HTMLElement>(null)
  const statementBgRef = useRef<HTMLDivElement>(null)
  useParallaxBg(statementRef, statementBgRef)

  return (
    <div className="look-v2">
      <SplashIntro />
      <VersionPicker />

      <header className="ed-nav">
        <Link to="/" className="ed-nav__logo" onClick={() => setMenuOpen(false)}>
          <img src={bbmMark} alt="Booty by Mal" width={1024} height={1024} />
        </Link>
        <button
          type="button"
          className="ed-nav__toggle"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(o => !o)}
        >
          Menu
        </button>
        <nav className={`ed-nav__links${menuOpen ? ' is-open' : ''}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#results" onClick={() => setMenuOpen(false)}>
            Results
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Apply
          </a>
        </nav>
      </header>

      <section className="ed-hero">
        <img src={IG_HERO} alt="" className="ed-hero__poster" />
        <div className="ed-hero__veil" />
        <div className="ed-hero__copy">
          <p className="ed-eyebrow">Coaching for women</p>
          <h1>Build the body. Keep the confidence.</h1>
          <p className="ed-hero__sub">
            Personalized glute-focused training — 1 on 1, online, or group.
          </p>
          <a href="#contact" className="ed-btn">
            Begin your journey
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
              Booty by Mal is coaching built for women — glute-focused programming, real
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
          <div className="ed-slider">
            <BeforeAfterSlider before={beforeImg} after={afterImg} />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="services" className="ed-services">
        <div className="ed-wrap">
          <p className="ed-eyebrow">Offerings</p>
          <h2>Services</h2>
          <ul className="ed-menu">
            {SERVICES.map(item => (
              <li key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.blurb}</p>
              </li>
            ))}
          </ul>
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

      <footer className="ed-footer">
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <a href={TIKTOK} target="_blank" rel="noopener noreferrer">
          TikTok
        </a>
        <span>© 2026</span>
      </footer>
    </div>
  )
}
