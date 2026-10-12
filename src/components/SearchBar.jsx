import React from 'react'
import { IconSearch, IconClose } from './Icons.jsx'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-coffee/50 dark:text-parchment/40" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busca por título, autor o palabra clave…"
        className="w-full rounded-full border border-coffee/15 bg-white/80 py-3.5 pl-12 pr-11
          text-ink shadow-sm outline-none transition placeholder:text-coffee/40
          focus:border-terracotta focus:ring-2 focus:ring-terracotta/30
          dark:border-gold/15 dark:bg-nightcard/80 dark:text-parchment dark:placeholder:text-parchment/40"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center
            rounded-full text-coffee/50 transition hover:bg-parchment dark:text-parchment/50 dark:hover:bg-night"
        >
          <IconClose className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
