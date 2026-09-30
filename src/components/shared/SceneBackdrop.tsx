type Props = {
  src: string
  position?: string
  eager?: boolean
}

export default function SceneBackdrop({ src, position = 'center 30%', eager = false }: Props) {
  return (
    <div className="ed-scene__bg" aria-hidden="true">
      <img className="ed-scene__blur" src={src} alt="" decoding="async" />
      <img
        className="ed-scene__img"
        src={src}
        alt=""
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
        style={{ objectPosition: position }}
      />
    </div>
  )
}
