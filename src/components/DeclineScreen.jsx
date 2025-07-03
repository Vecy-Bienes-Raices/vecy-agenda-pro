import React from 'react';
import { Link } from 'react-router-dom';

const imageUrl = '/Vecy_declined.png';

function DeclineScreen() {
  return (
    <div className="text-center flex flex-col items-center gap-4">
      <img
        src={imageUrl}
        alt="Solicitud Declinada"
        className="mx-auto w-64 mb-4"
      />
      <h1 className="text-4xl font-bold text-off-white">¡Oh no!</h1>

      <div className="max-w-2xl">
        <p className="text-off-white/80 mt-2 text-lg">
          Para continuar es necesario que aceptes nuestra{' '}
          <Link to="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="font-semibold text-soft-gold hover:underline">
            Política de Privacidad
          </Link>{' '}
          y nuestros{' '}
          <Link to="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="font-semibold text-soft-gold hover:underline">
            Términos y Condiciones
          </Link>.
        </p>
        <p className="text-off-white/70 mt-4 text-base">
          Si tienes dudas sobre el proceso o necesitas ayuda para completar el formulario, no dudes en contactarnos.
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link to="/formulario" className="bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-luminous-gold">
          Volver y Aceptar
        </Link>
        <a href="https://wa.link/55f26z" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
          <img src="/icono-whatsapp.png" alt="WhatsApp" className="h-6 w-6" />
          Necesito Ayuda
        </a>
      </div>
    </div>
  );
}

export default DeclineScreen;