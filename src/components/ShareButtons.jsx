import React, { useState } from 'react'
import { IconCopy, IconLink } from './Icons.jsx'
import { SITE_URL } from '../config/site.js'

// Enlace canónico para compartir, sin «#»: https://libros-variados.web.app/libro/<id>
function shareUrlFor(book) {
  return `${SITE_URL}/libro/${book.id}`
}

const Brand = {
  whatsapp: {
    label: 'WhatsApp',
    color: '#25D366',
    icon: (
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.1-4.6-.2-.2-1.3-1.7-1.3-3.2s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.4.1.2.1.9-.1 1.3z" />
    ),
  },
  x: {
    label: 'X',
    color: '#000000',
    icon: (
      <path d="M18.9 2H22l-7.3 8.3L23 22h-6.8l-5.3-6.9L4.8 22H1.7l7.8-8.9L1 2h7l4.8 6.3L18.9 2zm-2.4 18h1.9L7.6 3.9H5.6L16.5 20z" />
    ),
  },
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    icon: (
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z" />
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    icon: (
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5V9h3v10zM6.5 7.7a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zM19 19h-3v-5.3c0-1.3-.5-2.1-1.6-2.1-.9 0-1.4.6-1.6 1.2-.1.2-.1.5-.1.8V19h-3V9h3v1.3a3 3 0 0 1 2.7-1.5c2 0 3.4 1.3 3.4 4.1V19z" />
    ),
  },
}

function IconButton({ brand, href }) {
  const b = Brand[brand]
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Compartir en ${b.label}`}
      title={`Compartir en ${b.label}`}
      className="grid h-10 w-10 place-items-center rounded-full text-white shadow-sm transition hover:scale-110"
      style={{ backgroundColor: b.color }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        {b.icon}
      </svg>
    </a>
  )
}

export default function ShareButtons({ book }) {
  const [copied, setCopied] = useState(false)
  const url = shareUrlFor(book)
  const text = `Te recomiendo leer «${book.title}» de ${book.author} en La Biblioteca de Álvaro`
  const enc = encodeURIComponent
  const encU = enc(url)

  const links = {
    whatsapp: `https://wa.me/?text=${enc(text + ' ' + url)}`,
    x: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${encU}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encU}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encU}`,
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const t = document.createElement('textarea')
      t.value = url
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      document.body.removeChild(t)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 flex items-center gap-1 text-sm font-medium text-coffee/70 dark:text-parchment/60">
        <IconLink className="h-4 w-4" /> Compartir:
      </span>
      <IconButton brand="whatsapp" href={links.whatsapp} />
      <IconButton brand="x" href={links.x} />
      <IconButton brand="facebook" href={links.facebook} />
      <IconButton brand="linkedin" href={links.linkedin} />
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full bg-parchment/80 px-4 py-2 text-sm font-medium
          text-coffee transition hover:bg-parchment dark:bg-nightcard dark:text-parchment/80 dark:hover:bg-nightcard/70"
      >
        <IconCopy className="h-4 w-4" />
        {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
      </button>
    </div>
  )
}
