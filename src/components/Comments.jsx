import React, { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, isEmailConfigured } from '../config/emailjs.js'
import { SITE_URL } from '../config/site.js'

// Sistema de comentarios ligero con persistencia en Web Storage (localStorage)
// y notificación automática por email (EmailJS) al publicar un comentario.
// Para sincronizar entre dispositivos, ver el adaptador opcional de Firebase
// Firestore documentado en el README.

const STORAGE_KEY = 'biblioteca-comentarios'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

async function notifyByEmail({ name, email, book, message }) {
  if (!isEmailConfigured()) return
  const params = {
    to_email: EMAILJS_CONFIG.toEmail,
    subject: `💬 Nuevo comentario en tu biblioteca: ${book.title}`,
    from_name: name,
    from_email: email,
    book_title: book.title,
    book_edition: book.edition || '',
    comment: message,
    link: `${SITE_URL}/libro/${book.id}`,
  }
  try {
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, params, {
      publicKey: EMAILJS_CONFIG.publicKey,
    })
  } catch (err) {
    console.error('No se pudo enviar la notificación por email:', err)
  }
}

export default function Comments({ book }) {
  const bookId = book.id
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const all = loadAll()
    setComments(all[bookId] || [])
  }, [bookId])

  async function submit(e) {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) return
    if (email && !EMAIL_RE.test(email.trim())) {
      setStatus('Introduce un correo válido o déjalo vacío.')
      return
    }
    const entry = {
      id: Date.now(),
      name: name.trim() || 'Lector anónimo',
      email: email.trim(),
      message: trimmed,
      date: new Date().toISOString(),
    }
    const all = loadAll()
    const list = [entry, ...(all[bookId] || [])]
    all[bookId] = list
    saveAll(all)
    setComments(list)
    setMessage('')

    setStatus('Publicando…')
    await notifyByEmail({ name: entry.name, email: entry.email, book, message: trimmed })
    setStatus(isEmailConfigured() ? '¡Comentario publicado! Se notificó por correo.' : '¡Comentario publicado!')
    setTimeout(() => setStatus(''), 3500)
  }

  function remove(id) {
    const all = loadAll()
    const list = (all[bookId] || []).filter((c) => c.id !== id)
    all[bookId] = list
    saveAll(all)
    setComments(list)
  }

  return (
    <div>
      <h4 className="font-serif text-lg font-bold">
        Comentarios <span className="text-coffee/50 dark:text-parchment/40">({comments.length})</span>
      </h4>

      <form onSubmit={submit} className="mt-3 space-y-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className="w-full rounded-lg border border-coffee/15 bg-white/80 px-3 py-2 text-sm outline-none
              focus:border-terracotta dark:border-gold/15 dark:bg-night/60 dark:text-parchment"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo (opcional)"
            className="w-full rounded-lg border border-coffee/15 bg-white/80 px-3 py-2 text-sm outline-none
              focus:border-terracotta dark:border-gold/15 dark:bg-night/60 dark:text-parchment"
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Comparte tu opinión sobre esta lectura…"
          rows={3}
          className="w-full resize-none rounded-lg border border-coffee/15 bg-white/80 px-3 py-2 text-sm outline-none
            focus:border-terracotta dark:border-gold/15 dark:bg-night/60 dark:text-parchment"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-cream
              transition hover:bg-terracotta/90 disabled:opacity-50"
            disabled={!message.trim()}
          >
            Publicar comentario
          </button>
          {status && (
            <span className="text-xs text-coffee/60 dark:text-parchment/50">{status}</span>
          )}
        </div>
      </form>

      <ul className="mt-4 space-y-3">
        {comments.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-coffee/10 bg-parchment/40 p-3 dark:border-gold/10 dark:bg-night/40"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-coffee dark:text-parchment">{c.name}</span>
              <span className="text-xs text-coffee/50 dark:text-parchment/40">
                {new Date(c.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <p className="mt-1 text-sm text-coffee/80 dark:text-parchment/70">{c.message}</p>
            <button
              onClick={() => remove(c.id)}
              className="mt-1 text-xs text-terracotta/80 hover:text-terracotta"
            >
              Eliminar
            </button>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="py-4 text-center text-sm text-coffee/50 dark:text-parchment/40">
            Sé el primero en comentar esta lectura.
          </li>
        )}
      </ul>
    </div>
  )
}
