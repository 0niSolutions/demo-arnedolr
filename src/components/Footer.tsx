import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { CONTACT, officeMapLink, PROPERTIES, TYPE_PLURAL, waLink } from '../data/site'
import { Logo } from './Logo'
import { Reveal } from './Motion'

const ZONAS = ['San Lorenzo', 'Centro', 'Tres Cerritos', 'El Tipal', 'Zona Norte', 'Lerma']

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-bark-950 text-cream">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-10">
          {/* Marca */}
          <Reveal>
            <div>
              <Logo tone="light" withTagline />
              <p className="mt-5 max-w-xs text-[0.92rem] leading-relaxed text-cream/60">
                Inmobiliaria en Salta. Compra, venta, alquiler y tasaciones con acompañamiento
                real, de punta a punta.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {CONTACT.social.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-cream/15 px-3.5 py-1.5 text-[0.78rem] font-semibold text-cream/75 transition-all duration-300 hover:border-ember-500/50 hover:text-ember-400"
                  >
                    {s.name} <span className="text-cream/60">{s.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Propiedades */}
          <Reveal delay={0.08}>
            <div>
              <h3 className="text-[0.7rem] font-bold tracking-[0.2em] text-ember-400 uppercase">
                Buscar
              </h3>
              <ul className="mt-5 space-y-2.5">
                {(['casa', 'departamento', 'galpon', 'campo', 'terreno'] as const).map((t) => (
                  <li key={t}>
                    <Link
                      to={`/?tipo=${t}#propiedades`}
                      className="group inline-flex items-center gap-2 text-[0.92rem] text-cream/65 transition-colors hover:text-cream"
                    >
                      <span className="h-1 w-1 rounded-full bg-clay-500 transition-all duration-300 group-hover:w-3" />
                      {TYPE_PLURAL[t]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Zonas */}
          <Reveal delay={0.16}>
            <div>
              <h3 className="text-[0.7rem] font-bold tracking-[0.2em] text-ember-400 uppercase">
                Zonas
              </h3>
              <ul className="mt-5 space-y-2.5">
                {ZONAS.map((z) => (
                  <li key={z}>
                    <Link
                      to={`/?zona=${encodeURIComponent(z)}#propiedades`}
                      className="group inline-flex items-center gap-2 text-[0.92rem] text-cream/65 transition-colors hover:text-cream"
                    >
                      <span className="h-1 w-1 rounded-full bg-clay-500 transition-all duration-300 group-hover:w-3" />
                      {z}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contacto */}
          <Reveal delay={0.24}>
            <div id="contacto" className="scroll-mt-28">
              <h3 className="text-[0.7rem] font-bold tracking-[0.2em] text-ember-400 uppercase">
                Contactanos
              </h3>

              <ul className="mt-5 space-y-4 text-[0.92rem]">
                {/* Teléfonos: en el original eran texto plano, sin tel: */}
                {CONTACT.phones.map((p) => (
                  <li key={p.raw}>
                    <a
                      href={`tel:${p.raw}`}
                      className="group flex items-start gap-3 text-cream/70 transition-colors hover:text-cream"
                    >
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-clay-400" />
                      <span className="border-b border-transparent transition-colors group-hover:border-cream/40">
                        {p.display}
                      </span>
                    </a>
                  </li>
                ))}

                {/* Email: en el original era texto plano, sin mailto: */}
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="group flex items-start gap-3 text-cream/70 transition-colors hover:text-cream"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-clay-400" />
                    <span className="border-b border-transparent transition-colors group-hover:border-cream/40">
                      {CONTACT.email}
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href={officeMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-cream/70 transition-colors hover:text-cream"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-clay-400" />
                    <span>
                      {CONTACT.addressShort}
                      <span className="mt-0.5 block text-[0.78rem] text-cream/60 transition-colors group-hover:text-cream">
                        Ver en el mapa ↗
                      </span>
                    </span>
                  </a>
                </li>

                <li className="flex items-start gap-3 text-cream/70">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-clay-400" />
                  <span>
                    {CONTACT.hours.days}
                    <span className="mt-0.5 block text-cream/50">{CONTACT.hours.time}</span>
                  </span>
                </li>
              </ul>

              <a
                href={waLink('Hola ARNEDO LR, quiero consultar por una propiedad.')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-11 items-center gap-2.5 rounded-full bg-signal-700 px-5 text-[0.88rem] font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-signal-600"
              >
                Escribinos por WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        {/* Legal */}
        <div className="mt-14 flex flex-col gap-4 border-t border-cream/10 pt-7 text-[0.78rem] text-cream/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {CONTACT.brand}. Todos los derechos reservados.
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>{PROPERTIES.length} propiedades en catálogo</span>
            <span className="hidden h-3 w-px bg-cream/15 md:block" />
            <span>
              Demo de rediseño · precios de referencia, no oficiales
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
