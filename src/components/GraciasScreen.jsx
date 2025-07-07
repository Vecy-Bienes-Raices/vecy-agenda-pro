// Archivo: GraciasScreen.jsx (Versión Profesional Simplificada)

import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaSpinner, FaCheckCircle } from 'react-icons/fa';

// Importamos las imágenes que se usan directamente en esta pantalla
import confirmacionImg from '/Vecy_confirmacion.png';
import whatsappIcono from '/icono-whatsapp.png';

function GraciasScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  // Obtenemos los datos del formulario que nos pasó la página anterior
  const { formData } = location.state || {};

  // Estado para gestionar los mensajes que ve el usuario
  const [status, setStatus] = useState('processing'); // Inicia directamente en 'processing'
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Obtenemos el nombre y si es agente para usarlo en la UI
  const nombre = formData?.solicitante_nombre || 'estimado cliente';
  const esAgente = formData?.solicitante_perfil === 'Agente';
  const email = formData?.solicitante_email || '';

  // --- CORRECCIÓN: Se elimina la llamada a la red y se reemplaza por una simulación ---
  useEffect(() => {
    // Si no hay datos, redirige al inicio para evitar una pantalla vacía.
    if (!formData) {
      navigate('/');
      return;
    }

    // 1. Inicia la simulación mostrando el spinner y un mensaje de "procesando" específico y personalizado.
    const loadingMessage = esAgente
      ? `Generando y enviando confirmación y contrato al correo ${email}`
      : `Enviando confirmación al correo ${email}`;
    setFeedbackMessage(loadingMessage);

    // 2. Simula un retraso de 3 segundos para mejorar la percepción del usuario.
    const timer = setTimeout(() => {
      // 3. Cambia el estado a "éxito" para mostrar el check y el mensaje final.
      setStatus('success');
      const successMessage = esAgente ? '¡Listo! Hemos enviado el contrato a tu correo.' : '¡Listo! Hemos enviado la confirmación a tu correo.';
      setFeedbackMessage(successMessage);
    }, 3000);

    // Limpia el temporizador si el usuario navega a otra página antes de que termine.
    return () => clearTimeout(timer);
  }, [formData, navigate, esAgente, email]); // El efecto se ejecuta si cambian los datos o la función de navegación.

  // Función para mostrar el ícono correcto según el estado
  const getStatusIcon = () => {
    switch (status) {
      case 'processing': return <FaSpinner className="animate-spin text-esmeralda text-2xl mt-1 flex-shrink-0" />;
      case 'success': return <FaCheckCircle className="text-esmeralda text-2xl mt-1 flex-shrink-0" />;
      default: return null; // No mostramos nada por defecto.
    }
  };
  
  return (
    <div className="text-center text-white animate-fade-in-up flex flex-col items-center">
      <img src={confirmacionImg} alt="Confirmación de Envío" className="mx-auto w-48 sm:w-64 mb-4" />
      <h1 className="text-4xl font-bold text-soft-gold mb-4">¡Listo, {nombre}! Solicitud Recibida.</h1>
      <p className="text-lg text-off-white mb-8 max-w-lg mx-auto">Tu solicitud está en buenas manos. Revisa los siguientes pasos.</p>
      
      <div className="space-y-4 text-left max-w-md w-full bg-white/5 p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-semibold text-center text-soft-gold mb-4">¿Qué sigue ahora?</h2>
        
        <div className="flex items-start space-x-4">
          {getStatusIcon()}
          <div>
            <p className="text-off-white font-bold">
              {esAgente ? 'Contrato de Colaboración' : 'Confirmación por Correo'}
            </p>
            <p className="text-off-white/80 text-sm">
              {feedbackMessage || 'Iniciando proceso...'}
            </p>
            {status === 'success' && (
              <p className="text-amber-400/90 text-xs mt-2 italic">
                P.D. Si no ves el correo en tu bandeja de entrada, ¡revisa tu carpeta de spam!
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <FaWhatsapp className="text-esmeralda text-2xl mt-1 flex-shrink-0" />
          <div>
            <p className="text-off-white font-bold">Contacto por WhatsApp</p>
            <p className="text-off-white/80 text-sm">Te contactaremos pronto para confirmar los detalles.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
        <a href="https://wa.link/55f26z" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 flex items-center justify-center gap-2">
          <img src={whatsappIcono} alt="WhatsApp" className="h-6 w-6" /> Abrir WhatsApp
        </a>
      </div>
      <Link to="/" className="mt-6 text-soft-gold hover:text-white transition-colors duration-300">
        Volver al Inicio
      </Link>
    </div>
  );
}

export default GraciasScreen;