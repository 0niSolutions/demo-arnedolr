import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Bath, BedDouble, Car, MapPin, Maximize, Ruler } from 'lucide-react'
import {
  formatSurface,
  formatUsd,
  propertyPath,
  type Property,
  TYPE_LABEL,
} from '../data/site'
import { PropertyImage } from './PropertyImage'
import { Badge } from './ui'

/** Specs clave que se muestran en la card, filtrados por tipo. */
function CardSpecs({ p }: { p: Property }) {
  const specs: Array<{ icon: React.ReactNode; label: string }> = []

  if (p.builtM2 > 0) {
    specs.push({
      icon: <Maximize className="h-3.5 w-3.5" />,
      label: `${formatSurface(p.builtM2)} cubiertos`,
    })
  }

  if (p.bedrooms > 0) {
    specs.push({
      icon: <BedDouble className="h-3.5 w-3.5" />,
      label: `${p.bedrooms} hab.`,
    })
  }

  if (p.bathrooms > 0) {
    specs.push({
      icon: <Bath className="h-3.5 w-3.5" />,
      label: `${p.bathrooms} baños`,
    })
  }

  specs.push({ icon: <Ruler className="h-3.5 w-3.5" />, label: formatSurface(p.totalM2) })

  if (p.garage) {
    specs.push({ icon: <Car className="h-3.5 w-3.5" />, label: 'Cochera' })
  }

  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[0.78rem] text-graphite">
      {specs.map((s) => (
        <li key={s.label} className="flex items-center gap-1.5">
          <span className="text-clay-400">{s.icon}</span>
          {s.label}
        </li>
      ))}
    </ul>
  )
}

interface Props {
  property: Property
  /** Anima la entrada con stagger dentro de un <Stagger>. */
  index?: number
  compact?: boolean
}

export function PropertyCard({ property: p, compact = false }: Props) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full"
    >
      <Link
        to={propertyPath(p)}
        className="flex h-full flex-col overflow-hidden rounded-4xl bg-white ring-1 ring-ink/8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-lift-lg hover:ring-clay-300/60"
        /* En el original ninguna card era clickeable. Acá toda la card es el CTA. */
        aria-label={`Ver ficha de ${p.title} en ${p.neighborhood}`}
      >
        {/* Artwork */}
        <div className="relative overflow-hidden">
          <PropertyImage
            property={p}
            className={compact ? 'aspect-[4/3]' : 'aspect-[4/3] sm:aspect-[16/11]'}
          >
            <div className="flex w-full items-end justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="light">{TYPE_LABEL[p.type]}</Badge>
                {p.featured && (
                  <Badge tone="ember">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    Destacada
                  </Badge>
                )}
              </div>
            </div>
          </PropertyImage>

          {/* Brillo que entra en hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center gap-1.5 text-[0.76rem] font-medium text-stone">
            <MapPin className="h-3.5 w-3.5" />
            {p.neighborhood}, {p.city}
          </div>

          <h3 className="mt-2 text-[1.22rem] leading-snug font-semibold text-ink transition-colors duration-300 group-hover:text-clay-600">
            {p.title}
          </h3>

          <CardSpecs p={p} />

          {/* Precio al pie, siempre visible */}
          <div className="mt-5 flex items-end justify-between gap-3 border-t border-ink/8 pt-4">
            <div>
              <p className="text-[0.68rem] font-bold tracking-[0.14em] text-stone uppercase">
                Precio referencial
              </p>
              <p className="mt-0.5 text-[1.32rem] leading-none font-bold text-ink">
                {formatUsd(p.priceUsd)}
              </p>
            </div>

            <span className="inline-flex items-center gap-1 text-[0.8rem] font-bold text-clay-600 transition-transform duration-300 group-hover:translate-x-1">
              Ver ficha
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
