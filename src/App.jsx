import React, { useEffect, useMemo, useState } from 'react'
import catalog from './data/catalog.json'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import FilterBar from './components/FilterBar.jsx'
import BookGrid from './components/BookGrid.jsx'
import BookDetail from './components/BookDetail.jsx'
import Articles from './components/Articles.jsx'
import ArticlesPage from './components/ArticlesPage.jsx'
import ArticleView from './components/ArticleView.jsx'
import AboutMe from './components/AboutMe.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import TermsOfUse from './components/TermsOfUse.jsx'
import ContactPage from './components/ContactPage.jsx'
import Footer from './components/Footer.jsx'
import AdBanner from './components/AdBanner.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('biblioteca-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', dark)
    localStorage.setItem('biblioteca-theme', dark ? 'dark' : 'light')
  }, [dark])
  return [dark, () => setDark((d) => !d)]
}

function HomePage({ books, categories }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')

  const counts = useMemo(() => {
    const c = { __all__: books.length }
    for (const b of books) c[b.category] = (c[b.category] || 0) + 1
    return c
  }, [books])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return books.filter((b) => {
      if (category !== 'Todas' && b.category !== category) return false
      if (!q) return true
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.synopsis || '').toLowerCase().includes(q)
      )
    })
  }, [books, query, category])

  return (
    <>
      {/* Hero */}
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-block rounded-full bg-terracotta/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta">
            Plataforma editorial · Biblioteca personal
          </p>
          <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl">
            Un rincón para <span className="text-terracotta">perderse leyendo</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-coffee/70 dark:text-parchment/60">
            Más de mil libros reunidos durante años por un ávido lector, ahora con sinopsis
            extensas, puntos clave de lectura, notas de edición y reseñas escritas a mano.
            Busca un título, filtra por tema y abre la ficha de cualquier obra para leerla aquí mismo.
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </div>
      </section>

      <AdBanner slot="header" className="container-page mb-8" />

      {/* Catálogo */}
      <main id="catalogo" className="container-page scroll-mt-24 pb-14">
        <div className="mb-6 space-y-4">
          <FilterBar
            categories={categories}
            active={category}
            onSelect={setCategory}
            counts={counts}
          />
          <p className="text-sm text-coffee/60 dark:text-parchment/50">
            Mostrando <strong>{filtered.length}</strong>{' '}
            {filtered.length === 1 ? 'libro' : 'libros'}
            {category !== 'Todas' && ` en «${category}»`}
            {query && ` para «${query}»`}
          </p>
        </div>

        <BookGrid books={filtered} />
      </main>

      <Articles />

      <AboutMe />
    </>
  )
}

// Restablece el scroll al cambiar de ruta; respeta anclas internas (/#catalogo)
function ScrollManager() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      const t = setTimeout(() => {
        document
          .getElementById(location.hash.slice(1))
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0 })
  }, [location.pathname, location.hash])
  return null
}

export default function App() {
  const [dark, toggleTheme] = useTheme()
  const books = catalog.books || []
  const categories = catalog.categories || []

  return (
    <div id="top" className="min-h-screen">
      <ScrollManager />
      <Header dark={dark} onToggleTheme={toggleTheme} total={books.length} />
      <Routes>
        <Route path="/" element={<HomePage books={books} categories={categories} />} />
        <Route path="/libro/:id" element={<BookDetail books={books} />} />
        <Route path="/articulos" element={<ArticlesPage />} />
        <Route path="/articulo/:slug" element={<ArticleView books={books} />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/terminos" element={<TermsOfUse />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="*" element={<HomePage books={books} categories={categories} />} />
      </Routes>
      <Footer />
    </div>
  )
}

