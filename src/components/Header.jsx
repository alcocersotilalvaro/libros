import React from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { IconBook } from './Icons.jsx'

const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/#catalogo', label: 'Catálogo' },
  { to: '/articulos', label: 'Artículos & Reseñas' },
  { to: '/#sobre-mi', label: 'Sobre el curador' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Header({ dark, onToggleTheme, total }) {
  return (
    <header className="sticky top-0 z-30 border-b border-coffee/10 bg-cream/85 backdrop-blur-md
      dark:border-gold/10 dark:bg-night/85">
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-terracotta text-cream shadow-book">
            <IconBook className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-xl font-bold tracking-tight sm:text-2xl">
              La Biblioteca de Álvaro
            </span>
            <span className="block text-xs text-coffee/70 dark:text-parchment/60">
              {total} libros · reseñas y lectura sin fin
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-coffee
                transition hover:bg-parchment/70 dark:text-parchment/80 dark:hover:bg-nightcard"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
        </div>
      </div>

      {/* Navegación móvil */}
      <nav
        className="container-page flex gap-1 overflow-x-auto pb-2 lg:hidden"
        aria-label="Navegación móvil"
      >
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-coffee/80
              transition hover:bg-parchment/70 dark:text-parchment/70 dark:hover:bg-nightcard"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
