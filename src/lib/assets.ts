/**
 * Rutas de archivos de public/.
 *
 * Vite no reescribe a mano lo que uno escribe en el codigo: un "/logo.webp"
 * queda "/logo.webp" en el bundle, sin el base. En GitHub Pages, donde la app
 * vive en /<repo>/, eso da 404 y sale el logo o la foto rota.
 *
 * Ojo con la barra: BASE_URL no esta garantizado que termine en "/". Si el base
 * es "/demo-arnedolr" y se concatena directo, sale "/demo-arnedolrlogo.webp".
 * Por eso se normaliza en vez de asumir.
 */
const BASE = import.meta.env.BASE_URL || '/'
const BASE_WITH_SLASH = BASE.endsWith('/') ? BASE : `${BASE}/`

export function assetUrl(path: string): string {
  return `${BASE_WITH_SLASH}${path.replace(/^\/+/, '')}`
}
