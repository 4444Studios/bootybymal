import { useRef } from 'react'
import { Link } from 'react-router-dom'
import beforeImg from '../../assets/placeholders/result-1.webp'
import afterImg from '../../assets/placeholders/result-2.webp'
import bbmLogoSvg from '../../assets/bbm-logo.svg'
import ContactApplicationForm from '../../components/ContactApplicationForm'
import SplashIntro from '../../components/SplashIntro'
import VersionPicker from '../../components/VersionPicker'
import AnimatedSection from '../../components/shared/AnimatedSection'
import BeforeAfterSlider from '../../components/shared/BeforeAfterSlider'
import QuoteCarousel from '../../components/shared/QuoteCarousel'
import UgcMosaic from '../../components/shared/UgcMosaic'
import { useParallaxBg } from '../../hooks/useParallaxBg'
import { IG_ABOUT, IG_HERO, IG_PHILOSOPHY } from '../../lib/images'
import { INSTAGRAM, SERVICES, TIKTOK } from '../../lib/site'
import './lookbook.css'

const TILE_IMGS = [IG_HERO, IG_ABOUT, IG_PHILOSOPHY]
const UGC_TILES = [
  { src: IG_ABOUT, alt: '' },
  { src: IG_HERO, alt: '' },
  { src: IG_PHILOSOPHY, alt: '' },
  { src: IG_HERO, alt: '' },
  { src: IG_PHILOSOPHY, alt: '' },
  { src: IG_ABOUT, alt: '' },
]

export default function LookbookPage() {
  const statementRef = useRef<HTMLElement>(null)
  const statementBgRef = useRef<HTMLDivElement>(null)
  useParallaxBg(statementRef, statementBgRef)

  return (
    <div className="look-v3">
      <SplashIntro />
      <VersionPicker />

      <header className="lb-nav">
        <Link to="/" className="lb-nav__mark">
          <img src={bbmLogoSvg} alt="Booty by Mal" width={737} height={631} />
        </Link>
        <nav>
          <a href="#about">About</a>
          <a href="#results">Results</a>
          <a href="#services">Services</a>
          <a href="#contact">Apply</a>
        </nav>
      </header>

      <section className="lb-hero">
        <p className="lb-kicker">Coaching for women · Glutes + confidence</p>
        <h1>
          Build your <em>booty.</em>
          <br />
          Build your <em>confidence.</em>
        </h1>
        <p className="lb-hero__sub">Personalized training for women who are ready to show up.</p>
        <a href="#contact" className="lb-btn">
          Begin your journey
        </a>
      </section>

      <section className="lb-feature">
        <img src={IG_PHILOSOPHY} alt="" />
        <div>
          <p className="lb-kicker">The work</p>
          <h2>Programs that meet you where you are</h2>
          <p>
            Custom workouts, nutrition guidance, and a 60-day commitment — so the results stay
            after the honeymoon week.
          </p>
        </div>
      </section>

      <AnimatedSection id="about" className="lb-about">
        <div className="lb-wrap">
          <p className="lb-kicker">About</p>
          <h2>Booty by Mal</h2>
          <p>
            Coaching built for women. Glute-focused programming, real accountability, and a plan
            that fits your life — with direct access to Mal.
          </p>
          <img src={IG_ABOUT} alt="Booty by Mal coaching" />
        </div>
      </AnimatedSection>

      <AnimatedSection id="services" className="lb-services">
        <div className="lb-wrap">
          <p className="lb-kicker">Offerings</p>
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

      <AnimatedSection id="results" className="lb-results">
        <div className="lb-wrap">
          <p className="lb-kicker">Results</p>
          <h2>Before / after</h2>
          <div className="lb-slider">
            <BeforeAfterSlider before={beforeImg} after={afterImg} />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="lb-quotes">
        <div className="lb-wrap">
          <p className="lb-kicker">Clients</p>
          <h2>What they say</h2>
          <QuoteCarousel stacked />
        </div>
      </AnimatedSection>

      <AnimatedSection className="lb-ugc">
        <div className="lb-wrap">
          <p className="lb-kicker">@bootybyemal</p>
          <h2>The feed</h2>
          <UgcMosaic tiles={UGC_TILES} />
        </div>
      </AnimatedSection>

      <section ref={statementRef} className="lb-statement">
        <div
          ref={statementBgRef}
          className="lb-statement__bg"
          style={{ backgroundImage: `url(${IG_PHILOSOPHY})` }}
          aria-hidden="true"
        />
        <div className="lb-statement__copy">
          <h2>Sculpt your glutes</h2>
          <h2>Own your power</h2>
        </div>
      </section>

      <AnimatedSection id="contact" className="lb-contact">
        <div className="lb-wrap lb-contact__inner">
          <p className="lb-kicker">Apply</p>
          <h2>Get started</h2>
          <p>
            Applications are reviewed personally. Tell Mal about your goals and she will be in
            touch.
          </p>
          <ContactApplicationForm />
        </div>
      </AnimatedSection>

      <footer className="lb-footer">
        <img src={bbmLogoSvg} alt="" width={220} height={188} />
        <div>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={TIKTOK} target="_blank" rel="noopener noreferrer">
            TikTok
          </a>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  )
}
