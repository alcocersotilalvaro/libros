import React from 'react'
import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/articles.js'
import { articleUrl } from '../utils/router.js'
import { IconArrowRight, IconQuill } from './Icons.jsx'

function fmtDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Articles() {
  const latest = ARTICLES.slice(0, 3)

  return (
    <section id="articulos" className="container-page scroll-mt-24 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta dark:text-gold">
            <IconQuill className="h-4 w-4" /> Diario de lectura
          </p>
          <h2 className="mt-1 font-serif text-3xl font-black">Artículos y reseñas</h2>
          <p className="mt-2 max-w-xl text-coffee/70 dark:text-parchment/60">
            Ensayos originales sobre los temas, autores y lecturas que atraviesan esta biblioteca.
          </p>
        </div>
        <Link
          to="/articulos"
          className="hidden shrink-0 items-center gap-1.5 rounded-full border border-terracotta/40 px-4 py-2 text-sm font-semibold text-terracotta transition hover:bg-terracotta/10 dark:border-gold/40 dark:text-gold sm:inline-flex"
        >
          Ver todos <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {latest.map((a) => (
          <Link
            key={a.slug}
            to={articleUrl(a.slug)}
            className="group flex flex-col rounded-2xl border border-coffee/10 bg-white/70 p-6 shadow-book
              transition hover:-translate-y-1 hover:shadow-xl dark:border-gold/10 dark:bg-nightcard/70"
          >
            <span className="chip chip-idle w-fit">{a.category}</span>
            <h3 className="mt-3 font-serif text-lg font-bold leading-snug group-hover:text-terracotta dark:group-hover:text-gold">
              {a.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-coffee/70 dark:text-parchment/60">
              {a.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between pt-4 text-xs text-coffee/50 dark:text-parchment/40">
              <time dateTime={a.date}>{fmtDate(a.date)}</time>
              <span>{a.readMinutes} min de lectura</span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/articulos"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:underline dark:text-gold sm:hidden"
      >
        Ver todos los artículos <IconArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
