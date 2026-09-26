/**
 * Datos del sitio: contacto, catalogo de propiedades y contenido derivado.
 *
 * Todo lo que se muestra en la web sale de aca. Los campos `totalM2`,
 * `builtM2`, `bedrooms`, `bathrooms`, `garage`, `priceUsd`, `coords` y
 * `description` son estimaciones de trabajo, no datos verificados por la
 * inmobiliaria: hay que confirmarlos con la fuente antes de publicar.
 */

export type PropertyType = 'casa' | 'departamento' | 'galpon' | 'campo' | 'terreno'
export type Operation = 'venta' | 'alquiler'

export interface Coords {
  lat: number
  lng: number
}

export interface Property {
  id: string
  slug: string
  image: string
  type: PropertyType
  operation: Operation
  title: string
  neighborhood: string
  city: string
  totalM2: number
  builtM2: number
  bedrooms: number
  bathrooms: number
  garage: boolean
  highlights: string[]
  priceNote?: string
  description: string
  priceUsd: number
  coords: Coords
  featured?: boolean
}

/* ------------------------------------------------------------------ contacto */

export const CONTACT = {
  brand: 'ARNEDOLR',
  whatsapp: '543874199305',
  phones: [
    { display: '+54 9 3874 15-2835', raw: '+543875252835' },
    { display: '+54 9 3874 19-9305', raw: '+543874199305' },
  ],
  email: 'arnedolr@gmail.com',
  address: 'Vicente López 477, 8° "A"',
  addressShort: 'Vicente López 477, 8° "A", Salta',
  hours: { days: 'Lunes a Domingo', time: '9:00 hs a 18:00 hs' },
  social: [
    { name: 'Instagram', handle: '@arnedolr', href: 'https://www.instagram.com/arnedolr/' },
    { name: 'Facebook', handle: '/arnedo.lr', href: 'https://www.facebook.com/arnedo.lr' },
  ],
}

/** Enlace de WhatsApp con un mensaje prefabricado. */
export function waLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}

/* --------------------------------------------------------------- propiedades */

