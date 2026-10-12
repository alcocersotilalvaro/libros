import React from 'react'
import BookCard from './BookCard.jsx'
import AdBanner from './AdBanner.jsx'

const AD_EVERY = 12

export default function BookGrid({ books }) {
  if (books.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-coffee/20 py-20 text-center dark:border-gold/20">
        <p className="font-serif text-2xl">No se encontraron libros</p>
        <p className="mt-2 text-sm text-coffee/60 dark:text-parchment/50">
          Prueba con otra búsqueda o cambia de categoría.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book, i) => (
        <React.Fragment key={book.id}>
          <BookCard book={book} />
          {(i + 1) % AD_EVERY === 0 && i + 1 < books.length && (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-5">
              <AdBanner slot="inline" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
