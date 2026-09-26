import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Revelado al entrar en viewport. Respeta prefers-reduced-motion:
 * si el usuario lo pide, el contenido aparece sin transformaciones.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
  once = true,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Contenedor que escala la entrada de sus hijos con stagger. */
export function Stagger({
  children,
  className = '',
  gap = 0.08,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  gap?: number
  delay?: number
}) {
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : gap, delayChildren: delay } },
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

/** Encabezado de seccion con eyebrow + titulo + bajada, animado. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'light',
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <Reveal>
          <p
            className={`mb-4 flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.22em] uppercase ${
              align === 'center' ? 'justify-center' : ''
            } ${tone === 'dark' ? 'text-ember-400' : 'text-clay-600'}`}
          >
            <span className="h-px w-7 bg-current opacity-60" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h2
          className={`text-[2rem] leading-[1.08] sm:text-[2.6rem] lg:text-[3.1rem] ${
            tone === 'dark' ? 'text-cream' : 'text-ink'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p
            className={`mt-5 text-[1.02rem] leading-relaxed sm:text-[1.1rem] ${
              tone === 'dark' ? 'text-cream/70' : 'text-graphite'
            }`}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  )
}
