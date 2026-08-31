import { useState } from 'react'
import { QUOTES } from '../../lib/site'

type Props = {
  stacked?: boolean
}

export default function QuoteCarousel({ stacked = false }: Props) {
  const [index, setIndex] = useState(0)
  const quote = QUOTES[index]

  if (stacked) {
    return (
      <div className="quote-stack">
        {QUOTES.map(item => (
          <blockquote key={item.quote} className="quote-card">
            <p className="quote-card__text">“{item.quote}”</p>
            <footer className="quote-card__meta">
              <cite>{item.author}</cite>
              <span>{item.location}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    )
  }

  if (!quote) return null

  return (
    <div className="quote-carousel">
      <blockquote className="quote-card" key={quote.quote}>
        <p className="quote-card__text">“{quote.quote}”</p>
        <footer className="quote-card__meta">
          <cite>{quote.author}</cite>
          <span>{quote.location}</span>
        </footer>
      </blockquote>
      <div className="quote-carousel__nav">
        <button type="button" onClick={() => setIndex(i => (i - 1 + QUOTES.length) % QUOTES.length)}>
          Prev
        </button>
        <p>
          {index + 1} / {QUOTES.length}
        </p>
        <button type="button" onClick={() => setIndex(i => (i + 1) % QUOTES.length)}>
          Next
        </button>
      </div>
    </div>
  )
}
