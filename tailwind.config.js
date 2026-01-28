/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Kick/Twitch inspired palette
        streamer: {
          bg: '#0E0E10',      // Deep charcoal/Rich black
          card: '#18181B',    // Slightly lighter
          border: '#26262C',  // Subtle border
          accent: '#53FC18',  // Kick Green
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark", "luxury"], // Premium feel
  },
}
