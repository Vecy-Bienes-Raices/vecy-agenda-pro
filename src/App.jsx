import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const WelcomeScreen = lazy(() => import('./components/WelcomeScreen'));
const AgendaForm = lazy(() => import('./components/AgendaForm'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const GraciasScreen = lazy(() => import('./components/GraciasScreen.jsx'));
const DeclineScreen = lazy(() => import('./components/DeclineScreen.jsx'));
import ScrollToTop from './components/ScrollToTop';

// Componente "Wrapper" — Vecy Gold Edition
const Layout = ({ children }) => (
  <main className="min-h-screen flex items-center justify-center p-2 sm:p-4 font-sans"
    style={{ background: 'radial-gradient(ellipse at center, #1c1c1c 0%, #000000 70%)' }}>
    <div className="w-full max-w-4xl rounded-2xl overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, rgba(10,10,10,0.98) 0%, rgba(18,18,18,0.95) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.18)',
        boxShadow: '0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(191,149,63,0.07)',
        padding: 'clamp(1rem, 4vw, 3rem)',
      }}>
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
        <ScrollToTop />
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