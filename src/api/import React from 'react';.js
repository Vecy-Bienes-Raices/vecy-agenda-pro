import React from 'react';
import { Link } from 'react-router-dom';
// Asegúrate de que la ruta al logo sea correcta
import logo from '../assets/Vecy_agenda1.png';

const WelcomeScreen = () => {
  return (
    <div className="text-center text-white">
      <img src={logo} alt="Vecy Bienes Raíces" className="mx-auto mb-8 w-28 sm:w-48" />
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenido a Vecy Agenda</h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        Estás a punto de usar nuestro sistema seguro para agendar visitas o solicitar servicios. Completa el formulario para que uno de nuestros agentes pueda atenderte.
      </p>
      <Link
        to="/formulario"
        className="bg-caramel-dark hover:bg-caramel-light text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
      >
        Iniciar Solicitud
      </Link>
    </div>
  );
};

export default WelcomeScreen;