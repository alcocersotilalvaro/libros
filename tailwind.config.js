/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Lora', 'Georgia', 'serif'],
        display: ['Cinzel', 'Playfair Display', 'serif'],
        reading: ['Lora', 'Merriweather', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta editorial: papel envejecido, verde bosque, terracota y oro.
        cream: '#FDFBF7',
        parchment: '#F4EFEA',
        ink: '#1C312E',
        coffee: '#8C4A32',
        terracotta: '#8C4A32',
        gold: '#D4A373',
        sage: '#7c8a6a',
        night: '#12201d',
        nightcard: '#1c2b27',
      },
      boxShadow: {
        book: '0 10px 30px -12px rgba(28, 49, 46, 0.35)',
        spine: 'inset 3px 0 0 0 rgba(212, 163, 115, 0.55)',
      },
      backgroundImage: {
        'paper-grain':
          'radial-gradient(circle at 1px 1px, rgba(28,49,46,0.05) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}
