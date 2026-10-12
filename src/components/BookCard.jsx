import React from 'react'
import { Link } from 'react-router-dom'
import { coverGradient, initials, formatBadge } from '../utils/cover.js'
import { IconLayers } from './Icons.jsx'
import { bookUrl } from '../utils/router.js'

export default function BookCard({ book }) {
  return (
    <Link
      to={bookUrl(book)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gold/25 bg-white/80
        text-left shadow-book shadow-ink/5 transition-all duration-300 hover:-translate-y-1.5
        hover:shadow-xl hover:shadow-ink/20
        dark:border-gold/15 dark:bg-nightcard/70 fade-in"
    >
      {/* Portada estilo empastado clásico */}
      <div
        className="relative flex aspect-[3/4] items-end overflow-hidden p-4 shadow-spine"
        style={{ backgroundImage: coverGradient(book.title + book.author) }}
      >
        {/* Textura de tela/papel sutil */}
        <div className="pointer-events-none absolute inset-0 bg-paper-grain [background-size:14px_14px] opacity-40" />

        {/* Marco decorativo interior, como un libro empastado */}
        <div className="pointer-events-none absolute inset-2 rounded-md border border-white/25" />
        <div className="pointer-events-none absolute inset-[10px] rounded-sm border border-white/10" />

        <span className="absolute right-3 top-3 rounded-md bg-black/30 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white/90 backdrop-blur-sm">
          {formatBadge(book.format)}
        </span>

        {book.editionsAvailable > 1 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-gold px-2 py-0.5 text-[10px] font-bold text-ink shadow-sm">
            <IconLayers className="h-3 w-3" />
            {book.editionsAvailable} ed.
          </span>
        )}

        <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-[0.15]">
          <span className="font-display text-6xl font-black tracking-widest text-white">
            {initials(book.title)}
          </span>
        </span>

        {/* Brillo tipo "hoja" al pasar el cursor */}
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r
            from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700
            group-hover:translate-x-full group-hover:opacity-100"
        />

        <div className="relative z-10">
          <p className="font-serif text-lg font-bold leading-tight text-white drop-shadow-md">
            {book.title}
          </p>
          <p className="mt-1 font-reading text-xs italic text-white/85">{book.author}</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 border-t border-gold/15 p-4 dark:border-gold/10">
        <span className="chip chip-idle w-fit">{book.category}</span>
        <p className="line-clamp-3 font-reading text-sm leading-snug text-coffee/80 dark:text-parchment/70">
          {(book.synopsis || '').slice(0, 180)}…
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-dashed border-coffee/10 pt-2 text-xs text-coffee/60 dark:border-gold/10 dark:text-parchment/50">
          <span>{book.edition}</span>
          {book.year && <span>{book.year}</span>}
        </div>
      </div>
    </Link>
  )
}
