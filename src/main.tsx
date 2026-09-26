import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      basename tiene que coincidir con el base de Vite. Sin esto, en
      GitHub Pages el router ve "/demo-arnedolr/propiedad/x", no reconoce
      ninguna ruta y cae siempre en la 404, aunque el JS haya cargado bien.
      BASE_URL ya viene con la barra final, que es lo que pide react-router.
    */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
