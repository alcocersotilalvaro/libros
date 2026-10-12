// Genera una portada visual determinista a partir del título/autor
// cuando no hay imagen de portada disponible.

const PALETTES = [
  ['#b5673f', '#7a3f22'],
  ['#5c4a35', '#2b2620'],
  ['#7c8a6a', '#4b5740'],
  ['#c39a4d', '#8a6a26'],
  ['#8a5a83', '#4e2f4a'],
  ['#3f6a7a', '#243f49'],
  ['#a4553f', '#63301f'],
  ['#4d6b57', '#2c4032'],
]

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function coverGradient(seed) {
  const [a, b] = PALETTES[hashString(seed || 'libro') % PALETTES.length]
  return `linear-gradient(145deg, ${a} 0%, ${b} 100%)`
}

export function initials(title) {
  if (!title) return '📖'
  const words = title.split(/\s+/).filter(Boolean)
  const letters = words.slice(0, 2).map((w) => w[0]).join('')
  return letters.toUpperCase()
}

const FORMAT_ICON = { pdf: 'PDF', epub: 'EPUB', mobi: 'MOBI' }
export function formatBadge(fmt) {
  return FORMAT_ICON[fmt] || fmt?.toUpperCase() || 'LIBRO'
}
