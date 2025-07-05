import React from 'react';
import { Link } from 'react-router-dom';
// Asegúrate de que la ruta al logo sea correcta
import logo from '../assets/Vecy_agenda1.png';

const GraciasScreen = () => {
  return (
    <div className="text-center text-white">
      <img src={logo} alt="Vecy Bienes Raíces" className="mx-auto mb-8 w-24 sm:w-40" />
      <h1 className="text-4xl font-bold mb-4">¡Solicitud Recibida!</h1>
      <p className="text-lg mb-4 max-w-xl mx-auto">
        ¡Gracias por tu confianza! Hemos recibido tu solicitud. Un agente te contactará pronto por WhatsApp o teléfono para confirmar los detalles.
      </p>
      <p className="mb-8 text-base text-white/80">
        Nuestro horario de atención es de Lunes a Viernes, de 9:00 AM a 6:00 PM.
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

export default GraciasScreen;