import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Car,
  Check,
  MapPin,
  Maximize,
  MessageCircle,
  Ruler,
  Share2,
} from 'lucide-react'
import {
  formatSurface,
  formatUsd,
  getProperty,
  mapLink,
  PROPERTIES,
  propertyPath,
  TYPE_LABEL,
  waForProperty,
} from '../data/site'
import { Seo } from '../components/Seo'
import { PropertyImage } from '../components/PropertyImage'
import { PropertyCard } from '../components/PropertyCard'
import { Reveal, Stagger, StaggerItem } from '../components/Motion'
import { Badge, ButtonAnchor } from '../components/ui'

const EASE = [0.16, 1, 0.3, 1] as const

export function PropertyDetail() {
  const { slug = '' } = useParams()
  const reduce = useReducedMotion()
  const property = getProperty(slug)

  if (!property) return <Navigate to="/404" replace />

  const p = property

  const specs: Array<{ icon: React.ReactNode; label: string; value: string }> = [
    {
      icon: <Ruler className="h-5 w-5" />,
      label: 'Superficie total',
      value: formatSurface(p.totalM2),
    },
  ]

  if (p.builtM2 > 0) {
    specs.push({
      icon: <Maximize className="h-5 w-5" />,
      label: 'Superficie cubierta',
      value: formatSurface(p.builtM2),
    })
  }
  if (p.bedrooms > 0) {
    specs.push({
      icon: <BedDouble className="h-5 w-5" />,
      label: 'Dormitorios',
      value: `${p.bedrooms}`,
    })
  }
  if (p.bathrooms > 0) {
    specs.push({
      icon: <Bath className="h-5 w-5" />,
      label: 'Baños',
      value: `${p.bathrooms}`,
    })
  }
  specs.push({
    icon: <Car className="h-5 w-5" />,
    label: 'Cochera',
    value: p.garage ? 'Sí' : 'No',
  })

  // Propiedades parecidas: mismo tipo, otras.
  const related = PROPERTIES.filter((x) => x.type === p.type && x.id !== p.id).slice(0, 3)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <>
      <Seo
        title={`${p.title} · ${formatUsd(p.priceUsd)}`}
        description={`${p.title} en ${p.neighborhood}, Salta. ${formatSurface(p.totalM2)} totales, ${p.bedrooms} dormitorios. Precio referencial ${formatUsd(p.priceUsd)}.`}
        path={propertyPath(p)}
        type="article"
      />

      <article className="pt-24 lg:pt-28">
        <div className="container-page">
          {/* Migas */}
          <nav aria-label="Migas de pan" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-[0.82rem] text-graphite">
              <li>
                <Link to="/" className="transition-colors hover:text-clay-600">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true" className="text-stone">
                /
              </li>
              <li>
                <Link
                  to={`/?tipo=${p.type}#propiedades`}
                  className="transition-colors hover:text-clay-600"
                >
                  {TYPE_LABEL[p.type]}s
                </Link>
              </li>
              <li aria-hidden="true" className="text-stone">
                /
              </li>
              <li className="font-semibold text-ink" aria-current="page">
                {p.neighborhood}
              </li>
            </ol>
          </nav>

          {/* Artwork principal */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative overflow-hidden rounded-4xl shadow-lift-lg sm:rounded-5xl"
          >
            <PropertyImage property={p} className="aspect-[16/11] sm:aspect-[21/9]">
              <div className="flex h-full w-full flex-col justify-between p-5 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="light">{TYPE_LABEL[p.type]}</Badge>
                  {p.featured && <Badge tone="ember">Destacada</Badge>}
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-bark-950/55 px-3.5 py-1.5 text-[0.8rem] font-medium text-cream backdrop-blur-md">
                    <MapPin className="h-3.5 w-3.5 text-ember-400" />
                    {p.neighborhood}, {p.city}
                  </div>

                  <div className="rounded-2xl bg-cream/95 px-5 py-3 backdrop-blur-md">
                    <p className="text-[0.62rem] font-bold tracking-[0.15em] text-stone uppercase">
                      Precio referencial
                    </p>
                    <p className="font-display text-[1.7rem] leading-none text-ink">
                      {formatUsd(p.priceUsd)}
                    </p>
                  </div>
                </div>
              </div>
            </PropertyImage>
          </motion.div>

          {/* Grilla principal */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
            <div>
              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                className="text-[2.1rem] leading-[1.1] text-ink sm:text-[2.7rem]"
              >
                {p.title}
              </motion.h1>

              <Reveal delay={0.16}>
                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.95rem] text-graphite">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-clay-400" />
                    {p.neighborhood}, {p.city}, Argentina
                  </span>
                </p>
              </Reveal>

              {/* Specs */}
              <Stagger
                className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                gap={0.06}
                delay={0.15}
              >
                {specs.map((s) => (
                  <StaggerItem key={s.label}>
                    <div className="h-full rounded-2xl bg-sand p-4">
                      <span className="text-clay-500">{s.icon}</span>
                      <p className="mt-3 text-[0.7rem] leading-tight text-stone">{s.label}</p>
                      <p className="mt-1 text-[1.02rem] font-bold text-ink">{s.value}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              {/* Descripción */}
              <Reveal delay={0.1} className="mt-10">
                <h2 className="text-[1.45rem] text-ink">Sobre la propiedad</h2>
                <p className="mt-4 text-[1rem] leading-[1.75] text-graphite">{p.description}</p>
              </Reveal>

              {/* Highlights */}
              <Reveal delay={0.16} className="mt-8">
                <h2 className="text-[1.1rem] text-ink">Puntos destacados</h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {p.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-[0.92rem] font-medium text-ink ring-1 ring-ink/8"
                    >
                      <Check className="h-4 w-4 shrink-0 text-clay-500" strokeWidth={2.6} />
                      {h}
                    </li>
                  ))}
                </ul>

                {p.priceNote && (
                  <p className="mt-4 rounded-2xl bg-ember-400/12 px-5 py-4 text-[0.9rem] font-medium text-ember-700">
                    {p.priceNote}
                  </p>
                )}
              </Reveal>

              {/* Mapa */}
              <Reveal delay={0.2} className="mt-10">
                <h2 className="text-[1.45rem] text-ink">Ubicación</h2>
                <p className="mt-2 text-[0.92rem] text-graphite">
                  Referencia general de la zona. La ubicación exacta se comparte en la visita.
                </p>

                <a
                  href={mapLink(p.coords)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 block overflow-hidden rounded-4xl ring-1 ring-ink/10 transition-shadow duration-300 hover:shadow-lift-lg"
                >
                  <div className="relative h-64 overflow-hidden bg-sand">
                    {/* Mapa estilizado */}
                    <div
                      className="absolute inset-0 opacity-70"
                      style={{
                        backgroundImage:
                          'linear-gradient(#d9d3ca 1px, transparent 1px), linear-gradient(90deg, #d9d3ca 1px, transparent 1px)',
                        backgroundSize: '38px 38px',
                      }}
                    />
                    <div
                      className="absolute -inset-1/4 opacity-40"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(28deg, #efede9 0 9px, transparent 9px 34px)',
                      }}
                    />
                    {/* Diagonales (calles principales) */}
                    <svg
                      className="absolute inset-0 h-full w-full"
                      aria-hidden="true"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 190 L640 90"
                        stroke="#e6e1d8"
                        strokeWidth="13"
                        fill="none"
                      />
                      <path d="M120 0 L250 300" stroke="#e6e1d8" strokeWidth="9" fill="none" />
                    </svg>

                    {/* Pin */}
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="relative">
                        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-clay-500/45" />
                        <span className="relative grid h-12 w-12 place-items-center rounded-full bg-clay-500 text-white shadow-lift-lg">
                          <MapPin className="h-5 w-5 fill-white" />
                        </span>
                      </div>
                    </div>

                    <div className="absolute right-4 bottom-4 rounded-xl bg-white/95 px-3.5 py-2 text-[0.76rem] font-bold text-ink shadow-lift backdrop-blur transition-colors group-hover:bg-clay-500 group-hover:text-white">
                      Abrir en Google Maps ↗
                    </div>
                  </div>
                </a>
              </Reveal>
            </div>

            {/* Sidebar de contacto */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                className="rounded-4xl bg-bark-900 p-7 text-cream shadow-lift-lg"
              >
                <p className="text-[0.68rem] font-bold tracking-[0.18em] text-ember-400 uppercase">
                  {TYPE_LABEL[p.type]} en {p.neighborhood}
                </p>

                <p className="mt-4 font-display text-[2.2rem] leading-none text-cream">
                  {formatUsd(p.priceUsd)}
                </p>
                <p className="mt-2 text-[0.76rem] text-cream/45">
                  Valor de referencia para la demo. Confirmá el precio vigente con la agencia.
                </p>

                <div className="mt-7 space-y-2.5">
                  <ButtonAnchor href={waForProperty(p)} variant="whatsapp" size="lg" className="w-full">
                    <MessageCircle className="h-5 w-5 fill-current" />
                    Consultar por WhatsApp
                  </ButtonAnchor>

                  <ButtonAnchor
                    href={mapLink(p.coords)}
                    variant="outline"
                    size="md"
                    sheen={false}
                    className="w-full border-cream/25 text-cream hover:border-cream/50 hover:bg-cream/8"
                  >
                    Ver ubicación en el mapa
                  </ButtonAnchor>
                </div>

                <p className="mt-6 border-t border-cream/12 pt-5 text-[0.82rem] leading-relaxed text-cream/55">
                  El mensaje de WhatsApp ya viene con el nombre de la propiedad, así que nos
                  ahorrás la primera pregunta.
                </p>

                {/* Compartir */}
                <div className="mt-5 flex items-center gap-2 border-t border-cream/12 pt-5">
                  <span className="inline-flex items-center gap-1.5 text-[0.78rem] text-cream/45">
                    <Share2 className="h-3.5 w-3.5" />
                    Compartir
                  </span>
                  <a
                    href={`https://wa.me/?send?text=${encodeURIComponent(`${p.title} — ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto rounded-full border border-cream/20 px-3 py-1 text-[0.75rem] font-semibold text-cream/75 transition-colors hover:border-signal-500/60 hover:text-signal-500"
                  >
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(shareUrl)}
                    className="rounded-full border border-cream/20 px-3 py-1 text-[0.75rem] font-semibold text-cream/75 transition-colors hover:border-cream/50 hover:text-cream"
                  >
                    Copiar link
                  </button>
                </div>
              </motion.div>

              <Link
                to="/#propiedades"
                className="mt-5 inline-flex items-center gap-2 text-[0.88rem] font-semibold text-graphite transition-colors hover:text-clay-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a todas las propiedades
              </Link>
            </aside>
          </div>

          {/* Relacionadas */}
          {related.length > 0 && (
            <section className="mt-20 border-t border-ink/8 pt-16">
              <h2 className="text-[1.7rem] text-ink">
                Otras {TYPE_LABEL[p.type].toLowerCase()}s en Salta
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <PropertyCard key={r.id} property={r} compact />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  )
}
