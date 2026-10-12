import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { coverGradient, initials, formatBadge } from '../utils/cover.js'
import { bookUrl } from '../utils/router.js'
import { absoluteUrl } from '../config/site.js'
import { IconExternal, IconBook, IconEye, IconLayers } from './Icons.jsx'
import ShareButtons from './ShareButtons.jsx'
import Comments from './Comments.jsx'
import AdBanner from './AdBanner.jsx'

const READING_MODES = {
  light: { label: 'Día', wrap: 'bg-white', filter: 'none' },
  sepia: { label: 'Sepia', wrap: 'bg-[#f2e5cc]', filter: 'sepia(0.55) contrast(0.95) brightness(1.02)' },
  night: { label: 'Noche', wrap: 'bg-[#12201d]', filter: 'invert(0.93) hue-rotate(180deg) contrast(0.9) brightness(0.95)' },
}

// Imagen OG por defecto de la biblioteca (public/og-cover.jpg, 1200x630)
const OG_IMAGE = absoluteUrl('/og-cover.jpg')

// Sinopsis limpia para metatags: quita el prefijo «Título» y recorta.
function cleanExcerpt(text, max = 180) {
  if (!text) return ''
  const clean = text.replace(/^«[^»]+»\.?\s*/, '').replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean
}

