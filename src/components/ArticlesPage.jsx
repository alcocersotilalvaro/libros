import React from 'react'
import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/articles.js'
import { articleUrl } from '../utils/router.js'
import { IconQuill, IconArrowRight } from './Icons.jsx'
import AdBanner from './AdBanner.jsx'

function fmtDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ArticlesPage() {
  return (
    <main className="container-page py-10">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta dark:text-gold">
        <IconQuill className="h-4 w-4" /> Diario de lectura
      </p>
      <h1 className="mt-1 font-serif text-4xl font-black">Artículos y reseñas</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-coffee/70 dark:text-parchment/60">
        Aquí escribo sobre lo que leo: ensayos sobre literatura, ciencia, historia y hábitos de
        lectura, siempre conectados con los ejemplares de la biblioteca. Cada artículo enlaza con
        la ficha del libro relacionado, donde puedes leer su sinopsis y abrir el visor.
      </p>

      <AdBanner slot="inline" className="my-8" />

      <div className="grid gap-5 md:grid-cols-2">
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            to={articleUrl(a.slug)}
            className="group flex flex-col rounded-2xl border border-coffee/10 bg-white/70 p-6 shadow-book
              transition hover:-translate-y-1 hover:shadow-xl dark:border-gold/10 dark:bg-nightcard/70"
          >
            <div className="flex items-center gap-2 text-xs text-coffee/50 dark:text-parchment/40">
              <span className="chip chip-idle">{a.category}</span>
              <time dateTime={a.date}>{fmtDate(a.date)}</time>
            </div>
            <h2 className="mt-3 font-serif text-xl font-bold leading-snug group-hover:text-terracotta dark:group-hover:text-gold">
              {a.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-coffee/70 dark:text-parchment/60">
              {a.excerpt}
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-terracotta dark:text-gold">
              Leer artículo <IconArrowRight className="h-4 w-4" />
              <span className="ml-auto font-normal text-xs text-coffee/50 dark:text-parchment/40">
                {a.readMinutes} min
              </span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
