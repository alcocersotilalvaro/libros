import React, { useEffect, useRef } from 'react'

const ADSENSE_CLIENT = 'ca-pub-6918837555415416'

/**
 * Bloque de anuncio adaptable de Google AdSense con presentación editorial.
 * Posiciones soportadas: "header", "inline" y "footer" (cada una puede tener
 * su propio slot vía VITE_ADSENSE_SLOT_HEADER / _INLINE / _FOOTER; si no,
 * se usa el slot común VITE_ADSENSE_SLOT).
 * Sin slot configurado no renderiza nada: evita unidades vacías que Google
 * penaliza y mantiene la página limpia durante la revisión de AdSense.
 */
const SLOTS = {
  header: import.meta.env.VITE_ADSENSE_SLOT_HEADER || import.meta.env.VITE_ADSENSE_SLOT || '',
  inline: import.meta.env.VITE_ADSENSE_SLOT_INLINE || import.meta.env.VITE_ADSENSE_SLOT || '',
  footer: import.meta.env.VITE_ADSENSE_SLOT_FOOTER || import.meta.env.VITE_ADSENSE_SLOT || '',
}

const STYLES = {
  header: 'rounded-2xl border border-dashed border-gold/25 bg-parchment/40 dark:border-gold/15 dark:bg-nightcard/40',
  inline: 'rounded-2xl border border-gold/20 bg-white/70 shadow-book dark:border-gold/15 dark:bg-nightcard/60',
  footer: 'rounded-2xl border border-coffee/10 bg-parchment/40 dark:border-gold/10 dark:bg-night/60',
}

export default function AdBanner({ slot = 'inline', className = '', label = 'Publicidad' }) {
  const insRef = useRef(null)
  const pushed = useRef(false)
  const adSlot = SLOTS[slot] || ''

  useEffect(() => {
    if (!adSlot || pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense aún no cargado o bloqueado por el navegador; se ignora.
    }
  }, [adSlot])

  if (!adSlot) return null

  return (
    <aside className={`${STYLES[slot] || STYLES.inline} px-4 py-3 ${className}`} aria-label="Bloque publicitario">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-coffee/40 dark:text-parchment/30">
        {label}
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  )
}