function ReadingViewer({ book }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('light')

  if (!book.driveEmbedUrl) {
    return (
      <div className="grid place-items-center rounded-xl border border-dashed border-coffee/20 bg-parchment/30 p-8 text-center dark:border-gold/20 dark:bg-night/40">
        <IconBook className="h-10 w-10 text-coffee/40 dark:text-parchment/30" />
        <p className="mt-3 font-serif text-lg">Visor no disponible aún para este ejemplar</p>
        <p className="mt-1 max-w-sm text-sm text-coffee/60 dark:text-parchment/50">
          Estamos habilitando la lectura en línea de esta obra. Mientras tanto, puedes
          consultar su ficha y comentario editorial más abajo.
        </p>
      </div>
    )
  }

  if (!open) {
    // El visor NO se carga automáticamente: los rastreadores interpretan un
    // mar de iframes como contenido de poco valor. Solo se despliega a petición.
    return (
      <div className="rounded-xl border border-coffee/10 bg-gradient-to-br from-parchment/70 to-cream p-8 text-center dark:border-gold/10 dark:from-nightcard dark:to-night">
        <IconBook className="mx-auto h-10 w-10 text-terracotta" />
        <p className="mt-3 font-serif text-xl font-bold">¿Listo para leer «{book.title}»?</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-coffee/70 dark:text-parchment/60">
          El visor de lectura se abre únicamente cuando tú lo pides, sin recargas ni ventanas
          emergentes. Incluye modo día, sepia y nocturno.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-cream shadow-book transition hover:bg-terracotta/90"
        >
          <IconEye className="h-5 w-5" />
          Abrir Visor de Lectura de Álvaro
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-coffee/70 dark:text-parchment/60">Leyendo en el visor de Álvaro</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-parchment/70 p-1 dark:bg-nightcard">
            {Object.entries(READING_MODES).map(([key, m]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  mode === key
                    ? 'bg-terracotta text-cream shadow-sm'
                    : 'text-coffee/60 hover:text-coffee dark:text-parchment/60 dark:hover:text-parchment'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full px-3 py-1 text-xs font-medium text-coffee/60 transition hover:text-coffee dark:text-parchment/60 dark:hover:text-parchment"
          >
            Cerrar visor
          </button>
        </div>
      </div>
      <div className={`overflow-hidden rounded-xl border border-coffee/10 transition-colors duration-300 dark:border-gold/10 ${READING_MODES[mode].wrap}`}>
        <iframe
          title={`Visor de lectura de ${book.title}`}
          src={book.driveEmbedUrl}
          className="h-[560px] w-full"
          style={{ filter: READING_MODES[mode].filter }}
          allow="autoplay"
          loading="lazy"
        />
      </div>
      <a
        href={book.driveEmbedUrl.replace('/preview', '/view')}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:underline"
      >
        Abrir en ventana nueva <IconExternal className="h-4 w-4" />
      </a>
    </div>
  )
}

export default function BookDetail({ books }) {
  const { id } = useParams()
  const book = useMemo(() => books.find((b) => b.id === id) || null, [id, books])
  const related = useMemo(() => {
    if (!book) return []
    return books.filter((b) => b.id !== book.id && b.category === book.category).slice(0, 4)
  }, [book, books])

  if (!book) {
    return (
      <main className="container-page py-20 text-center">
        <Helmet>
          <title>Libro no encontrado · La Biblioteca de Álvaro</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="font-serif text-3xl font-bold">Libro no encontrado</h1>
        <p className="mx-auto mt-3 max-w-md text-coffee/70 dark:text-parchment/60">
          El enlace apunta a un ejemplar que ya no está en el catálogo. Puede que haya sido
          sustituido por una edición más reciente.
        </p>
        <Link
          to="/#catalogo"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-terracotta/90"
        >
          Volver al catálogo
        </Link>
      </main>
    )
  }

  const ogUrl = absoluteUrl(`/libro/${book.id}`)
  const ogTitle = `Te recomiendo leer «${book.title}» de ${book.author}`
  const ogDescription = cleanExcerpt(book.synopsis || book.summary || book.review)

  return (
    <main className="container-page py-8">
      <Helmet>
        <title>{`«${book.title}» de ${book.author} · La Biblioteca de Álvaro`}</title>
        <meta property="og:type" content="book" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={ogUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <link rel="canonical" href={ogUrl} />
      </Helmet>
      <Link
        to="/#catalogo"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-coffee/70 transition hover:text-terracotta dark:text-parchment/60 dark:hover:text-gold"
      >
        ← Volver al catálogo
      </Link>
      <article className="overflow-hidden rounded-3xl border border-coffee/10 bg-white/70 shadow-book dark:border-gold/10 dark:bg-nightcard/70">
        <div className="grid md:grid-cols-5">
          {/* Portada + datos */}
          <div className="md:col-span-2">
            <div
              className="relative flex aspect-[3/4] max-h-72 items-end overflow-hidden p-5 shadow-spine md:max-h-none"
              style={{ backgroundImage: coverGradient(book.title + book.author) }}
            >
              <div className="pointer-events-none absolute inset-0 bg-paper-grain [background-size:14px_14px] opacity-40" />
              <div className="pointer-events-none absolute inset-3 rounded-md border border-white/25" />
              <span className="pointer-events-none absolute font-display text-7xl font-black text-white/20">
                {initials(book.title)}
              </span>
              <div className="relative">
                <span className="rounded-md bg-black/25 px-2 py-0.5 text-[10px] font-bold text-white/90">
                  {formatBadge(book.format)}
                </span>
                <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-white drop-shadow">
                  {book.title}
                </h1>
                <p className="text-sm text-white/85">{book.author}</p>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex flex-wrap gap-2">
                <span className="chip chip-idle">{book.category}</span>
                <span className="chip chip-idle">{book.edition}</span>
                {book.year && <span className="chip chip-idle">{book.year}</span>}
              </div>
              {book.editionsAvailable > 1 && (
                <div className="flex items-start gap-2 rounded-lg bg-gold/15 p-3 text-sm text-coffee dark:text-parchment/80">
                  <IconLayers className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <span>Disponible en {book.editionsAvailable} ediciones distintas en la biblioteca.</span>
                </div>
              )}
              <dl className="space-y-1.5 border-t border-dashed border-coffee/10 pt-3 text-sm dark:border-gold/10">
                <div className="flex justify-between gap-3">
                  <dt className="text-coffee/60 dark:text-parchment/50">Formato</dt>
                  <dd className="font-medium">{formatBadge(book.format)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-coffee/60 dark:text-parchment/50">Edición</dt>
                  <dd className="font-medium">{book.edition}</dd>
                </div>
                {book.year && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-coffee/60 dark:text-parchment/50">Año</dt>
                    <dd className="font-medium">{book.year}</dd>
                  </div>
                )}
              </dl>
              <ShareButtons book={book} />
            </div>
          </div>
          {/* Contenido editorial */}
          <div className="border-t border-coffee/10 p-6 dark:border-gold/10 md:col-span-3 md:border-l md:border-t-0 md:p-7">
            <h1 className="font-serif text-2xl font-black leading-tight sm:text-3xl">{book.title}</h1>
            <p className="mt-1 font-reading text-base italic text-coffee/70 dark:text-parchment/60">
              {book.author} · {book.category}
            </p>

            {book.synopsis && (
              <section className="mt-5">
                <h2 className="flex items-center gap-2 font-serif text-lg font-bold">
                  <IconBook className="h-5 w-5 text-terracotta" /> Sinopsis y análisis
                </h2>
                <p className="mt-2 whitespace-pre-line font-reading leading-relaxed text-coffee/85 dark:text-parchment/75">
                  {book.synopsis}
                </p>
              </section>
            )}

            {book.authorBio && (
              <div className="mt-5 rounded-xl border border-gold/20 bg-parchment/50 p-4 dark:border-gold/15 dark:bg-night/50">
                <h3 className="font-serif text-base font-bold text-terracotta dark:text-gold">Sobre el autor</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-coffee/80 dark:text-parchment/70">{book.authorBio}</p>
              </div>
            )}

            {Array.isArray(book.keyTakeaways) && book.keyTakeaways.length > 0 && (
              <section className="mt-5">
                <h2 className="font-serif text-lg font-bold">Puntos clave de lectura</h2>
                <ul className="mt-2 space-y-2">
                  {book.keyTakeaways.map((t, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-coffee/85 dark:text-parchment/75"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-terracotta/10 font-serif text-[11px] font-bold text-terracotta dark:bg-gold/15 dark:text-gold">
                        {i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {book.review && (
              <div className="mt-5 border-t border-dashed border-coffee/10 pt-4 dark:border-gold/10">
                <h2 className="font-serif text-base font-bold">Nota de la edición</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-coffee/80 dark:text-parchment/70">{book.review}</p>
              </div>
            )}

            <div className="mt-7">
              <ReadingViewer book={book} />
            </div>

            <div className="mt-8 border-t border-coffee/10 pt-6 dark:border-gold/10">
              <Comments book={book} />
            </div>
          </div>

        </div>
      </article>
      <AdBanner slot="inline" className="my-8" />

      {related.length > 0 && (
        <section className="pb-10">
          <h2 className="font-serif text-xl font-bold">Más de «{book.category}» en la biblioteca</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((b) => (
              <Link
                key={b.id}
                to={bookUrl(b)}
                className="group flex items-center gap-3 rounded-xl border border-coffee/10 bg-white/70 p-3 transition hover:-translate-y-0.5 hover:shadow-book dark:border-gold/10 dark:bg-nightcard/70"
              >
                <span
                  className="grid h-14 w-10 shrink-0 place-items-center rounded-sm shadow-spine"
                  style={{ backgroundImage: coverGradient(b.title + b.author) }}
                >
                  <span className="font-display text-sm font-black text-white/80">{initials(b.title)}</span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-serif text-sm font-bold">{b.title}</span>
                  <span className="block truncate text-xs text-coffee/60 dark:text-parchment/50">{b.author}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}


    </main>
  )
}
