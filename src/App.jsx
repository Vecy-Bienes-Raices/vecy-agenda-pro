import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const WelcomeScreen = lazy(() => import('./components/WelcomeScreen'));
const AgendaForm = lazy(() => import('./components/AgendaForm'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const GraciasScreen = lazy(() => import('./components/GraciasScreen.jsx')); // MEJORA: Se añade la extensión .jsx y se actualiza el componente
const DeclineScreen = lazy(() => import('./components/DeclineScreen.jsx')); // CORRECCIÓN: Se añade la extensión .jsx para ser explícitos
import ScrollToTop from './components/ScrollToTop'; // 1. Importamos el nuevo componente

// Componente "Wrapper" que da el estilo de fondo a todas las páginas
const Layout = ({ children }) => (
  <main className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-caramel-light to-caramel-dark min-h-screen flex items-center justify-center p-2 sm:p-4 font-sans">
    <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 md:p-12 overflow-y-auto">
      {children}
    </div>
  </main>
);

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-soft-gold/20 border-t-soft-gold"></div>
  </div>
);

// El director de orquesta final
function App() {
  return (
    <Router>
      <Layout>
        <ScrollToTop /> {/* 2. Lo añadimos aquí para que se aplique a todas las rutas */}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/formulario" element={<AgendaForm />} />
            <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos-y-condiciones" element={<TermsOfService />} />
            <Route path="/gracias" element={<GraciasScreen />} />
            <Route path="/declinado" element={<DeclineScreen />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;