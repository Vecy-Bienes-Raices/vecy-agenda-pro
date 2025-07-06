// Archivo: GraciasScreen.jsx (Versión Profesional Simplificada)

import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaWhatsapp, FaEnvelope, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Importamos las imágenes que se usan directamente en esta pantalla
import confirmacionImg from '/Vecy_confirmacion.png';
import whatsappIcono from '/icono-whatsapp.png';

function GraciasScreen() {
  const location = useLocation();
  // Obtenemos los datos del formulario que nos pasó la página anterior
  const { formData } = location.state || {};

  // Estado para gestionar los mensajes que ve el usuario
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Obtenemos el nombre y si es agente para usarlo en la UI
  const nombre = formData?.solicitante_nombre || 'estimado cliente';
  const esAgente = formData?.solicitante_perfil === 'Agente';

  useEffect(() => {
    // Esta función se ejecutará una sola vez cuando el componente se cargue
    const processAndSendEmail = async () => {
      // Si no hay datos del formulario, no hacemos nada
      if (!formData) {
        setStatus('error');
        setFeedbackMessage('No se encontraron los datos de la solicitud.');
        return;
      }

      setStatus('processing');
      setFeedbackMessage('Procesando tu solicitud y enviando confirmación...');

      try {
        // Llamamos a nuestra función en Supabase.
        // La URL debe ser la correcta de tu proyecto.
        const response = await fetch("https://iqmlenxldsdrxsbegkwf.supabase.co/functions/v1/send-confirmation-email", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Es buena práctica incluir la API key anónima de Supabase
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbWxlbnhsZHNkcnhzYmVna3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzQ4MTQsImV4cCI6MjA2NjU1MDgxNH0.5HMLnYcMjYEwNaiKXLFA9Y0xyte89Nql4pcMsBidj9Y',
          },
          // Le enviamos todos los datos del formulario en el cuerpo de la petición.
          // La función en el servidor se encargará de todo.
          body: JSON.stringify(formData) 
        });

        // Si la respuesta del servidor no es exitosa (ej: error 500), lanzamos un error
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'El servidor respondió con un error.');
        }

        // Si todo sale bien, actualizamos el estado a éxito
        setStatus('success');
        setFeedbackMessage('¡Listo! Hemos enviado la confirmación a tu correo.');

      } catch (error) {
        console.error('❌ Error al llamar a la función de correo:', error);
        setStatus('error');
        setFeedbackMessage(`Hubo un error al procesar tu solicitud: ${error.message}`);
      }
    };

    processAndSendEmail();
  }, [formData]); // Este efecto depende de formData, se ejecutará si los datos cambian.

  // Función para mostrar el ícono correcto según el estado
  const getStatusIcon = () => {
    switch (status) {
      case 'processing': return <FaSpinner className="animate-spin text-esmeralda text-2xl mt-1 flex-shrink-0" />;
      case 'success': return <FaCheckCircle className="text-esmeralda text-2xl mt-1 flex-shrink-0" />;
      case 'error': return <FaExclamationCircle className="text-red-500 text-2xl mt-1 flex-shrink-0" />;
      default: return <FaEnvelope className="text-esmeralda text-2xl mt-1 flex-shrink-0" />;
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
              {esAgente ? 'Confirmación del Agente' : 'Confirmación por Correo'}
            </p>
            <p className="text-off-white/80 text-sm">
              {feedbackMessage || 'Iniciando proceso...'}
            </p>
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