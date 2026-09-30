import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = path.resolve('src/assets')
const OUT = path.resolve('src/assets/opt')

const JOBS = [
  ...['trainer1', 'trainer2', 'trainer3', 'trainer4', 'trainer6', 'Trainer9'].map(n => ({
    from: `${n}.JPG`,
    to: `${n.toLowerCase()}.webp`,
    width: 1400,
    quality: 74,
  })),
  ...['trainer5', 'trainer7', 'trainer8'].map(n => ({
    from: `${n}.JPG`,
    to: `${n}.webp`,
    width: 900,
    quality: 74,
  })),
  { from: 'before1.JPG', to: 'before1.webp', width: 900, quality: 78 },
  { from: 'after1.JPG', to: 'after1.webp', width: 900, quality: 78 },
  { from: 'before2.JPEG', to: 'before2.webp', width: 900, quality: 78 },
  { from: 'after2.JPG', to: 'after2.webp', width: 900, quality: 78 },
  { from: 'before3.JPG', to: 'before3.webp', width: 900, quality: 78 },
  { from: 'after3.jpeg', to: 'after3.webp', width: 900, quality: 78 },
  { from: 'bbm-wordmark.jpg', to: 'bbm-wordmark.webp', width: 640, quality: 85 },
]

await mkdir(OUT, { recursive: true })

let before = 0
let after = 0
for (const job of JOBS) {
  const input = path.join(SRC, job.from)
  const output = path.join(OUT, job.to)
  await sharp(input)
    .rotate()
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality, effort: 5 })
    .toFile(output)
  const [a, b] = await Promise.all([stat(input), stat(output)])
  before += a.size
  after += b.size
  console.log(`${job.to.padEnd(22)} ${(a.size / 1024).toFixed(0).padStart(6)}K -> ${(b.size / 1024).toFixed(0).padStart(5)}K`)
}
console.log(`total ${(before / 1048576).toFixed(1)}M -> ${(after / 1048576).toFixed(2)}M`)
