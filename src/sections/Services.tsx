import { Building, Check, KeyRound, MapPin } from 'lucide-react'
import { SERVICES } from '../data/site'
import { Reveal, SectionHeading, Stagger, StaggerItem } from '../components/Motion'

const ICONS = [Building, KeyRound, MapPin]

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-24 bg-cream py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Qué hacemos"
          title={
            <>
              Comprar, vender
              <br className="hidden sm:block" /> o alquilar en Salta.
            </>
          }
          lead="Publicamos cada propiedad con fotos, medidas y precio de referencia. Si algo no lo sabemos, te lo decimos."
        />

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" gap={0.1}>
          {SERVICES.map((s, i) => {
            const Icon = ICONS[i]
            return (
              <StaggerItem key={s.slug}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-4xl bg-white p-7 ring-1 ring-ink/8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-lift-lg hover:ring-clay-200">
                  {/* Número gigante de fondo */}
                  <span aria-hidden className="pointer-events-none absolute -top-4 right-4 font-display text-[5.5rem] leading-none text-ink/4 transition-colors duration-500 group-hover:text-clay-100">
                    0{i + 1}
                  </span>

                  <span className="relative grid h-13 w-13 place-items-center rounded-2xl bg-clay-50 text-clay-500 transition-colors duration-500 group-hover:bg-brand-gradient group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.7} />
                  </span>

                  <h3 className="relative mt-6 text-[1.35rem] leading-snug text-ink">{s.title}</h3>

                  <p className="relative mt-3 text-[0.95rem] leading-relaxed text-graphite">
                    {s.blurb}
                  </p>

                  <ul className="relative mt-6 flex flex-wrap gap-2 border-t border-ink/8 pt-5">
                    {s.points.map((pt) => (
                      <li
                        key={pt}
                        className="inline-flex items-center gap-1.5 rounded-full bg-ink/4 px-3 py-1 text-[0.76rem] font-semibold text-ink/70"
                      >
                        <Check className="h-3 w-3 text-clay-500" strokeWidth={3} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </article>
              </StaggerItem>
            )
          })}
        </Stagger>

        <Reveal delay={0.2} className="mt-10 text-center">
          <p className="text-[0.9rem] text-graphite">
            ¿No sabés por dónde empezar?{' '}
            <a
              href={`mailto:arnedolr@gmail.com?subject=${encodeURIComponent('Consulta sobre servicios')}`}
              className="font-semibold text-clay-600 underline decoration-clay-300 underline-offset-4 transition-colors hover:text-clay-700"
            >
              Escribinos y te contamos qué hay disponible.
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
