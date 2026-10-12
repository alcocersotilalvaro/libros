import React, { useEffect, useState } from 'react'
import { IconClose, IconExternal, IconLayers, IconBook } from './Icons.jsx'
import { coverGradient, initials, formatBadge } from '../utils/cover.js'
import ShareButtons from './ShareButtons.jsx'
import Comments from './Comments.jsx'

const READING_MODES = {
  light: { label: 'Día', wrap: 'bg-white', filter: 'none' },
  sepia: { label: 'Sepia', wrap: 'bg-[#f2e5cc]', filter: 'sepia(0.55) contrast(0.95) brightness(1.02)' },
  night: { label: 'Noche', wrap: 'bg-[#12201d]', filter: 'invert(0.93) hue-rotate(180deg) contrast(0.9) brightness(0.95)' },
}

export default function BookModal({ book, onClose }) {
  const [readingMode, setReadingMode] = useState('light')

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!book) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-2 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative my-4 w-full max-w-5xl overflow-hidden rounded-2xl bg-cream shadow-2xl dark:bg-night fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full
            bg-white/80 text-ink shadow transition hover:bg-white dark:bg-nightcard dark:text-parchment"
        >
          <IconClose className="h-5 w-5" />
        </button>

        <div className="grid gap-0 md:grid-cols-5">
          {/* Columna portada + datos */}
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
                <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-white drop-shadow">
                  {book.title}
                </h2>
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
                  <IconLayers className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                  <span>{book.review || `Disponible en ${book.editionsAvailable} ediciones.`}</span>
                </div>
              )}

              <p className="text-sm leading-relaxed text-coffee/80 dark:text-parchment/70">
                {book.summary}
              </p>

              <ShareButtons book={book} />
            </div>
          </div>

          {/* Columna visor + comentarios */}
          <div className="border-t border-coffee/10 p-5 dark:border-gold/10 md:col-span-3 md:border-l md:border-t-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 font-serif text-lg font-bold">
                <IconBook className="h-5 w-5 text-terracotta" /> Lector integrado
              </h3>

              {book.driveEmbedUrl && (
                <div className="flex items-center gap-1 rounded-full bg-parchment/70 p-1 dark:bg-nightcard">
                  {Object.entries(READING_MODES).map(([key, mode]) => (
                    <button
                      key={key}
                      onClick={() => setReadingMode(key)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        readingMode === key
                          ? 'bg-terracotta text-cream shadow-sm'
                          : 'text-coffee/60 hover:text-coffee dark:text-parchment/60 dark:hover:text-parchment'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {book.driveEmbedUrl ? (
              <div
                className={`overflow-hidden rounded-xl border border-coffee/10 transition-colors duration-300 dark:border-gold/10 ${READING_MODES[readingMode].wrap}`}
              >
                <iframe
                  title={`Visor de ${book.title}`}
                  src={book.driveEmbedUrl}
                  className="h-[480px] w-full"
                  style={{ filter: READING_MODES[readingMode].filter }}
                  allow="autoplay"
                />
              </div>
            ) : (
              <div className="grid place-items-center rounded-xl border border-dashed border-coffee/20 bg-parchment/30 p-8 text-center dark:border-gold/20 dark:bg-night/40">
                <IconBook className="h-10 w-10 text-coffee/40 dark:text-parchment/30" />
                <p className="mt-3 font-serif text-lg">Visor no disponible aún</p>
                <p className="mt-1 max-w-sm text-sm text-coffee/60 dark:text-parchment/50">
                  Añade el ID de Google Drive de este archivo en{' '}
                  <code className="rounded bg-coffee/10 px-1">drive_map.json</code> y vuelve a
                  ejecutar el indexador para leerlo aquí mismo.
                </p>
                <p className="mt-2 break-all text-xs text-coffee/40 dark:text-parchment/40">
                  {book.filePath}
                </p>
              </div>
            )}

            {book.driveEmbedUrl && (
              <a
                href={book.driveEmbedUrl.replace('/preview', '/view')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:underline"
              >
                Abrir en pantalla completa <IconExternal className="h-4 w-4" />
              </a>
            )}

            <div className="mt-6 border-t border-coffee/10 pt-5 dark:border-gold/10">
              <Comments book={book} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
