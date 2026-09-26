import { Route, Routes } from 'react-router-dom'
import { Nav, ScrollToTop } from './components/Nav'
import { Footer } from './components/Footer'
import { FloatingCta } from './components/FloatingCta'
import { Home } from './pages/Home'
import { PropertyDetail } from './pages/PropertyDetail'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />

      <main id="contenido">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/propiedad/:slug" element={<PropertyDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <FloatingCta />
    </>
  )
}
