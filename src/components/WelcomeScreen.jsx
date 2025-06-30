import React from 'react';

const portadImageUrl = '/Vecy_agenda1.png';

function WelcomeScreen({ onStart }) {
  return (
    <div className="text-center">
      
      <div className="w-full max-w-md mx-auto mb-8">
        <img
          src={portadImageUrl}
          alt="Portada de Vecy Agenda"
          className="w-full h-auto rounded-2xl shadow-xl"
        />
      </div>

      <div className="px-4 sm:px-0">
        <h1 className="text-4xl font-bold text-off-white mt-4">
          Vecy Agenda
        </h1>

        {/* --- ¡AQUÍ ESTÁ EL NUEVO BLOQUE DE TEXTO! --- */}
        <div className="text-off-white/90 max-w-2xl mx-auto my-6 space-y-4 text-left">
          <p className="font-semibold text-lg flex items-center">
            <span>🔒</span>
            <span className="ml-2">Transparencia y confianza ante todo:</span>
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><strong>Si eres cliente directo:</strong> Llena el formulario completo, autoriza y envíalo.</li>
            <li><strong>Si eres agente:</strong> Autoriza, ingresa tus datos, presenta a tu cliente, firma y envía.</li>
          </ul>
          <p className="flex items-start">
            <span className="mt-1">✅</span>
            <span className="ml-2">Es clave ingresar datos reales para agilizar los permisos de ingreso y garantizar un proceso seguro y eficiente. ¡Gracias por confiar en nosotros!</span>
          </p>
        </div>
        
        <p className="text-sm text-acero mb-8">
          Al continuar, aceptas nuestra <a href="/politica-privacidad" target="_blank" className="font-semibold text-soft-gold hover:underline">Política de Privacidad</a> y nuestros <a href="/terminos-y-condiciones" target="_blank" className="font-semibold text-soft-gold hover:underline">Términos y Condiciones</a>.
        </p>
      </div>
      
      <button
        onClick={onStart}
        className="bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-3 px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-luminous-gold"
      >
        EMPECEMOS
      </button>
    </div>
  );
}

export default WelcomeScreen;