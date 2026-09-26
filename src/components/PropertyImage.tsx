import { Building2, House, Layers, Map as MapIcon, Trees } from 'lucide-react'
import type { Property } from '../data/site'
import { assetUrl } from '../lib/assets'

/**
 * Placeholder generado para cada propiedad.
 *
 * El sitio original usaba 72 imagenes reales. Para esta demoAvoidamos URLs
 * externas (se rompen) y generamos una pieza grafica deterministica: cada
 * propiedad tiene su propio degradado, patron e icono, derivados de su `id`.
 *
 * Para produccion: pasar `image` con la URL real y el componente la usa.
 */

const PALETTES: Array<[string, string, string]> = [
  ['#422901', '#7A4A15', '#CB5B3B'],
  ['#1F2A33', '#3D5566', '#FF914D'],
  ['#2E1F26', '#6B3B45', '#E07A57'],
  ['#1A2E27', '#3A6B54', '#FFAB6B'],
  ['#241705', '#8A6435', '#F8F8F0'],
  ['#2A1E17', '#A85D33', '#FFC199'],
]

const ICONS = {
  casa: House,
  departamento: Building2,
  galpon: Layers,
  campo: Trees,
  terreno: MapIcon,
} as const

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

interface Props {
  property: Property
  className?: string
  /** Muestra el precio en el artwork. Default true. */
  showPrice?: boolean
  children?: React.ReactNode
}

export function PropertyImage({ property, className = '', showPrice = true, children }: Props) {
  const h = hash(property.id)
  const [from, via, to] = PALETTES[h % PALETTES.length]
  const Icon = ICONS[property.type]
  const angle = 110 + (h % 7) * 12

  return (
    <div className={`relative overflow-hidden bg-bark-700 ${className}`}>
      {property.image ? (
        <img
          src={assetUrl(property.image)}
          alt={property.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <>
          {/* Degradado de marca, unico por propiedad */}
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `linear-gradient(${angle}deg, ${from} 0%, ${via} 55%, ${to} 130%)` }}
          />

          {/* Patron geométrico sutil: lineas en diagonal */}
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage: `repeating-linear-gradient(${angle + 90}deg, rgba(248,248,240,0.6) 0 1px, transparent 1px 14px)`,
            }}
          />

          {/* Arcos (referencia a la arquitectura de Salta) */}
          <div
            className="absolute -bottom-1/3 -right-1/4 h-[130%] w-[130%] opacity-[0.13]"
            style={{
              backgroundImage:
                'repeating-radial-gradient(circle at 70% 100%, rgba(248,248,240,0.75) 0 1px, transparent 1px 46px)',
            }}
          />

          {/* Icono grande como marca de agua */}
          <Icon
            className="absolute -right-6 -bottom-8 h-52 w-52 text-cream opacity-[0.09]"
            strokeWidth={0.9}
            aria-hidden="true"
          />
        </>
      )}

      {/*
        Vinieta para que el texto del pie se lea. Va FUERA del condicional: con
        foto real hay zonas claras (cielos, paredes) donde el texto cream sobre
        la foto daba 1.01:1. Hay que oscurecer siempre, y mas con foto que con
        el artwork, que es oscuro de por si.
      */}
      <div
        className={
          property.image
            ? 'absolute inset-0 bg-gradient-to-t from-bark-950/90 via-bark-950/45 to-bark-950/15'
            : 'absolute inset-0 bg-gradient-to-t from-bark-950/75 via-transparent to-bark-950/10'
        }
      />

      {showPrice && (
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0">{children}</div>
        </div>
      )}

      {children && !showPrice && <div className="absolute inset-0">{children}</div>}
    </div>
  )
}

/** Hero/OG fallback: artwork ancho para la portada de la ficha. */
export function PropertyArtwork({ property, className = '' }: { property: Property; className?: string }) {
  return <PropertyImage property={property} className={className} showPrice={false} />
}
