import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * `base` define donde se publican los assets.
 *
 * En Netlify la app se sirve en la raiz del dominio (demo-arnedolr.netlify.app/),
 * asi que el base es "/". Solo hace falta cambiarlo si el sitio quedara colgando
 * de un subpath, tipo un repo de GitHub Pages en /<repo>/.
 *
 * No se deduce del entorno a proposito: adivinar el base desde el nombre del
 * repo es fragil y el fallo es silencioso (los assets dan 404 y la pagina sale
 * en blanco). Se declara explicito con VITE_BASE, en el panel de Netlify o en
 * un .env.local.
 */
export default defineConfig(({ command, mode }) => {
  // loadEnv con prefijo '' trae tambien variables sin el prefijo VITE_.
  const env = loadEnv(mode, process.cwd(), '')
  const raw = env.VITE_BASE?.trim() || '/'
  const base = raw === '/' ? '/' : raw.replace(/\/$/, '')

  return {
    // En dev siempre en "/", para no arrastrar el base de produccion al local.
    base: command === 'serve' ? '/' : base,
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      open: true,
    },
  }
})
