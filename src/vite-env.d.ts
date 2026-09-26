/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origen publico del sitio, para canonical y Open Graph. Ej: https://0nisolutions.github.io/demo-arnedolr */
  readonly VITE_SITE_ORIGIN?: string
  /** Ruta base de los assets. GitHub Pages cuelga la app de /<repo>/. */
  readonly VITE_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
