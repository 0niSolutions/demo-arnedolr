import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { Logo } from './Logo'
import { CONTACT, waLink } from '../data/site'
import { ButtonAnchor } from './ui'

const LINKS = [
  { label: 'Propiedades', to: '/#propiedades' },
  { label: 'Servicios', to: '/#servicios' },
  { label: 'Nosotros', to: '/#nosotros' },
  { label: 'Contacto', to: '/#contacto' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del body con el menu abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-bark-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-cream"
      >
        Saltar al contenido
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled || open
            ? 'border-b border-ink/8 bg-cream/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
          <Logo tone={scrolled || open ? 'dark' : 'light'} withTagline={scrolled} />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
            {LINKS.map((l) => (
              <a
                key={l.to}
                href={l.to}
                className={`group relative rounded-full px-4 py-2 text-[0.88rem] font-semibold transition-colors duration-300 ${
                  scrolled ? 'text-ink/70 hover:text-ink' : 'text-cream/80 hover:text-cream'
                }`}
              >
                <span className="relative z-10">{l.label}</span>
                <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-clay-500 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Wrappers: `hidden sm:block` sobre el padre, porque un `hidden`
                directo en el boton no le gana al `inline-flex` de BASE. */}
            <span className="hidden sm:block">
              <ButtonAnchor
                href={`tel:${CONTACT.phones[0].raw}`}
                variant="ghost"
                size="sm"
                className={
                  scrolled ? 'text-ink/70 hover:text-ink' : 'text-cream/80 hover:text-cream'
                }
                sheen={false}
              >
                <Phone className="h-3.5 w-3.5" />
                {CONTACT.phones[0].display}
              </ButtonAnchor>
            </span>

            <span className="hidden sm:block">
              <ButtonAnchor
                href={waLink('Hola ARNEDOLR, quiero consultar por una propiedad.')}
                size="sm"
              >
                Contactarme
              </ButtonAnchor>
            </span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              className={`grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden ${
                scrolled || open
                  ? 'text-ink hover:bg-ink/8'
                  : 'text-cream hover:bg-cream/12'
              }`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[4.5rem] z-40 origin-top border-b border-ink/8 bg-cream/97 backdrop-blur-xl lg:hidden"
          >
            <nav className="container-page flex flex-col py-4" aria-label="Menú móvil">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={reduce ? false : { opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.4 }}
                >
                  <a
                    href={l.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-ink/6 py-4 text-lg font-semibold text-ink last:border-0"
                  >
                    {l.label}
                    <span className="text-clay-400">→</span>
                  </a>
                </motion.div>
              ))}

              <div className="mt-4 grid gap-2.5">
                <ButtonAnchor
                  href={waLink('Hola ARNEDOLR, quiero consultar por una propiedad.')}
                  onClick={() => setOpen(false)}
                >
                  Contactarme por WhatsApp
                </ButtonAnchor>
                <ButtonAnchor
                  href={`tel:${CONTACT.phones[0].raw}`}
                  variant="outline"
                  sheen={false}
                  onClick={() => setOpen(false)}
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT.phones[0].display}
                </ButtonAnchor>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Restaura el scroll al top en cada cambio de ruta. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      //Deja que el DOM pinte antes de scrollear al ancla.
      const t = window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      }, 60)
      return () => window.clearTimeout(t)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
