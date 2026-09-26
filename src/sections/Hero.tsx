import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin, MessageCircle, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CONTACT, PROPERTIES, ZONES, waLink } from '../data/site'
import { ButtonAnchor, ButtonLink } from '../components/ui'
import { PropertyImage } from '../components/PropertyImage'

const EASE = [0.16, 1, 0.3, 1] as const

const STATS = [
  { value: `${PROPERTIES.length}`, label: 'propiedades en catálogo' },
  { value: `${ZONES.length}`, label: 'zonas de Salta' },
  { value: '7 días', label: 'atención todos los días' },
]

export function Hero() {
  const reduce = useReducedMotion()
  const featured = PROPERTIES.filter((p) => p.featured).slice(0, 3)

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease: EASE },
        }

  return (
    <section className="bg-noise relative overflow-hidden bg-bark-900 pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Auroras de color de marca */}
      <div
        className="pointer-events-none absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full opacity-45 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #CB5B3B 0%, transparent 68%)' }}
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-40 h-[30rem] w-[30rem] rounded-full opacity-35 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #FF914D 0%, transparent 68%)' }}
      />

      <div className="container-page relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Copy */}
          <div>
            <motion.p
              {...rise(0)}
              className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/6 px-3.5 py-1.5 text-[0.72rem] font-bold tracking-[0.16em] text-cream/80 uppercase backdrop-blur-sm"
            >
              <MapPin className="h-3.5 w-3.5 text-ember-400" />
              Salta, Argentina
            </motion.p>

            <motion.h1
              {...rise(0.1)}
              className="mt-6 text-[2.6rem] leading-[1.02] text-cream sm:text-[3.5rem] lg:text-[4.1rem]"
            >
              Encontrá la casa
              <br />
              que estabas
              <br />
              <span className="text-gradient-brand">esperando.</span>
            </motion.h1>

            <motion.p
              {...rise(0.2)}
              className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-cream/70"
            >
              Casas, departamentos, galpones y terrenos en San Lorenzo, Grand Bourg, Tres Cerritos
              y toda la zona. Te acompañamos de punta a punta, con números claros y sin vueltas.
            </motion.p>

            <motion.div {...rise(0.3)} className="mt-9 flex flex-wrap gap-3">
              <ButtonAnchor
                href={waLink('Hola ARNEDOLR, quiero consultar por una propiedad.')}
                size="lg"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                Quiero contactarme
              </ButtonAnchor>

              <ButtonLink to="/#propiedades" variant="outlineDark" size="lg" sheen={false}>
                Ver propiedades
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
            </motion.div>

            {/* Stats */}
            <motion.dl
              {...rise(0.4)}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-cream/12 pt-8"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-[1.9rem] leading-none text-cream">
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-[0.76rem] leading-snug text-cream/50">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Collage de propiedades destacadas */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={reduce ? false : { opacity: 0, y: 40, rotate: i % 2 ? 4 : -4 }}
                  animate={{ opacity: 1, y: 0, rotate: i % 2 ? 1.5 : -1.5 }}
                  transition={{ duration: 0.9, delay: 0.35 + i * 0.13, ease: EASE }}
                  className={i === 0 ? 'col-span-2' : ''}
                >
                  <Link
                    to={`/propiedad/${p.slug}`}
                    className="group block overflow-hidden rounded-4xl shadow-lift-lg transition-transform duration-500 hover:-translate-y-1.5"
                  >
                    <PropertyImage
                      property={p}
                      className={i === 0 ? 'aspect-[16/10]' : 'aspect-square'}
                    >
                      <div className="flex h-full w-full items-end p-4 sm:p-5">
                        <div className="min-w-0">
                          <p className="text-[0.66rem] font-bold tracking-[0.15em] text-ember-300 uppercase">
                            {p.neighborhood}
                          </p>
                          <p className="mt-1 truncate text-[0.95rem] font-semibold text-cream">
                            {p.title}
                          </p>
                        </div>
                      </div>
                    </PropertyImage>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Badge flotante de confianza */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
              className="animate-float-slow absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-lift-lg sm:-left-8"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-signal-500/12">
                <ShieldCheck className="h-5 w-5 text-signal-600" />
              </span>
              <div className="pr-1">
                <p className="text-[0.85rem] font-bold text-ink">Atención todos los días</p>
                <p className="text-[0.72rem] text-graphite">Lun a Dom · {CONTACT.hours.time}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
