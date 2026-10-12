import React from 'react'
import { Link } from 'react-router-dom'
import { IconQuill } from './Icons.jsx'

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-xl font-bold text-ink dark:text-parchment">{title}</h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-coffee/85 dark:text-parchment/75">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPolicy() {
  return (
    <main className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta dark:text-gold">
          <IconQuill className="h-4 w-4" /> Legal
        </p>
        <h1 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Política de Privacidad</h1>
        <p className="mt-2 text-sm text-coffee/60 dark:text-parchment/50">
          Última actualización: septiembre de 2026 · Aplicable a lalibreriadealvaro (Firebase Hosting)
        </p>
        <p className="mt-5 font-reading leading-relaxed text-coffee/85 dark:text-parchment/75">
          Esta Política de Privacidad describe cómo «La Biblioteca de Álvaro» (en adelante, «el
          sitio»), administrado por Álvaro Alcocer Sotil, trata la información de sus visitantes.
          Al usar el sitio aceptas las prácticas aquí descritas.
        </p>
        <Section title="1. Información que recopilamos">
          <p>
            <strong>Datos que tú nos proporcionas:</strong> cuando publicas un comentario o envías
            el formulario de contacto podemos pedirte tu nombre y correo electrónico (opcionales) y
            el contenido del mensaje. Estos datos se usan únicamente para mostrar el comentario o
            responderte.
          </p>
          <p>
            <strong>Almacenamiento local:</strong> los comentarios publicados se guardan
            localmente en tu navegador (localStorage) y no se transmiten a un servidor, salvo la
            notificación por correo que recibe el administrador del sitio.
          </p>
          <p>
            <strong>Datos automáticos:</strong> como ocurre en la mayoría de los sitios web, el
            alojamiento (Firebase Hosting, de Google) puede registrar datos técnicos como tipo de
            navegador, páginas visitadas y duración de la visita con fines de seguridad y
            rendimiento.
          </p>
        </Section>

        <Section title="2. Cookies y publicidad de Google AdSense">
          <p>
            Este sitio muestra anuncios mediante <strong>Google AdSense</strong>. Google y sus
            socios pueden usar cookies —incluida la cookie <em>DoubleClick DART</em>— para servir
            anuncios basados en tus visitas anteriores a este y otros sitios web.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              El uso de la cookie DART permite a Google mostrar anuncios personalizados según tus
              intereses, basándose en tus visitas a este sitio y a otros sitios de Internet.
            </li>
            <li>
              Puedes desactivar la publicidad personalizada visitando{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-terracotta hover:underline dark:text-gold"
              >
                Configuración de anuncios de Google
              </a>
              .
            </li>
            <li>
              También puedes optar por no participar en cookies de terceros para publicidad en{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-terracotta hover:underline dark:text-gold"
              >
                aboutads.info/choices
              </a>{' '}
              o{' '}
              <a
                href="https://www.youronlinechoices.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-terracotta hover:underline dark:text-gold"
              >
                youronlinechoices.com
              </a>
              .
            </li>
            <li>
              Para usuarios del Espacio Económico Europeo y del Reino Unido, Google muestra un
              aviso de consentimiento conforme a sus políticas; tus preferencias pueden gestionarse
              desde dicho aviso en cualquier momento.
            </li>
          </ul>
          <p>
            Consulta las políticas de Google para más detalle:{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-terracotta hover:underline dark:text-gold"
            >
              policies.google.com/technologies/ads
            </a>
            .
          </p>
        </Section>

        <Section title="3. Uso de la información">
          <p>
            La información se usa para: operar y mejorar el sitio, publicar y moderar comentarios,
            responder consultas de contacto y medir de forma agregada el uso del sitio. Nunca
            vendemos ni alquilamos datos personales a terceros.
          </p>
        </Section>

        <Section title="4. Servicios de terceros">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Google AdSense:</strong> servicios de publicidad (ver sección 2).
            </li>
            <li>
              <strong>Firebase Hosting (Google):</strong> alojamiento estático del sitio.
            </li>
            <li>
              <strong>EmailJS:</strong> envío del formulario de contacto y de las notificaciones de
              comentarios al correo del administrador. EmailJS solo usa los datos para entregar el
              mensaje.
            </li>
            <li>
              <strong>Google Drive:</strong> alojamiento de los archivos PDF que se muestran en el
              visor de lectura integrado.
            </li>
          </ul>
          <p>Cada proveedor tiene su propia política de privacidad, que te recomendamos leer.</p>
        </Section>

        <Section title="5. Derechos del usuario">
          <p>
            Puedes eliminar los comentarios que hayas publicado desde el propio sitio (botón
            «Eliminar» bajo cada comentario) o borrar el almacenamiento local de tu navegador. Si
            enviaste un mensaje por el formulario de contacto y deseas que eliminemos tus datos,
            escríbenos desde la página de contacto y lo atenderemos a la brevedad.
          </p>
        </Section>

        <Section title="6. Privacidad de los menores">
          <p>
            El sitio está dirigido al público general. No recopilamos de forma consciente datos de
            menores de 13 años. Si crees que un menor nos ha proporcionado datos, contáctanos para
            eliminarlos.
          </p>
        </Section>

        <Section title="7. Cambios en esta política">
          <p>
            Podemos actualizar esta política ocasionalmente; publicaremos cualquier cambio en esta
            misma página con la fecha de «última actualización» revisada. El uso continuado del
            sitio tras dichos cambios implica la aceptación de la política revisada.
          </p>
        </Section>

        <p className="mt-10 border-t border-coffee/10 pt-6 text-sm text-coffee/60 dark:border-gold/10 dark:text-parchment/50">
          ¿Dudas sobre esta política? Escríbenos desde la página de{' '}
          <Link to="/contacto" className="font-semibold text-terracotta hover:underline dark:text-gold">
            contacto
          </Link>{' '}
          o revisa los{' '}
          <Link to="/terminos" className="font-semibold text-terracotta hover:underline dark:text-gold">
            Términos de Uso
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
