import React from 'react'
import { IconSun, IconMoon } from './Icons.jsx'

export default function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
      className="grid h-10 w-10 place-items-center rounded-full bg-parchment/70 text-coffee
        transition hover:bg-parchment dark:bg-nightcard dark:text-gold dark:hover:bg-nightcard/70"
    >
      {dark ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
    </button>
  )
}
