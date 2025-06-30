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
            <span className="ml-2">Instrucciones:</span>
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><strong>Cliente directo:</strong> Autoriza, llena el formulario completo y envíalo.</li>
            <li><strong>Agente:</strong> Autoriza, llena tus datos y los de tu cliente, firma y envía.</li>
          </ul>
          <p className="flex items-start">
            <span className="mt-1">✅</span>
            <span className="ml-2">Por tu seguridad y la nuestra es clave ingresar datos reales para agilizar el permisos de ingreso.</span>
            <ul className="list-disc list-inside pl-4 space-y-2">
            <li><strong>¡Gracias por confiar en nosotros!</strong></li>
          </ul>
          </p>
        </div>
        
        
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