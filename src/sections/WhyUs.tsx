import { motion, useReducedMotion } from 'framer-motion'
import { Eye, KeyRound, MapPin, Users } from 'lucide-react'
import { CONTACT, PROPERTIES, ZONES, ZONE_COUNTS, officeMapLink } from '../data/site'
import { Reveal, SectionHeading, Stagger, StaggerItem } from '../components/Motion'

const PILLARS = [
  {
    icon: Eye,
    title: 'Precios a la vista',
    text: 'Publicamos el valor de cada propiedad. Vos filtrás por lo que podés pagar, no por lo que podemos filtrar.',
  },
  {
    icon: KeyRound,
    title: 'Ficha completa de cada una',
    text: 'Fotos, medidas, ubicación y precio en un solo lugar. Sin links que te dejan a medias.',
  },
  {
    icon: Users,
    title: 'Escribinos directo',
    text: 'WhatsApp, teléfono o email. No hay formularios de 12 campos ni respuestas automáticas.',
  },
]

const ZONE_LIST = ZONES

export function WhyUs() {
  const reduce = useReducedMotion()
  const zonas = [...ZONE_LIST, ...ZONE_LIST]

  return (
    <section id="nosotros" className="scroll-mt-24 overflow-hidden bg-sand py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Por qué ARNEDO LR"
              title={
                <>
                  Una inmobiliaria
                  <br className="hidden sm:block" /> que se lee de una sentada.
                </>
              }
              lead="Armamos este sitio con una regla simple: si algo sirve para que decidas, está en pantalla. Si no, no está."
            />

            <Stagger className="mt-12 space-y-7" gap={0.09}>
              {PILLARS.map((p) => (
                <StaggerItem key={p.title}>
                  <div className="flex gap-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-clay-500 shadow-lift">
                      <p.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="text-[1.12rem] text-ink">{p.title}</h3>
                      <p className="mt-1.5 text-[0.94rem] leading-relaxed text-graphite">{p.text}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Zonas del catalogo + datos */}
          <div className="lg:pt-4">
            <Reveal>
              <figure className="relative overflow-hidden rounded-4xl bg-bark-900 p-8 text-cream sm:p-10">
                <div
                  className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-40 blur-[80px]"
                  style={{ background: 'radial-gradient(circle, #FF914D 0%, transparent 70%)' }}
                />
                <MapPin className="relative h-7 w-7 text-clay-400" strokeWidth={1.8} />

                <figcaption className="relative mt-5">
                  <p className="font-display text-[1.35rem] leading-snug text-cream sm:text-[1.5rem]">
                    Dónde hay propiedades ahora
                  </p>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-cream/70">
                    {ZONE_COUNTS.length} zonas de Salta con propiedades cargadas en este momento.
                  </p>
                </figcaption>

                <ul className="relative mt-7 grid grid-cols-2 gap-x-5 gap-y-2.5 border-t border-cream/12 pt-6">
                  {ZONE_COUNTS.map(([zona, n]) => (
                    <li key={zona} className="flex items-baseline justify-between gap-2 text-[0.9rem]">
                      <span className="truncate text-cream/80">{zona}</span>
                      <span className="shrink-0 font-semibold text-ember-400 tabular-nums">{n}</span>
                    </li>
                  ))}
                </ul>
              </figure>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white p-5 ring-1 ring-ink/8">
                  <p className="font-display text-[2rem] leading-none text-clay-500">
                    {PROPERTIES.length}
                  </p>
                  <p className="mt-1.5 text-[0.78rem] text-graphite">fichas con precio y medidas</p>
                </div>
                <a
                  href={officeMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-3xl bg-white p-5 ring-1 ring-ink/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-clay-300"
                >
                  <p className="font-display text-[2rem] leading-none text-bark-800">Salta</p>
                  <p className="mt-1.5 text-[0.78rem] text-graphite transition-colors group-hover:text-clay-600">
                    {CONTACT.address} ↗
                  </p>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Marquee de zonas */}
      <div className="mt-20 border-y border-ink/8 py-5">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
            {zonas.map((z, i) => (
              <span key={`${z}-${i}`} className="flex shrink-0 items-center gap-10">
                <span className="font-display text-[1.5rem] whitespace-nowrap text-ink/60">
                  {z}
                </span>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-clay-400/60" />
              </span>
            ))}
          </div>
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10" aria-hidden="true">
            {zonas.map((z, i) => (
              <span key={`dup-${z}-${i}`} className="flex shrink-0 items-center gap-10">
                <span className="font-display text-[1.5rem] whitespace-nowrap text-ink/60">
                  {z}
                </span>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-clay-400/60" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {!reduce && (
        <motion.div className="sr-only" aria-hidden="true">
          Zones covered: {ZONES.join(', ')}
        </motion.div>
      )}
    </section>
  )
}