export const PROPERTIES: Property[] = [
  {
    id: 'a01',
    slug: 'casa-praderas-san-lorenzo-chico',
    image: '/propiedades/casa-praderas-san-lorenzo-chico.webp',
    type: 'casa',
    operation: 'venta',
    title: 'Casa en Praderas',
    neighborhood: 'San Lorenzo Chico',
    city: 'Salta',
    totalM2: 1019,
    builtM2: 270,
    bedrooms: 3,
    bathrooms: 2,
    garage: true,
    highlights: ['3 habitaciones', '1 en suite', 'Barrio privado'],
    description: 'Casa de 270 m² cubiertos sobre un lote de 1.019 m² en el corazón de San Lorenzo Chico. Tres habitaciones con una en suite, dos baños, cocina independiente y living con salida directa al jardín. El lote está en una zona de villas, con calles internas consolidadas y muy poca pendiente, lo que lo hace ideal para ampliar la construcción o montar una pileta.',
    priceUsd: 210000,
    coords: { lat: -24.7501, lng: -65.4002 },
    featured: true,
  },
  {
    id: 'a02',
    slug: 'casa-grand-bourg',
    image: '/propiedades/casa-grand-bourg.webp',
    type: 'casa',
    operation: 'venta',
    title: 'Casa en Grand Bourg',
    neighborhood: 'Grand Bourg',
    city: 'Salta',
    totalM2: 380,
    builtM2: 250,
    bedrooms: 3,
    bathrooms: 2,
    garage: true,
    highlights: ['3 habitaciones', '1 en suite', 'Upkeep bajo'],
    description: 'Sobre 380 m² de terreno, una casa de 250 m² cubiertos con tres habitaciones (una en suite), dos baños y cochera. Ubicada a pocas cuadras del centro de Grand Bourg, a pasos de servicios y transporte. Lote chico y bien mantenido, ideal para quien quiere entrar a vivir sin acometer una obra grande.',
    priceUsd: 165000,
    coords: { lat: -24.7596, lng: -65.4212 },
    featured: true,
  },
  {
    id: 'a03',
    slug: 'casa-san-lorenzo-3000',
    image: '/propiedades/casa-san-lorenzo-3000.webp',
    type: 'casa',
    operation: 'venta',
    title: 'Casa en San Lorenzo · 3.000 m²',
    neighborhood: 'San Lorenzo',
    city: 'Salta',
    totalM2: 3000,
    builtM2: 350,
    bedrooms: 3,
    bathrooms: 3,
    garage: true,
    highlights: ['3.000 m² de terreno', '350 m² cubiertos', '1 en suite'],
    description: 'Casa de 350 m² cubiertos en 3.000 m² de terreno, en la zona más buscada de Salta. Tres habitaciones con suite principal, tres baños, cocina comedor amplia y quincho. El terreno tiene frente amplio y profundidad útil, con lugar para dos autos o una futura pileta. Cochera para dos vehículos.',
    priceUsd: 260000,
    coords: { lat: -24.7433, lng: -65.4083 },
  },
  {
    id: 'a04',
    slug: 'casa-san-lorenzo-4000',
    image: '/propiedades/casa-san-lorenzo-4000.webp',
    type: 'casa',
    operation: 'venta',
    title: 'Casa en San Lorenzo · 4.000 m²',
    neighborhood: 'San Lorenzo',
    city: 'Salta',
    totalM2: 4000,
    builtM2: 400,
    bedrooms: 3,
    bathrooms: 3,
    garage: true,
    highlights: ['4.000 m² de terreno', '400 m² cubiertos', '1 en suite'],
    description: 'La más amplia de la selección: 400 m² cubiertos sobre 4.000 m² de terreno en San Lorenzo. Tres habitaciones, una en suite, tres baños, cocina comedor, living con muy buena iluminación y cochera. Terreno nivelado y con excelente conexión de servicios, listo para que le sumes una pileta o un quincho techado.',
    priceUsd: 295000,
    coords: { lat: -24.7455, lng: -65.4141 },
    featured: true,
  },
  {
    id: 'a05',
    slug: 'casa-el-tipal',
    image: '/propiedades/casa-el-tipal.webp',
    type: 'casa',
    operation: 'venta',
    title: 'Casa en El Tipal',
    neighborhood: 'El Tipal',
    city: 'Salta',
    totalM2: 3500,
    builtM2: 500,
    bedrooms: 4,
    bathrooms: 3,
    garage: true,
    highlights: ['4 habitaciones', '500 m² cubiertos', 'Venta o alquiler'],
    priceNote: 'También disponible en alquiler: consultá la tarifa mensual.',
    description: 'La casa con más superficie construida de la lista: 500 m² cubiertos en 3.500 m² de terreno en El Tipal, a minutos del centro de Salta. Cuatro habitaciones con suite principal, tres baños, cocina comedor, laundry independiente y cochera. Ubicada a minutos de San Lorenzo. Acepta propuestas de venta o alquiler.',
    priceUsd: 340000,
    coords: { lat: -24.7417, lng: -65.3833 },
    featured: true,
  },
  {
    id: 'a06',
    slug: 'casa-san-luis',
    image: '/propiedades/casa-san-luis.webp',
    type: 'casa',
    operation: 'venta',
    title: 'Casa en San Luis',
    neighborhood: 'San Luis',
    city: 'Salta',
    totalM2: 1200,
    builtM2: 300,
    bedrooms: 3,
    bathrooms: 2,
    garage: true,
    highlights: ['3 habitaciones', '1 en suite', '1.200 m² de terreno'],
    description: 'Trescientos metros cuadrados cubiertos sobre 1.200 m² de terreno en el barrio San Luis. Tres habitaciones, una en suite, dos baños, cocina comedor y cochera techada. Barrio tranquilo, con buena mezcla de casas y lotes grandes, ideal para una familia que busca espacio sin las distancias de los barrios alejados.',
    priceUsd: 225000,
    coords: { lat: -24.8333, lng: -65.3167 },
  },
  {
    id: 'a07',
    slug: 'casa-san-lorenzo-600',
    image: '/propiedades/casa-san-lorenzo-600.webp',
    type: 'casa',
    operation: 'venta',
    title: 'Casa en San Lorenzo · 600 m²',
    neighborhood: 'San Lorenzo',
    city: 'Salta',
    totalM2: 600,
    builtM2: 250,
    bedrooms: 3,
    bathrooms: 2,
    garage: true,
    highlights: ['3 habitaciones', '1 en suite', 'Lote de 600 m²'],
    description: 'Para quien quiere vivir en San Lorenzo sin el costo de mantenimiento de un lote enorme. 250 m² cubiertos en 600 m² de terreno, tres habitaciones con una en suite, dos baños, cocina comedor y cochera. Todo en un solo nivel, con el jardín ya terminado.',
    priceUsd: 175000,
    coords: { lat: -24.7392, lng: -65.4018 },
  },
  {
    id: 'a08',
    slug: 'casa-tres-cerritos',
    image: '/propiedades/casa-tres-cerritos.webp',
    type: 'casa',
    operation: 'venta',
    title: 'Casa en Tres Cerritos',
    neighborhood: 'Tres Cerritos',
    city: 'Salta',
    totalM2: 325,
    builtM2: 212,
    bedrooms: 4,
    bathrooms: 2,
    garage: true,
    highlights: ['4 habitaciones', '1 en suite', 'Entorno verde'],
    description: 'Casa de 212 m² cubiertos en el corazón de Tres Cerritos, con cuatro habitaciones (una en suite), dos baños, cocina comedor amplia y cochera, sobre 325 m² de terreno. Tres Cerritos es de los barrios con más demanda de Salta por la combinación de cercanía a la ciudad, seguridad y entorno verde.',
    priceUsd: 155000,
    coords: { lat: -24.8333, lng: -65.4833 },
  },
  {
    id: 'a09',
    slug: 'departamento-belgrano',
    image: '/propiedades/departamento-belgrano.webp',
    type: 'departamento',
    operation: 'venta',
    title: 'Depto. en Calle Belgrano',
    neighborhood: 'Centro',
    city: 'Salta',
    totalM2: 73,
    builtM2: 73,
    bedrooms: 2,
    bathrooms: 1,
    garage: true,
    highlights: ['2 dormitorios', '73 m²', 'Con cochera'],
    description: 'Departamento de 73 m² en el centro de Salta, sobre calle Belgrano. Dos dormitorios, baño, cocina comedor con barra y cochera cubierta. Buena opción como inversión o primer paso: edificio con ascensor y seguridad, a metros del movimiento comercial. En el sitio original esta ficha aparecía duplicada con datos idénticos; acá va una sola vez.',
    priceUsd: 78000,
    coords: { lat: -24.7876, lng: -65.4051 },
  },
  {
    id: 'a10',
    slug: 'departamento-boedo',
    image: '/propiedades/departamento-boedo.webp',
    type: 'departamento',
    operation: 'venta',
    title: 'Depto. en Calle Boedo',
    neighborhood: 'Centro',
    city: 'Salta',
    totalM2: 90,
    builtM2: 90,
    bedrooms: 3,
    bathrooms: 2,
    garage: true,
    highlights: ['3 dormitorios', '90 m²', 'Con cochera'],
    description: 'Tres dormitorios en 90 m², dos baños y cochera. Calle Boedo es una de las de mayor movimiento gastronómico de la ciudad, con el Mercado y el centro a minutos. Ideal para una familia chica o para quienes quieren una propiedad en el centro de Salta con todo a mano.',
    priceUsd: 95000,
    coords: { lat: -24.7893, lng: -65.4131 },
  },
  {
    id: 'a11',
    slug: 'departamento-zuviria',
    image: '/propiedades/departamento-zuviria.webp',
    type: 'departamento',
    operation: 'venta',
    title: 'Depto. en Calle Zuviria',
    neighborhood: 'Centro',
    city: 'Salta',
    totalM2: 100,
    builtM2: 100,
    bedrooms: 2,
    bathrooms: 2,
    garage: true,
    highlights: ['2 dormitorios', '100 m²', 'Con cochera'],
    description: 'El departamento más grande de los tres del centro: 100 m², dos dormitorios, dos baños, cocina comedor con barra y cochera. Sobre calle Zuviria, con patio interno y muy buena iluminación natural. Una oportunidad con demanda constante para alquiler por temporada o reventa.',
    priceUsd: 88000,
    coords: { lat: -24.7902, lng: -65.4094 },
  },
  {
    id: 'a12',
    slug: 'galpon-zona-norte',
    image: '/propiedades/galpon-zona-norte.webp',
    type: 'galpon',
    operation: 'venta',
    title: 'Galpón en Zona Norte',
    neighborhood: 'Zona Norte',
    city: 'Salta',
    totalM2: 430,
    builtM2: 430,
    bedrooms: 0,
    bathrooms: 2,
    garage: true,
    highlights: ['250 m² de galpón', '180 m² de oficinas', 'Recepción y kitchenet'],
    description: 'Predio de 430 m² en Zona Norte: 250 m² de galpón con altura libre y acceso para camiones, más 180 m² de oficinas con recepción, kitchenet y dos baños. Ideal para una empresa de servicios, distribuidora o depósito con atención al cliente en el mismo lugar. Cerramiento perimetral y espacio para estacionamiento de empleados.',
    priceUsd: 190000,
    coords: { lat: -24.7333, lng: -65.3833 },
  },
  {
    id: 'a13',
    slug: 'campo-rosario-de-lerma',
    image: '/propiedades/campo-rosario-de-lerma.webp',
    type: 'campo',
    operation: 'venta',
    title: 'Campo en Rosario de Lerma',
    neighborhood: 'Rosario de Lerma',
    city: 'Salta',
    totalM2: 600000,
    builtM2: 0,
    bedrooms: 0,
    bathrooms: 0,
    garage: false,
    highlights: ['60 hectáreas', 'Instalación para tabaco', 'Plano y desmontado'],
    description: '60 hectáreas en Rosario de Lerma, en el corredor de Lerma. El campo viene con instalación para tabaco: plano y desmontado, con la capacidad instalada y el perímetro ya definido. Suelo llano y acceso por camino consolidado, con posibilidad de ampliar hacia los campos linderos. Una inversión con destino agroindustrial claro.',
    priceUsd: 145000,
    coords: { lat: -24.9833, lng: -65.5833 },
  },
  {
    id: 'a14',
    slug: 'terreno-mercado-san-miguel',
    image: '/propiedades/terreno-mercado-san-miguel.webp',
    type: 'terreno',
    operation: 'venta',
    title: 'Terreno en Mercado San Miguel',
    neighborhood: 'Mercado San Miguel',
    city: 'Salta',
    totalM2: 700,
    builtM2: 0,
    bedrooms: 0,
    bathrooms: 0,
    garage: false,
    highlights: ['700 m² totales', '3 locales', '25 m de frente'],
    description: 'Terreno de 700 m² con 25 metros de frente en la zona de Mercado San Miguel, actualmente ocupado por tres locales comerciales en funcionamiento. Ubicación con altísimo tránsito de clientes, en un corredor de alto flujo comercial. Ideal para consolidar un negocio existente o avanzar con un proyecto mixto en altura.',
    priceUsd: 210000,
    coords: { lat: -24.8, lng: -65.4003 },
  },
]

