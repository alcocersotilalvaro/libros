import React, { useEffect, useRef } from 'react'

const ADSENSE_CLIENT = 'ca-pub-6918837555415416'
const ADSENSE_SLOT = import.meta.env.VITE_ADSENSE_SLOT || ''

/**
 * Bloque de anuncio nativo y discreto de Google AdSense.
 * No renderiza nada si aún no se configuró un slot (evita errores de AdSense
 * por unidades de anuncio inexistentes).
 */
export default function AdSlot({ className = '', label = 'Publicidad' }) {
  const insRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!ADSENSE_SLOT || pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense aún no cargado o bloqueado por el navegador; se ignora.
    }
  }, [])

  if (!ADSENSE_SLOT) return null

  return (
    <div
      className={`rounded-2xl border border-dashed border-coffee/15 bg-parchment/40 p-3
        dark:border-gold/15 dark:bg-nightcard/40 ${className}`}
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-coffee/40 dark:text-parchment/30">
        {label}
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
