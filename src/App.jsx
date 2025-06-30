import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

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

// Pequeños componentes "controladores" para cada página
function LandingPage() {
  const navigate = useNavigate();
  return <WelcomeScreen onStart={() => navigate('/formulario')} />;
}

function FormPage() {
  const navigate = useNavigate();
  return <AgendaForm onBack={() => navigate('/')} />;
}

function PrivacyPage() {
  const navigate = useNavigate();
  return <PrivacyPolicy onBack={() => navigate(-1)} />;
}

function TermsPage() {
  const navigate = useNavigate();
  return <TermsOfService onBack={() => navigate(-1)} />;
}

function ThanksPage() {
  return <GraciasScreen />;
}


// El director de orquesta final
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/formulario" element={<FormPage />} />
          <Route path="/politica-privacidad" element={<PrivacyPage />} />
          <Route path="/terminos-y-condiciones" element={<TermsPage />} />
          <Route path="/gracias" element={<ThanksPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;