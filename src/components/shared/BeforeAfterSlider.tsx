import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from 'react-compare-slider'

type Props = {
  before: string
  after: string
  beforeAlt?: string
  afterAlt?: string
  accent?: string
}

export default function BeforeAfterSlider({
  before,
  after,
  beforeAlt = 'Before',
  afterAlt = 'After',
  accent = '#a8a29e',
}: Props) {
  return (
    <ReactCompareSlider
      onlyHandleDraggable
      handle={
        <ReactCompareSliderHandle
          buttonStyle={{
            backdropFilter: 'none',
            background: accent,
            border: 0,
            color: '#1c1917',
            boxShadow: `0 0 0 1px ${accent}`,
          }}
          linesStyle={{ color: accent, width: 2 }}
        />
      }
      itemOne={<ReactCompareSliderImage src={before} alt={beforeAlt} style={{ objectFit: 'cover' }} />}
      itemTwo={<ReactCompareSliderImage src={after} alt={afterAlt} style={{ objectFit: 'cover' }} />}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
