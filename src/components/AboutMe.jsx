import React from 'react'
import { Link } from 'react-router-dom'
import { IconGoodreads, IconStore, IconQuill, IconArrowRight } from './Icons.jsx'

export default function AboutMe() {
  return (
    <section
      id="sobre-mi"
      className="container-page scroll-mt-24 py-14"
    >
      <div className="overflow-hidden rounded-3xl border border-coffee/10 bg-white/70 shadow-book dark:border-gold/10 dark:bg-nightcard/70">
        <div className="grid gap-6 p-8 md:grid-cols-3 md:p-10">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-terracotta text-cream shadow-book">
              <span className="font-serif text-4xl font-black">AA</span>
            </span>
            <h2 className="mt-4 font-serif text-2xl font-bold">Álvaro Alcocer Sotil</h2>
            <p className="text-sm text-coffee/60 dark:text-parchment/50">
              Ávido lector · Curador de esta biblioteca
            </p>
          </div>

          <div className="md:col-span-2">
            <h3 className="flex items-center gap-2 font-serif text-xl font-bold">
              <IconQuill className="h-5 w-5 text-terracotta" /> Sobre el curador
            </h3>
            <p className="mt-3 leading-relaxed text-coffee/80 dark:text-parchment/70">
              Soy un ávido lector convencido de que cada libro es una puerta a otro mundo. Esta
              biblioteca personal reúne, a lo largo de los años, las lecturas que me han formado,
              conmovido y desafiado: desde la literatura y la filosofía hasta la ciencia, la
              historia y el desarrollo personal.
            </p>
            <p className="mt-3 leading-relaxed text-coffee/80 dark:text-parchment/70">
              Más que un catálogo, es un diario de lectura: cada ejemplar lleva su sinopsis, sus
              puntos clave y una nota sobre la edición concreta que conservo —traducciones,
              colecciones y aparato crítico incluidos—. En la sección de{' '}
              <Link to="/articulos" className="font-semibold text-terracotta underline-offset-4 hover:underline dark:text-gold">
                artículos y reseñas
              </Link>{' '}
              comparto ensayos más largos sobre los temas que atraviesan estos libros. La
              comparto con la ilusión de que encuentres aquí tu próxima gran lectura.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://www.goodreads.com/user/show/11858809-alvaro-alcocer-sotil"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#553b08] px-5 py-2.5 text-sm font-semibold text-[#f4f1ea] transition hover:opacity-90"
              >
                <IconGoodreads className="h-5 w-5" />
                Mi perfil en Goodreads
              </a>
              <a
                href="https://listado.mercadolibre.com.pe/_CustId_130995389"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#ffe600] px-5 py-2.5 text-sm font-semibold text-[#2d3277] transition hover:opacity-90"
              >
                <IconStore className="h-5 w-5" />
                Mi catálogo en Mercado Libre
              </a>
              <Link
                to="/articulos"
                className="inline-flex items-center gap-2 rounded-full border border-terracotta/40 px-5 py-2.5 text-sm font-semibold text-terracotta transition hover:bg-terracotta/10 dark:border-gold/40 dark:text-gold"
              >
                Leer los artículos <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
