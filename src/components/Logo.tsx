import { Link } from 'react-router-dom'
import { assetUrl } from '../lib/assets'

/**
 * Logo ARNEDO LR. El simbolo es el archivo real provisto por el cliente
 * (public/logo.png, 243x187 con alfa). El wordmark sigue en texto para poder
 * ajustar el tracking y el color segun el fondo.
 */
export function Logo({
  tone = 'dark',
  className = '',
  withTagline = false,
}: {
  tone?: 'dark' | 'light'
  className?: string
  withTagline?: boolean
}) {
  const main = tone === 'light' ? 'text-cream' : 'text-bark-900'
  const sub = tone === 'light' ? 'text-cream/50' : 'text-bark-400'

  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="ARNEDO LR — ir al inicio"
    >
      <img
        src={assetUrl('/logo-mark.webp')}
        alt=""
        width={238}
        height={121}
        className="h-7 w-auto shrink-0 transition-transform duration-500 group-hover:scale-105"
      />

      <span className="flex flex-col leading-none">
        <span
          className={`text-[1.02rem] font-bold tracking-[0.24em] transition-colors ${main}`}
        >
          ARNEDO LR
        </span>
        {withTagline && (
          <span className={`mt-1 text-[0.6rem] font-semibold tracking-[0.18em] uppercase ${sub}`}>
            Inmobiliaria · Salta
          </span>
        )}
      </span>
    </Link>
  )
}
