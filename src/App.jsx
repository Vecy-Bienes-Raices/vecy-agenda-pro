import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import AgendaForm from './components/AgendaForm';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

// Un componente "Wrapper" para mantener nuestro diseño de fondo en todas las páginas.
function Layout({ children }) {
  return (
    <main className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-caramel-light to-caramel-dark min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 md:p-12">
        {children}
      </div>
    </main>
  );
}

// Un componente para la página principal que contiene el formulario
function FormPage() {
    return <AgendaForm onBack={() => window.location.href = '/'} />;
}

// Un componente para la página de bienvenida
function LandingPage() {
    // La navegación ahora se hace con el componente <Link> de React Router
    return <WelcomeScreen onStart={() => window.location.href = '/formulario'} />;
}

// Ahora, App.jsx es el director de orquesta de las rutas.
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/formulario" element={<FormPage />} />
          <Route path="/politica-privacidad" element={<PrivacyPolicy onBack={() => window.history.back()} />} />
          <Route path="/terminos-y-condiciones" element={<TermsOfService onBack={() => window.history.back()} />} />
          {/* Añadiremos la página de gracias aquí después */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;