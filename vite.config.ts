import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * `base` define donde se publican los assets.
 *
 * En GitHub Pages la app cuelga de /<repo>/ y no de la raiz, asi que el base tiene
 * que incluir el nombre del repo. Se lee de VITE_BASE y, si no esta, se deduce de
 * la variable GITHUB_REPOSITORY que inyecta Actions. Un repo llamado
 * USUARIO.github.io publica en la raiz, y ahi el base queda en "/".
 *
 * Ojo: un base relativo ("./") no sirve, porque las rutas del SPA son anidadas
 * (/propiedad/casa-el-tipal) y los assets relativos se resolverian contra
 * /propiedad/. Tiene que ser absoluto.
 */
function resolveBase(env: Record<string, string | undefined>): string {
  const explicit = env.VITE_BASE?.trim()
  if (explicit) return explicit === '/' ? '/' : explicit.replace(/\/$/, '')

  const repo = env.GITHUB_REPOSITORY?.trim() // "usuario/repo"
  if (repo) {
    const name = repo.split('/')[1] ?? ''
    // Los repos de usuario u organizacion publican en la raiz del dominio.
    if (!name || name.toLowerCase().endsWith('.github.io')) return '/'
    return `/${name}`
  }

  return '/'
}

const base = resolveBase(process.env)

export default defineConfig(({ command }) => ({
  // En dev siempre en "/", para no arrastrar el base de Pages al host local.
  base: command === 'serve' ? '/' : base,
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
}))
