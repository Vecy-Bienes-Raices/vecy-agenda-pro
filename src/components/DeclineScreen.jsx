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
          y los{' '}
          <Link to="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="font-semibold text-soft-gold hover:underline">
            Términos y Condiciones
          </Link>.
        </p>
      </div>

      <div className="mt-8">
        <Link to="/" className="bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-luminous-gold">
          Recapacita
        </Link>
      </div>
    </div>
  );
}

export default DeclineScreen;