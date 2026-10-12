import React from 'react'
import { Link } from 'react-router-dom'
import { IconQuill } from './Icons.jsx'

export default function TermsOfUse() {
  return (
    <main className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta dark:text-gold">
          <IconQuill className="h-4 w-4" /> Legal
        </p>
        <h1 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Términos de Uso</h1>
        <p className="mt-2 text-sm text-coffee/60 dark:text-parchment/50">
          Última actualización: septiembre de 2026
        </p>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-ink dark:text-parchment">1. Aceptación</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-coffee/85 dark:text-parchment/75">
            Al acceder y usar «La Biblioteca de Álvaro» aceptas estos Términos de Uso y nuestra
            <Link to="/privacidad" className="font-semibold text-terracotta hover:underline dark:text-gold">
              {' '}Política de Privacidad{' '}
            </Link>
            . Si no estás de acuerdo, por favor no utilices el sitio.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-ink dark:text-parchment">2. Naturaleza del sitio</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-coffee/85 dark:text-parchment/75">
            El sitio es una plataforma editorial personal y sin ánimo de lucro dedicada a compartir
            las lecturas, reseñas y artículos de su curador. El contenido textual (sinopsis,
            análisis, notas de edición, artículos) es original y de autoría propia, salvo que se
            indique lo contrario. Los títulos, autores y datos editoriales se ofrecen con fines
            informativos y de catalogación.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-ink dark:text-parchment">
            3. Propiedad intelectual
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-coffee/85 dark:text-parchment/75">
            Las obras literarias citadas pertenecen a sus respectivos autores y editores. Las
            copias digitales mostradas en el visor corresponden a ejemplares de la biblioteca
            personal del curador con fines de consulta privada. Si eres titular de derechos y
            consideras que algún material vulnera tus derechos, contáctanos y atenderemos tu
            solicitud con diligencia.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-ink dark:text-parchment">4. Uso permitido</h2>
          <ul className="mt-2 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-coffee/85 dark:text-parchment/75">
            <li>Puedes navegar, leer y compartir los enlaces del sitio libremente.</li>
            <li>
              No está permitido usar contenido del sitio (reseñas, artículos, fichas) para
              entrenar sistemas automatizados de respuesta ni republicarlo masivamente sin
              atribución.
            </li>
            <li>
              No está permitido intentar alterar, inhabilitar o sobrecargar el sitio ni extraer
              datos de forma automatizada abusiva (scraping).
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-ink dark:text-parchment">
            5. Comentarios y conducta
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-coffee/85 dark:text-parchment/75">
            Los comentarios son responsabilidad de quien los publica. Se eliminarán aquellos que
            contengan spam, odio, acoso o contenido ilegal. Al publicar un comentario nos concedes
            el derecho a mostrarlo en la página del libro correspondiente.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-ink dark:text-parchment">
            6. Publicidad y enlaces externos
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-coffee/85 dark:text-parchment/75">
            El sitio muestra publicidad de Google AdSense y puede contener enlaces externos
            (Goodreads, Mercado Libre, Google Drive). No controlamos el contenido de dichos sitios
            de terceros y no respondemos por sus prácticas ni sus contenidos.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-ink dark:text-parchment">
            7. Ausencia de garantías y limitación de responsabilidad
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-coffee/85 dark:text-parchment/75">
            El sitio se ofrece «tal cual», sin garantías de disponibilidad o exactitud continua.
            En la máxima medida permitida por la ley, el administrador no será responsable de
            daños indirectos derivados del uso del sitio.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-ink dark:text-parchment">
            8. Cambios y contacto
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-coffee/85 dark:text-parchment/75">
            Podemos modificar estos términos en cualquier momento; la versión vigente estará
            siempre en esta página. Para cualquier consulta, usa la página de{' '}
            <Link to="/contacto" className="font-semibold text-terracotta hover:underline dark:text-gold">
              contacto
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
