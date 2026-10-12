// Configuración de EmailJS para las notificaciones de comentarios por correo.
//
// Rellena estos valores (o define las variables VITE_EMAILJS_* en un archivo
// .env, ver .env.example). Si quedan vacíos, los comentarios se seguirán
// guardando pero NO se enviará email.
//
// Obtén los valores en https://dashboard.emailjs.com:
//   1. Email Services -> conecta tu Gmail (alcocersotilalvaro@gmail.com) -> Service ID
//   2. Email Templates -> crea una plantilla (ver README) -> Template ID
//   3. Account -> API Keys -> Public Key

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  // Destinatario de las notificaciones
  toEmail: 'alcocersotilalvaro@gmail.com',
}

export const isEmailConfigured = () =>
  Boolean(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey)