/* ------------------------------------------------------------------- labels */

export const TYPE_LABEL: Record<PropertyType, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  galpon: 'Galpón',
  campo: 'Campo',
  terreno: 'Terreno',
}

export const TYPE_PLURAL: Record<PropertyType, string> = {
  casa: 'Casas',
  departamento: 'Departamentos',
  galpon: 'Galpones',
  campo: 'Campos',
  terreno: 'Terrenos',
}

/* ------------------------------------------------------------------ helpers */

export function formatUsd(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatSurface(m2: number): string {
  return m2 >= 10000
    ? `${new Intl.NumberFormat('es-AR').format(m2 / 10000)} ha`
    : `${new Intl.NumberFormat('es-AR').format(m2)} mÂ²`
}

export function propertyPath(property: Property): string {
  return `/propiedad/${property.slug}`
}

export function getProperty(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug)
}

export function waForProperty(property: Property): string {
  return waLink(
    `Hola ARNEDOLR, vi la propiedad "${property.title}" (${property.neighborhood}) en la web y me interesa. Â¿Me podÃ©s pasar mÃ¡s informaciÃ³n?`,
  )
}

export function mapLink(coords: Coords): string {
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
}

export const officeMapLink = 'https://www.google.com/maps/search/?api=1&query=Vicente%20L%C3%B3pez%20477%2C%208%C2%B0%20%22A%22%2C%20Salta%2C%20Argentina'

