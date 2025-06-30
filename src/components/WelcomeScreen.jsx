import React from 'react';

const portadImageUrl = '/Vecy_agenda1.png';

function WelcomeScreen({ onStart }) {
  return (
    <div className="text-center">
      <img
        src={portadImageUrl}
        alt="Portada de Vecy Agenda"
        className="w-full max-w-md mx-auto rounded-2xl shadow-xl mb-8"
      />
      <h1 className="text-4xl font-bold text-off-white mt-4">
        Vecy Agenda
      </h1>
      <p className="text-off-white/80 max-w-2xl mx-auto my-6"> {/* Texto con ligera transparencia */}
        🔒 Transparencia y confianza ante todo: 1. Si eres cliente directo: Llena el formulario completo, autoriza y envíalo. 2. Si eres agente: Autoriza, ingresa tus datos, presenta a tu cliente, firma y envía. ✅ Es clave ingresar datos reales para agilizar los permisos de ingreso y garantizar un proceso seguro y eficiente. ¡Gracias por confiar en nosotros!
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