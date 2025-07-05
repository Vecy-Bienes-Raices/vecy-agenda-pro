import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const imageUrl = '/Vecy_confirmacion.png';

function GraciasScreen() {
  const location = useLocation();
  const { formData } = location.state || {};

  const nombre = formData?.solicitante_nombre || 'estimado cliente';
  const esAgente = formData?.solicitante_perfil === 'Agente';

  return (
    <div className="text-center text-white animate-fade-in-up flex flex-col items-center">
      <img
        src={imageUrl}
        alt="Confirmación de Envío"
        className="mx-auto w-48 sm:w-64 mb-4"
      />

      <h1 className="text-4xl font-bold text-soft-gold mb-4">
        ¡Listo, {nombre}! Solicitud Recibida.
      </h1>

      <p className="text-lg text-off-white mb-8 max-w-lg mx-auto">
        Tu solicitud está en buenas manos. Revisa los siguientes pasos.
      </p>

      <div className="space-y-4 text-left max-w-md w-full bg-white/5 p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-semibold text-center text-soft-gold mb-4">¿Qué sigue ahora?</h2>
        <div className="flex items-start space-x-4">
          <FaEnvelope className="text-esmeralda text-2xl mt-1 flex-shrink-0" />
          <p className="text-off-white">
            <strong>Revisaremos tu información.</strong> Te enviaremos una copia a tu correo.
          </p>
        </div>
        <div className="flex items-start space-x-4">
          <FaWhatsapp className="text-esmeralda text-2xl mt-1 flex-shrink-0" />
          <p className="text-off-white">
            <strong>Te contactaremos pronto</strong> por WhatsApp para confirmar los detalles.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
        <a href="https://wa.link/55f26z" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 flex items-center justify-center gap-2">
          <img src="/icono-whatsapp.png" alt="WhatsApp" className="h-6 w-6" />
          Abrir WhatsApp
        </a>
        {esAgente && (
          <Link
            to="/contrato-puntas"
            state={{ formData }}
            className="bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-luminous-gold text-center flex items-center justify-center"
          >
            Descargar Contrato
          </Link>
        )}
      </div>
      <Link to="/" className="mt-6 text-soft-gold hover:text-white transition-colors duration-300">
        Volver al Inicio
      </Link>
    </div>
  );
}

export default GraciasScreen;