/**
 * Zonas ordenadas por cantidad de propiedades, de mayor a menor. Se calcula del
 * catalogo para que la lista no se desactualice al agregar o sacar avisos.
 */
/* -------------------------------------------------------------------- zonas */

export const ZONE_COUNTS: Array<[string, number]> = (() => {
  const counts = new Map<string, number>()
  for (const p of PROPERTIES) {
    counts.set(p.neighborhood, (counts.get(p.neighborhood) ?? 0) + 1)
  }
  return [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  )
})()

export const ZONES: string[] = ZONE_COUNTS.map(([zone]) => zone)

/* ---------------------------------------------------------------- servicios */

export const SERVICES = [
  {
    slug: 'compraventa',
    title: 'Compra y venta',
    blurb: 'Publicamos casas, departamentos, galpones y terreno con fotos, medidas y precio de referencia, para que sepas qué estás mirando antes de escribirnos.',
    points: ['Casas', 'Departamentos', 'Galpones', 'Terreno'],
  },
  {
    slug: 'alquiler',
    title: 'Alquiler',
    blurb: 'Algunas propiedades están disponibles en venta o en alquiler. Consultanos por la tarifa mensual de cada una.',
    points: ['Venta o alquiler', 'Tarifa mensual', 'Zonas de Salta'],
  },
  {
    slug: 'zonas',
    title: 'Zonas donde trabajamos',
    blurb: 'Publicamos en los barrios de Salta donde hay propiedades cargadas en este momento. La lista se arma sola con el catálogo.',
    points: [
      'Centro',
      'San Lorenzo',
      'El Tipal',
      'Grand Bourg',
      'Mercado San Miguel',
      'Rosario de Lerma',
      'San Lorenzo Chico',
      'San Luis',
      'Tres Cerritos',
      'Zona Norte',
    ],
  },
]
