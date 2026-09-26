import { useEffect } from 'react'
import { assetUrl } from '../lib/assets'

interface SeoProps {
  title: string
  description: string
  /** Ruta canónica relativa, ej. "/propiedad/casa-el-tipal". */
  path?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

/**
 * Origen del sitio, para canonical y Open Graph.
 *
 * En GitHub Pages la app vive bajo /<repo>/, asi que el origen NO se puede
 * hardcodear: se toma de VITE_SITE_ORIGIN y, si no esta, del propio
 * window.location. Asi el mismo build sirve para el repo y para un dominio propio.
 */
const ORIGIN = (
  import.meta.env.VITE_SITE_ORIGIN?.trim() || window.location.origin
).replace(/\/$/, '')

function upsertMeta(selector: string, attrs: Record<string, string>): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Seteo de metadatos por ruta. Reemplaza a react-helmet-async, que no
 * soporta React 19. Para un SPA alcanza con manipular document.head.
 */
export function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    // El canonical necesita el base: en Pages la URL real es
    // ORIGIN/demo-arnedolr/propiedad/x, no ORIGIN/propiedad/x.
    const url = `${ORIGIN}${import.meta.env.BASE_URL || '/'}${path.replace(/^\/+/, '')}`
    const fullTitle = path === '/' ? title : `${title} · ARNEDO LR`

    document.title = fullTitle

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex, nofollow' : 'index, follow',
    })

    upsertLink('canonical', url)

    const ogImage = image ?? `${ORIGIN}${assetUrl('/og-default.png')}`

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' })
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'es_AR' })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'ARNEDO LR' })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage })
  }, [title, description, path, image, type, noindex])

  return null
}
