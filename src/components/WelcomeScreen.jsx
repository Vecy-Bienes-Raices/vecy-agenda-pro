import React from 'react';

const portadImageUrl = '/Vecy_agenda1.png';

function WelcomeScreen({ onStart }) {
  return (
    <div className="text-center">
      <img
        src={portadImageUrl}
        alt="Portada de Vecy Agenda"
        className="mx-auto max-w-md rounded-2xl shadow-xl mb-8"
      />
      <h1 className="text-4xl font-bold text-off-white mt-4">
        Vecy Agenda
      </h1>
      <p className="text-off-white/80 max-w-2xl mx-auto my-6"> {/* Texto con ligera transparencia */}
        IMPORTANTE: Valoramos la transparencia y la confianza... (tu texto completo va aquí)
      </p>
      <p className="text-sm text-off-white/80 mb-8">
        Al continuar, aceptas nuestra <a href="/politica-privacidad" target="_blank" className="font-semibold text-soft-gold hover:underline">Política de Privacidad</a> y nuestros <a href="/terminos-y-condiciones" target="_blank" className="font-semibold text-soft-gold hover:underline">Términos y Condiciones</a>.
      </p>

      {/* --- EL NUEVO BOTÓN DE LUJO --- */}
      <button
        onClick={onStart}
        className="
        bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black 
        font-bold py-3 px-10 rounded-lg 
        transition-all duration-300 
        shadow-lg hover:shadow-luminous-gold
        "
      >
        EMPECEMOS
      </button>
    </div>
  );
}

export default WelcomeScreen;