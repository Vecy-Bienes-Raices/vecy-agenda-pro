import React from 'react';
import { Link } from 'react-router-dom';
// Asegúrate de que la ruta al logo sea correcta
import logo from '../assets/Vecy_agenda1.png';

const DeclineScreen = () => {
  return (
    <div className="text-center text-white">
      <img src={logo} alt="Vecy Bienes Raíces" className="mx-auto mb-8 w-24 sm:w-40" />
      <h1 className="text-4xl font-bold mb-4">Solicitud Cancelada</h1>
      <p className="text-lg mb-8 max-w-xl mx-auto">
        Has decidido no continuar con la solicitud. Si cambias de opinión, siempre puedes volver a empezar.
      </p>
      <Link
        to="/"
        className="bg-caramel-dark hover:bg-caramel-light text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default DeclineScreen;