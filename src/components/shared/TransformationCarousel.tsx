import { useEffect, useRef, useState, type TouchEvent } from 'react'
import BeforeAfterSlider from './BeforeAfterSlider'

type Slide = {
  before: string
  after: string
}

type Props = {
  slides: Slide[]
}

const SWIPE_THRESHOLD = 56

function wrapIndex(n: number, total: number): number {
  return ((n % total) + total) % total
}

export default function TransformationCarousel({ slides }: Props) {
  const total = slides.length
  const [index, setIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setIndex(i => wrapIndex(i - 1, total))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setIndex(i => wrapIndex(i + 1, total))
      }
    }

    el.addEventListener('keydown', onKeyDown)
    return () => el.removeEventListener('keydown', onKeyDown)
  }, [total])

  const goTo = (next: number) => setIndex(wrapIndex(next, total))

  const onTouchStart = (e: TouchEvent) => {
    const target = e.target as Element | null
    if (target?.closest('[data-rcs="handle-container"]')) return
    touchStartX.current = e.touches[0]?.clientX ?? null
    touchDeltaX.current = 0
  }

  const onTouchMove = (e: TouchEvent) => {
    if (touchStartX.current == null) return
    touchDeltaX.current = (e.touches[0]?.clientX ?? touchStartX.current) - touchStartX.current
  }

  const onTouchEnd = () => {
    if (touchStartX.current == null) return
    const dx = touchDeltaX.current
    touchStartX.current = null
    touchDeltaX.current = 0
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      goTo(index + (dx > 0 ? -1 : 1))
    }
  }

  if (total === 0) return null

  return (
    <div
      ref={rootRef}
      className={`ed-transform-carousel${reduceMotion ? ' ed-transform-carousel--reduced' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client transformations"
      tabIndex={0}
    >
      <div
        className="ed-transform-carousel__stage"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          touchStartX.current = null
          touchDeltaX.current = 0
        }}
      >
        <div className="ed-transform-carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, i) => (
            <div
              key={`${slide.before}-${slide.after}`}
              className="ed-transform-carousel__slide"
              aria-hidden={i !== index}
            >
              <div className="ed-slider">
                <BeforeAfterSlider before={slide.before} after={slide.after} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="ed-transform-carousel__counter" aria-live="polite" aria-atomic="true">
        <span className="sr-only">
          Transformation {index + 1} of {total}
        </span>
        <span aria-hidden="true">
          {String(index + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}
        </span>
      </p>

      <div className="ed-transform-carousel__controls">
        <button
          type="button"
          className="ed-transform-carousel__nav"
          onClick={() => goTo(index - 1)}
          aria-label="Previous transformation"
        >
          ← Prev
        </button>

        <div className="ed-transform-carousel__ticks" aria-label="Choose transformation">
          {slides.map((slide, i) => (
            <button
              key={`${slide.before}-tick`}
              type="button"
              className={`ed-transform-carousel__tick${i === index ? ' is-active' : ''}`}
              aria-current={i === index ? 'true' : undefined}
              aria-label={`Transformation ${i + 1} of ${total}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="ed-transform-carousel__nav"
          onClick={() => goTo(index + 1)}
          aria-label="Next transformation"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
