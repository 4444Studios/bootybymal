import { INSTAGRAM } from '../../lib/site'

type Tile = { src: string; alt: string }

type Props = {
  tiles: Tile[]
}

export default function UgcMosaic({ tiles }: Props) {
  return (
    <div className="ugc-mosaic">
      {tiles.map((tile, i) => (
        <a
          key={`${tile.src}-${i}`}
          className="ugc-mosaic__cell"
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={tile.src} alt={tile.alt} loading="lazy" />
        </a>
      ))}
    </div>
  )
}
