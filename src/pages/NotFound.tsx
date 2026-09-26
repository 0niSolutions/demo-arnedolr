import { Link } from 'react-router-dom'
import { Home, MessageCircle } from 'lucide-react'
import { PROPERTIES, waLink } from '../data/site'
import { Seo } from '../components/Seo'
import { ButtonAnchor, ButtonLink } from '../components/ui'
import { PropertyCard } from '../components/PropertyCard'

export function NotFound() {
  return (
    <>
      <Seo
        title="Página no encontrada"
        description="La página que buscás no existe o cambió de dirección."
        path="/404"
        noindex
      />

      <section className="bg-noise relative overflow-hidden bg-bark-900 pt-36 pb-20 lg:pt-44">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-45 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #CB5B3B 0%, transparent 70%)' }}
        />

        <div className="container-page relative text-center">
          <p className="font-display text-[5.5rem] leading-none text-gradient-brand sm:text-[7rem]">
            404
          </p>
          <h1 className="mt-4 text-[1.9rem] leading-tight text-cream sm:text-[2.4rem]">
            Esta dirección no existe
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[1rem] leading-relaxed text-cream/65">
            Puede que la propiedad se haya vendido o que el link esté incompleto. Te dejamos el
            catálogo abajo para que no te quedes sin nada.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/" size="lg">
              <Home className="h-5 w-5" />
              Ir al inicio
            </ButtonLink>
            <ButtonAnchor
              href={waLink('Hola ARNEDO LR, llegué a una página que no existe. ¿Me ayudás?')}
              variant="outline"
              size="lg"
              sheen={false}
              className="border-cream/25 text-cream hover:border-cream/50 hover:bg-cream/8"
            >
              <MessageCircle className="h-4 w-4" />
              Preguntar por WhatsApp
            </ButtonAnchor>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <h2 className="text-[1.7rem] text-ink">Propiedades disponibles</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROPERTIES.slice(0, 3).map((p) => (
              <PropertyCard key={p.id} property={p} compact />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/#propiedades"
              className="text-[0.9rem] font-semibold text-clay-600 underline decoration-clay-300 underline-offset-4 transition-colors hover:text-clay-700"
            >
              Ver las {PROPERTIES.length} propiedades
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
