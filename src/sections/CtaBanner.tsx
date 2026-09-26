import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { CONTACT, officeMapLink, waLink } from '../data/site'
import { Reveal } from '../components/Motion'
import { ButtonAnchor } from '../components/ui'

export function CtaBanner() {
  return (
    <section className="bg-cream py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <div className="bg-noise relative overflow-hidden rounded-5xl bg-bark-900 px-6 py-14 text-center sm:px-12 lg:py-20">
            <div
              className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-50 blur-[100px]"
              style={{ background: 'radial-gradient(circle, #CB5B3B 0%, transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-2xl">
              <p className="text-[0.7rem] font-bold tracking-[0.22em] text-ember-400 uppercase">
                Hablemos
              </p>

              <h2 className="mt-5 text-[2.1rem] leading-[1.08] text-cream sm:text-[2.9rem]">
                ¿Buscás algo puntual
                <br className="hidden sm:block" /> o querés que lo busquemos nosotros?
              </h2>

              <p className="mx-auto mt-5 max-w-lg text-[1rem] leading-relaxed text-cream/65">
                Decinos qué buscás y te armamos una búsqueda a medida. También podés pasar por la
                oficina o pedir una tasación gratuita de tu propiedad.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <ButtonAnchor
                  href={waLink(
                    'Hola ARNEDO LR, quiero hacerles una consulta sobre una búsqueda a medida.',
                  )}
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  Consultar por WhatsApp
                </ButtonAnchor>

                <ButtonAnchor
                  href={`tel:${CONTACT.phones[0].raw}`}
                  variant="outline"
                  size="lg"
                  sheen={false}
                  className="border-cream/25 text-cream hover:border-cream/50 hover:bg-cream/8"
                >
                  <Phone className="h-4 w-4" />
                  Llamar ahora
                </ButtonAnchor>
              </div>

              {/* Contacto directo */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-cream/12 pt-8 text-[0.85rem] text-cream/60">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream"
                >
                  <Mail className="h-3.5 w-3.5 text-clay-400" />
                  {CONTACT.email}
                </a>

                <a
                  href={officeMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream"
                >
                  <MapPin className="h-3.5 w-3.5 text-clay-400" />
                  {CONTACT.address}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
