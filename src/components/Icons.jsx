import React from 'react'

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const IconSun = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const IconMoon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)

export const IconClose = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const IconBook = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M20 18v3H6.5A2.5 2.5 0 0 1 4 18.5" />
  </svg>
)

export const IconLayers = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="m12 2 9 5-9 5-9-5 9-5z" />
    <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
  </svg>
)

export const IconLink = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
  </svg>
)

export const IconCopy = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
)

export const IconExternal = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

export const IconGoodreads = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M11.4 0C8 0 5.6 1.8 5.6 5c0 3.3 2.4 5 5.6 5 2 0 3.6-1 4.4-2.6h.1v2.3c0 2.6-1.2 4.3-3.9 4.3-1.7 0-3-.7-3.4-2.2H6c.4 2.7 2.7 4.2 5.6 4.2 4.3 0 6.3-2.6 6.3-6.7V.3h-2v2.2h-.1C15 1 13.4 0 11.4 0zm.2 1.9c2.3 0 3.9 1.6 3.9 4S13.9 10 11.6 10 7.8 8.3 7.8 5.9s1.5-4 3.8-4z" />
  </svg>
)

export const IconStore = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3 9 4.5 4h15L21 9M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M9 20v-6h6v6" />
  </svg>
)

export const IconEye = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
)

export const IconMail = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const IconArrowRight = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconNotebook = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 4h13a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
    <path d="M8 4v16M11 8h5M11 12h5" />
  </svg>
)

export const IconQuill = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M20 4c-7 0-12 4-13.5 10.5L4 20M7 16c4-.5 8-3 9.5-7.5" />
    <path d="M4 20c1-3 1.5-4.5 2.5-5.5" />
  </svg>
)

export const IconWhatsApp = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.94L2 22l5.2-1.5A9.94 9.94 0 1 0 12.04 2zm0 18.1a8.1 8.1 0 0 1-4.1-1.12l-.3-.18-3.06.88.9-3-.2-.31a8.16 8.16 0 1 1 6.76 3.73zm4.52-6.1c-.25-.13-1.47-.72-1.7-.8-.22-.09-.39-.13-.55.12-.16.25-.63.8-.78.97-.14.16-.28.18-.53.06a6.68 6.68 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.55-1.34-.76-1.84-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.13.17 1.73 2.64 4.2 3.7.59.26 1.05.41 1.4.52.6.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
  </svg>
)

export const IconSend = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="m22 2-11 11M22 2 15 22l-4-9-9-4z" />
  </svg>
)
