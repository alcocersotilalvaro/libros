import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { articleBySlug, ARTICLES } from '../data/articles.js'
import { articleUrl, bookUrl } from '../utils/router.js'
import { IconCopy, IconArrowRight, IconBook, IconQuill } from './Icons.jsx'
import AdBanner from './AdBanner.jsx'

function fmtDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Renderiza el cuerpo del artículo: array `paragraphs` (esquema real) o
// texto plano con subtítulos "## " como alternativa.
function Prose({ paragraphs, content }) {
  const blocks = Array.isArray(paragraphs) ? paragraphs : (content || '').split(/\n\n+/)
  return (
    <div className="prose-article">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="mt-8 font-serif text-xl font-bold text-ink dark:text-parchment">
              {block.slice(3)}
            </h2>
          )
        }
        return (
          <p key={i} className="mt-4 font-reading text-[17px] leading-[1.8] text-coffee/90 dark:text-parchment/80">
            {block}
          </p>
        )
      })}
    </div>
  )
}

export default function ArticleView({ books }) {
  const { slug } = useParams()
  const article = articleBySlug(slug)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (article) document.title = `${article.title} · La Biblioteca de Álvaro`
    return () => {
      document.title = 'La Biblioteca de Álvaro | Catálogo, reseñas y lectura en línea'
    }
  }, [article])

  if (!article) {
    return (
      <main className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">Artículo no encontrado</h1>
        <p className="mx-auto mt-3 max-w-md text-coffee/70 dark:text-parchment/60">
          Puede que el enlace haya cambiado o que el artículo se haya retirado.
        </p>
        <Link
          to="/articulos"
          className="mt-6 inline-block rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-terracotta/90"
        >
          Ver todos los artículos
        </Link>
      </main>
    )
  }

  const relatedBook = article.related
    ? books.find((b) => b.id === article.related.id) || null
    : null
  const others = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* noop */
    }
  }

  return (
    <main className="container-page py-10">
      <article className="mx-auto max-w-3xl">
        <header>
          <div className="flex flex-wrap items-center gap-2 text-xs text-coffee/50 dark:text-parchment/40">
            <span className="chip chip-idle">{article.category}</span>
            <time dateTime={article.date}>{fmtDate(article.date)}</time>
            <span>· {article.readMinutes} min de lectura</span>
            <span>· Por Álvaro Alcocer Sotil</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">{article.title}</h1>
          <p className="mt-3 font-reading text-lg italic text-coffee/70 dark:text-parchment/60">
            {article.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 border-y border-coffee/10 py-3 dark:border-gold/10">
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full bg-parchment/80 px-4 py-2 text-sm font-medium text-coffee transition hover:bg-parchment dark:bg-nightcard dark:text-parchment/80"
            >
              <IconCopy className="h-4 w-4" />
              {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
            </button>
            <Link
              to="/articulos"
              className="text-sm font-medium text-coffee/70 hover:text-terracotta dark:text-parchment/60 dark:hover:text-gold"
            >
              ← Todos los artículos
            </Link>
          </div>
        </header>

        <Prose paragraphs={article.paragraphs} content={article.content} />

        <AdBanner slot="inline" className="my-8" />

        {relatedBook && (
          <aside className="mt-8 rounded-2xl border border-gold/25 bg-gradient-to-br from-parchment/70 to-cream p-6 dark:border-gold/15 dark:from-nightcard dark:to-night">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta dark:text-gold">
              <IconBook className="h-4 w-4" /> Libro relacionado
            </p>
            <div className="mt-3 flex items-center gap-4">
              <span
                className="grid h-20 w-14 shrink-0 place-items-center rounded-sm shadow-spine"
                style={{ backgroundImage: 'linear-gradient(135deg, hsl(28 45% 32%), hsl(28 45% 22%))' }}
              >
                <IconBook className="h-6 w-6 text-white/80" />
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-bold">{relatedBook.title}</h3>
                <p className="text-sm text-coffee/70 dark:text-parchment/60">{relatedBook.author}</p>
                <p className="mt-1 line-clamp-2 text-sm text-coffee/60 dark:text-parchment/50">
                  {relatedBook.synopsis || relatedBook.summary || ''}
                </p>
                <Link
                  to={bookUrl(relatedBook)}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:underline dark:text-gold"
                >
                  Ver ficha y leer en el visor <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        )}

        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold">
            <IconQuill className="h-5 w-5 text-terracotta" /> Sigue leyendo
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {others.map((a) => (
              <Link
                key={a.slug}
                to={articleUrl(a.slug)}
                className="group rounded-xl border border-coffee/10 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:shadow-book dark:border-gold/10 dark:bg-nightcard/70"
              >
                <span className="text-xs text-coffee/50 dark:text-parchment/40">{a.category}</span>
                <h3 className="mt-1 font-serif font-bold leading-snug group-hover:text-terracotta dark:group-hover:text-gold">
                  {a.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

      </article>
    </main>
  )
}
