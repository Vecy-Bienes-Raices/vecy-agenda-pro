import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
import WelcomeScreen from './components/WelcomeScreen';
import AgendaForm from './components/AgendaForm';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import GraciasScreen from './components/GraciasScreen'; // Importamos la pantalla de gracias

// Componente "Wrapper" que da el estilo de fondo a todas las páginas
function Layout({ children }) {
  return (
    <main className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-caramel-light to-caramel-dark min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 md:p-12 overflow-y-auto">
        {children}
      </div>
    </main>
  );
}

// El director de orquesta final
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/formulario" element={<AgendaForm />} />
          <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
          <Route path="/terminos-y-condiciones" element={<TermsOfService />} />
          <Route path="/gracias" element={<GraciasScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;