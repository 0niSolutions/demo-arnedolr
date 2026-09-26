import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import {
  PROPERTIES,
  TYPE_LABEL,
  TYPE_PLURAL,
  formatUsd,
  type PropertyType,
} from '../data/site'
import { PropertyCard } from './PropertyCard'
import { Button } from './ui'

const TYPE_ORDER: PropertyType[] = ['casa', 'departamento', 'galpon', 'campo', 'terreno']

type SortKey = 'destacadas' | 'precio-asc' | 'precio-desc' | 'superficie'

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: 'destacadas', label: 'Destacadas' },
  { key: 'precio-asc', label: 'Precio: menor a mayor' },
  { key: 'precio-desc', label: 'Precio: mayor a menor' },
  { key: 'superficie', label: 'Mayor superficie' },
]

/** Rango de precio en USD, en pasos redondos. */
const PRICE_BANDS = [
  { id: 'todas', label: 'Cualquier precio', min: 0, max: Infinity },
  { id: 'hasta-100', label: 'Hasta USD 100.000', min: 0, max: 100000 },
  { id: '100-200', label: 'USD 100.000 – 200.000', min: 100000, max: 200001 },
  { id: '200-300', label: 'USD 200.000 – 300.000', min: 200000, max: 300001 },
  { id: 'mas-300', label: 'Más de USD 300.000', min: 300000, max: Infinity },
]

function useZonas() {
  return useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of PROPERTIES) counts.set(p.neighborhood, (counts.get(p.neighborhood) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [])
}

export function PropertyGrid() {
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState<SortKey>('destacadas')
  const [openFilters, setOpenFilters] = useState(false)
  const zonas = useZonas()
  const reduce = useReducedMotion()

  // Los filtros viven en la URL -> el footer puede linkear ?tipo=casa y funciona.
  const tipo = (params.get('tipo') as PropertyType | null) ?? null
  const zona = params.get('zona')
  const banda = params.get('precio') ?? 'todas'

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || value === '' || value === 'todas' || value === 'todas-las-zonas') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === banda) ?? PRICE_BANDS[0]

    const filtered = PROPERTIES.filter((p) => {
      if (tipo && p.type !== tipo) return false
      if (zona && p.neighborhood !== zona) return false
      if (p.priceUsd < band.min || p.priceUsd > band.max) return false
      return true
    })

    const sorted = [...filtered]
    switch (sort) {
      case 'precio-asc':
        sorted.sort((a, b) => a.priceUsd - b.priceUsd)
        break
      case 'precio-desc':
        sorted.sort((a, b) => b.priceUsd - a.priceUsd)
        break
      case 'superficie':
        sorted.sort((a, b) => b.totalM2 - a.totalM2)
        break
      default:
        sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    }
    return sorted
  }, [tipo, zona, banda, sort])

  const activeCount = (tipo ? 1 : 0) + (zona ? 1 : 0) + (banda !== 'todas' ? 1 : 0)

  const clearAll = () => setParams(new URLSearchParams(), { replace: true })

  return (
    <div>
      {/* Controles */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filtros rapidos por tipo */}
        <div className="no-scrollbar -mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1">
          <FilterChip active={!tipo} onClick={() => setParam('tipo', null)}>
            Todas
            <span className="ml-1.5 opacity-55">{PROPERTIES.length}</span>
          </FilterChip>

          {TYPE_ORDER.map((t) => {
            const n = PROPERTIES.filter((p) => p.type === t).length
            if (n === 0) return null
            return (
              <FilterChip
                key={t}
                active={tipo === t}
                onClick={() => setParam('tipo', tipo === t ? null : t)}
              >
                {TYPE_PLURAL[t]}
                <span className="ml-1.5 opacity-55">{n}</span>
              </FilterChip>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          sheen={false}
          onClick={() => setOpenFilters((v) => !v)}
          aria-expanded={openFilters}
          className="shrink-0"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtros
          {activeCount > 0 && (
            <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-clay-500 px-1 text-[0.62rem] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {/* Panel de filtros */}
      <AnimatePresence initial={false}>
        {openFilters && (
          <motion.div
            key="filters"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-5 rounded-4xl bg-white p-5 ring-1 ring-ink/8 sm:grid-cols-2 sm:p-6">
              <div>
                <label
                  htmlFor="f-zona"
                  className="block text-[0.7rem] font-bold tracking-[0.16em] text-stone uppercase"
                >
                  Zona
                </label>
                <select
                  id="f-zona"
                  value={zona ?? ''}
                  onChange={(e) => setParam('zona', e.target.value || null)}
                  className="mt-2.5 h-11 w-full cursor-pointer rounded-xl border border-ink/12 bg-cream px-3.5 text-[0.9rem] font-medium text-ink transition-colors hover:border-ink/25"
                >
                  <option value="">Todas las zonas</option>
                  {zonas.map(([z, n]) => (
                    <option key={z} value={z}>
                      {z} ({n})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="f-precio"
                  className="block text-[0.7rem] font-bold tracking-[0.16em] text-stone uppercase"
                >
                  Precio
                </label>
                <select
                  id="f-precio"
                  value={banda}
                  onChange={(e) => setParam('precio', e.target.value)}
                  className="mt-2.5 h-11 w-full cursor-pointer rounded-xl border border-ink/12 bg-cream px-3.5 text-[0.9rem] font-medium text-ink transition-colors hover:border-ink/25"
                >
                  {PRICE_BANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <span className="block text-[0.7rem] font-bold tracking-[0.16em] text-stone uppercase">
                  Ordenar por
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {SORTS.map((s) => (
                    <FilterChip
                      key={s.key}
                      active={sort === s.key}
                      onClick={() => setSort(s.key)}
                      small
                    >
                      {s.label}
                    </FilterChip>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resumen + limpiar */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.9rem] text-graphite">
          <span className="font-bold text-ink">{results.length}</span>{' '}
          {results.length === 1 ? 'propiedad' : 'propiedades'}
          {tipo && <> en {TYPE_LABEL[tipo].toLowerCase() + 's'}</>}
          {zona && (
            <>
              {' '}
              en <span className="font-semibold text-ink">{zona}</span>
            </>
          )}
        </p>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.82rem] font-semibold text-clay-600 transition-colors hover:bg-clay-50"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <EmptyState onClear={clearAll} />
      ) : (
        <motion.div
          key={`${tipo}-${zona}-${banda}-${sort}`}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {results.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </motion.div>
      )}

      <p className="mt-8 text-center text-[0.78rem] text-stone">
        Precios de referencia para la demo, no oficiales de la agencia.
        Rango del catálogo: {formatUsd(145000)} – {formatUsd(340000)}.
      </p>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
  small = false,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  small?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
        small ? 'px-3.5 py-1.5 text-[0.78rem]' : 'px-4 py-2.5 text-[0.85rem]'
      } ${
        active
          ? 'bg-bark-900 text-cream shadow-lift'
          : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:bg-ink/5 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-6 rounded-4xl border border-dashed border-ink/15 bg-white/50 px-6 py-16 text-center">
      <p className="font-display text-2xl text-ink">Sin resultados</p>
      <p className="mx-auto mt-2 max-w-sm text-[0.92rem] text-graphite">
        No hay propiedades que combinen esos filtros. Probá Ampliar el rango de precio o quitar
        el filtro de zona.
      </p>
      <Button variant="outline" size="sm" className="mt-6" onClick={onClear} sheen={false}>
        Limpiar filtros
      </Button>
    </div>
  )
}
