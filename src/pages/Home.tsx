import { Hero } from '../sections/Hero'
import { Services } from '../sections/Services'
import { WhyUs } from '../sections/WhyUs'
import { CtaBanner } from '../sections/CtaBanner'
import { PropertyGrid } from '../components/PropertyGrid'
import { Reveal, SectionHeading } from '../components/Motion'
import { Seo } from '../components/Seo'
import { PROPERTIES } from '../data/site'

export function Home() {
  return (
    <>
      <Seo
        title="ARNEDO LR · Inmobiliaria en Salta"
        description="Inmobiliaria en Salta, Argentina. Casas, departamentos, galpones y terrenos en San Lorenzo, Grand Bourg, Tres Cerritos y más. Tasaciones, compra, venta y alquiler."
        path="/"
      />

      <Hero />
      <Services />

      {/* Catálogo */}
      <section id="propiedades" className="scroll-mt-24 bg-white py-20 lg:py-28">
        <div className="container-page">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Catálogo"
              title={
                <>
                  {PROPERTIES.length} propiedades.
                  <br className="hidden sm:block" /> Todas con precio y medidas.
                </>
              }
              lead="Filtrá por tipo de inmueble, zona o rango de precio. Cada ficha tiene fotos, superficie real y un botón directo para consultarla."
            />

            <Reveal delay={0.16} className="shrink-0">
              <p className="max-w-xs rounded-2xl bg-sand p-5 text-[0.86rem] leading-relaxed text-graphite">
                <span className="font-bold text-ink">¿No está lo que buscás?</span> Escribinos y
                hacemos la búsqueda por vos. La mayoría de las ventas se cierran con propiedades que
                ni siquiera están publicadas.
              </p>
            </Reveal>
          </div>

          <div className="mt-12">
            <PropertyGrid />
          </div>
        </div>
      </section>

      <WhyUs />
      <CtaBanner />
    </>
  )
}
