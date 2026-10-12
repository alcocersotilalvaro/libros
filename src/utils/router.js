/**
 * Constructores de rutas limpias (BrowserRouter de react-router-dom).
 * Las vistas se registran en src/App.jsx y Firebase Hosting reescribe
 * cualquier ruta profunda a /index.html (ver firebase.json), de modo que
 * las redes sociales pueden resolver /libro/<id> sin el símbolo «#».
 */

export function bookUrl(book) {
  return `/libro/${book.id}`
}

export function articleUrl(slug) {
  return `/articulo/${slug}`
}
