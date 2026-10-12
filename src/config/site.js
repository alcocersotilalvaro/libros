// URL canónica del sitio (sin «#») para Open Graph y enlaces de compartir.
// Puede sobreescribirse con VITE_SITE_URL en .env (sin barra final).
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://libros-variados.web.app'
).replace(/\/+$/, '')

export function absoluteUrl(path) {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}