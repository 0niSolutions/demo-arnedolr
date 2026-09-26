import { Link } from 'react-router-dom'
import type { ComponentProps, ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/* Botones                                                             */
/* ------------------------------------------------------------------ */

type Variant = 'primary' | 'dark' | 'outline' | 'outlineDark' | 'ghost' | 'whatsapp'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-cta-gradient text-white shadow-lift hover:shadow-lift-lg hover:brightness-105 active:brightness-95',
  dark: 'bg-bark-800 text-cream hover:bg-bark-700 active:bg-bark-900 shadow-lift',
  // Sobre superficies claras: texto y borde oscuros.
  outline:
    'border-2 border-bark-800/15 text-bark-900 hover:border-bark-800/40 hover:bg-bark-800/5',
  // Sobre superficies oscuras (hero, banners). `outline` arriba seria ilegible.
  outlineDark: 'border-2 border-cream/30 text-cream hover:border-cream/60 hover:bg-cream/10',
  ghost: 'text-bark-800 hover:bg-bark-800/6',
  whatsapp: 'bg-signal-700 text-white shadow-lift hover:bg-signal-600 active:bg-signal-600',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.82rem] gap-1.5',
  md: 'h-11 px-5 text-[0.9rem] gap-2',
  lg: 'h-13 px-7 text-[0.98rem] gap-2.5',
}

/**
 * Nota: BASE fija `inline-flex`. Tailwind resuelve la especificidad por orden en
 * el stylesheet, no por orden en el atributo class, asi que un `hidden`
 * pasado por className NO le gana a este `inline-flex`.
 * Para ocultar responsive, envolvé el boton: `<span className="hidden sm:block">`.
 */
const BASE =
  'group relative inline-flex items-center justify-center rounded-full font-bold tracking-[0.01em] whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50'

function classes(variant: Variant, size: Size, className = '') {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`
}

interface Common {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  /** Estela que se expande en hover. */
  sheen?: boolean
}

function Sheen() {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
      <span className="absolute -inset-y-8 -left-1/2 w-1/2 -rotate-12 bg-white/25 blur-md transition-all duration-700 ease-out group-hover:left-[130%]" />
    </span>
  )
}

/** Boton interno (button) o externo (a) segun props. */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  sheen = true,
  ...rest
}: Common & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {sheen && <Sheen />}
      <span className="relative flex items-center gap-[inherit]">{children}</span>
    </button>
  )
}

/** Boton que navega dentro de la app. */
export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  sheen = true,
}: Common & { to: string }) {
  return (
    <Link to={to} className={classes(variant, size, className)}>
      {sheen && <Sheen />}
      <span className="relative flex items-center gap-[inherit]">{children}</span>
    </Link>
  )
}

/** Boton que abre un link externo en otra pestana. */
export function ButtonAnchor({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  sheen = true,
  external = true,
  onClick,
}: Common & {
  href: string
  external?: boolean
  onClick?: () => void
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={classes(variant, size, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {sheen && <Sheen />}
      <span className="relative flex items-center gap-[inherit]">{children}</span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Chips y etiquetas                                                   */
/* ------------------------------------------------------------------ */

export function Badge({
  children,
  tone = 'clay',
  className = '',
}: {
  children: ReactNode
  tone?: 'clay' | 'ember' | 'dark' | 'light' | 'signal'
  className?: string
}) {
  const tones = {
    clay: 'bg-clay-50 text-clay-700 ring-clay-200/70',
    // El badge va sobre la imagen de la propiedad, que es variable: necesita fondo
  // casi opaco. Con `bg-ember-400/15` el texto daba 2.61:1 sobre el artwork oscuro.
  ember: 'bg-bark-950/90 text-ember-400 ring-ember-400/40',
    dark: 'bg-bark-900/85 text-cream ring-cream/15',
    light: 'bg-cream/90 text-ink ring-ink/10',
    signal: 'bg-signal-500/12 text-signal-600 ring-signal-500/30',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-bold tracking-[0.11em] uppercase ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function Pill({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-[0.74rem] font-semibold text-graphite ${className}`}
    >
      {children}
    </span>
  )
}
