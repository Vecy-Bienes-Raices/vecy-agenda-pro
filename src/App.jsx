// CÓDIGO COMPLETO Y FINAL PARA App.jsx
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import AgendaForm from './components/AgendaForm';
import GraciasScreen from './components/GraciasScreen'; // ¡Importamos la nueva pantalla!

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  useEffect(() => {
    // Comprobamos si la URL contiene '/gracias'
    if (window.location.pathname.includes('/gracias')) {
      setCurrentScreen('gracias');
    }
  }, []);

  const handleStartForm = () => {
    setCurrentScreen('form');
  };

  const handleGoToWelcome = () => {
    // Redirigimos a la raíz para limpiar la URL de 'gracias'
    window.location.href = '/';
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'form':
        return <AgendaForm onBack={handleGoToWelcome} />;
      case 'gracias':
        return <GraciasScreen />;
      default:
        return <WelcomeScreen onStart={handleStartForm} />;
    }
  };

  return (
    <main className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-caramel-light to-caramel-dark min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 md:p-12">
        {renderScreen()}
      </div>
    </main>
  );
}

export default App;