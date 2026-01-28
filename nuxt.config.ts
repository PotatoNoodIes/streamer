export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    server: {
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 30500,
        clientPort: 30500
      }
    }
  },
  
  devServer: {
    host: '0.0.0.0',
    port: 3000
  }
});
