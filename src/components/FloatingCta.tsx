import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp, MessageCircle } from 'lucide-react'
import { waLink } from '../data/site'

/**
 * Boton flotante de WhatsApp + volver arriba.
 *
 * En el sitio original el unico CTA vivia en el hero, arriba de todo. Cuando el
 * usuario llegaba a la propiedad 12 y le gustaba, tenía que scrollear de vuelta.
 * Acá el CTA acompaña todo el scroll.
 */
export function FloatingCta() {
  const [show, setShow] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setShow(y > 520)
      setAtTop(y < 520)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {/* Volver arriba */}
      <AnimatePresence>
        {!atTop && (
          <motion.button
            type="button"
            key="to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            aria-label="Volver arriba"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-bark-900/90 text-cream shadow-lift backdrop-blur transition-colors hover:bg-bark-800"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp */}
      <AnimatePresence>
        {show && (
          <motion.a
            key="wa-fab"
            href={waLink('Hola ARNEDO LR, quiero consultar por una propiedad.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto group relative grid h-14 w-14 place-items-center rounded-full bg-signal-700 text-white shadow-lift-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-signal-600"
          >
            {/* Pulso */}
            <span className="animate-pulse-ring absolute inset-0 rounded-full bg-signal-500/50" />
            <MessageCircle className="relative h-6 w-6 fill-white" />

            {/* Tooltip desktop */}
            <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-bark-900 px-4 py-2 text-[0.8rem] font-semibold whitespace-nowrap text-cream opacity-0 shadow-lift transition-opacity duration-300 group-hover:opacity-100 lg:block">
              Escribinos
            </span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  )
}
