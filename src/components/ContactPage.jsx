import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, isEmailConfigured } from '../config/emailjs.js'
import { IconMail, IconSend } from './Icons.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
  'w-full rounded-lg border border-coffee/15 bg-white/80 px-3 py-2.5 text-sm outline-none transition ' +
  'focus:border-terracotta dark:border-gold/15 dark:bg-night/60 dark:text-parchment'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('') // '', 'sending', 'ok', 'error', texto de validación
  const configured = isEmailConfigured()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      setStatus('Completa tu nombre y el mensaje.')
      return
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setStatus('Introduce un correo electrónico válido.')
      return
    }
    if (!configured) {
      setStatus('El formulario no está configurado todavía; contáctame vía Goodreads.')
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          to_email: EMAILJS_CONFIG.toEmail,
          subject: `📨 Mensaje de contacto de ${form.name.trim()}`,
          from_name: form.name.trim(),
          from_email: form.email.trim(),
          comment: form.message.trim(),
          link: window.location.href,
        },
        { publicKey: EMAILJS_CONFIG.publicKey }
      )
      setStatus('ok')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus(''), 5000)
    } catch (err) {
      console.error('Error al enviar el mensaje:', err)
      setStatus('error')
    }
  }

  return (
    <main className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta dark:text-gold">
          <IconMail className="h-4 w-4" /> Contacto
        </p>
        <h1 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Hablemos de libros</h1>
        <p className="mt-3 font-reading leading-relaxed text-coffee/80 dark:text-parchment/70">
          ¿Sugerencias de lectura, preguntas sobre una edición, colaboraciones o avisos sobre
          derechos? Escríbeme. Leo y respondo todos los mensajes personalmente.
        </p>

        <form
          onSubmit={submit}
          className="mt-8 space-y-3 rounded-2xl border border-coffee/10 bg-white/70 p-6 shadow-book dark:border-gold/10 dark:bg-nightcard/70"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-coffee/60 dark:text-parchment/50">
                Tu nombre *
              </span>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Nombre y apellido"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-coffee/60 dark:text-parchment/50">
                Tu correo *
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="tu@correo.com"
                className={inputClass}
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-coffee/60 dark:text-parchment/50">
              Mensaje *
            </span>
            <textarea
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              rows={5}
              placeholder="Cuéntame en qué puedo ayudarte…"
              className={`${inputClass} resize-none`}
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-sm
                font-semibold text-cream shadow-book transition hover:bg-terracotta/90 disabled:opacity-50"
            >
              <IconSend className="h-4 w-4" />
              {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
            </button>
            <span
              className={`text-sm ${
                status === 'error' || (status && !['ok', 'sending'].includes(status))
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-coffee/60 dark:text-parchment/50'
              }`}
            >
              {status === 'ok'
                ? '¡Mensaje enviado! Te responderé pronto.'
                : status === 'error'
                  ? 'Hubo un error al enviar. Inténtalo de nuevo en unos minutos.'
                  : status || 'Tus datos solo se usan para responderte (ver Política de Privacidad).'}
            </span>
          </div>
        </form>


        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <a
            href="https://www.goodreads.com/user/show/11858809-alvaro-alcocer-sotil"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#553b08] px-4 py-2 font-semibold text-[#f4f1ea] transition hover:opacity-90"
          >
            Goodreads
          </a>
          <a
            href="https://listado.mercadolibre.com.pe/_CustId_130995389"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#ffe600] px-4 py-2 font-semibold text-[#2d3277] transition hover:opacity-90"
          >
            Mercado Libre
          </a>
        </div>
      </div>
    </main>
  )
}
