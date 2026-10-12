import React from 'react'
import { Link } from 'react-router-dom'
import { IconGoodreads, IconStore } from './Icons.jsx'
import AdBanner from './AdBanner.jsx'

const LEGAL = [
  { to: '/privacidad', label: 'Política de Privacidad' },
  { to: '/terminos', label: 'Términos de Uso' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/articulos', label: 'Artículos & Reseñas' },
]

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-coffee/10 bg-parchment/40 py-8 dark:border-gold/10 dark:bg-night/60">
      <div className="container-page mb-8">
        <AdBanner slot="footer" />
      </div>

      <div className="container-page grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold">La Biblioteca de Álvaro</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-coffee/70 dark:text-parchment/60">
            Plataforma editorial personal: catálogo comentado, reseñas y artículos sobre los libros
            que han marcado a un ávido lector. Hecho en Perú con cariño por cada página.
          </p>
          <p className="mt-3 text-sm text-coffee/60 dark:text-parchment/50">
            © {new Date().getFullYear()} Álvaro Alcocer Sotil
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-coffee/60 dark:text-parchment/50">
            Legal
          </p>
          <ul className="mt-3 space-y-2">
            {LEGAL.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-coffee/80 underline-offset-4 transition hover:text-terracotta hover:underline dark:text-parchment/75 dark:hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-coffee/60 dark:text-parchment/50">
            Sígueme
          </p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href="https://www.goodreads.com/user/show/11858809-alvaro-alcocer-sotil"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Goodreads"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#553b08] text-[#f4f1ea] transition hover:scale-110"
            >
              <IconGoodreads className="h-5 w-5" />
            </a>
            <a
              href="https://listado.mercadolibre.com.pe/_CustId_130995389"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mercado Libre"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#ffe600] text-[#2d3277] transition hover:scale-110"
            >
              <IconStore className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-3 text-sm text-coffee/70 dark:text-parchment/60">
            Reseñas y estantería en Goodreads · libros físicos y coleccionables en Mercado Libre Perú.
          </p>
        </div>
      </div>
    </footer>
  )
}
