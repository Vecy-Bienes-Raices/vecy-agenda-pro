import React from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // Usar hooks de react-router

const imageUrl = '/Vecy_confirmacion.png';

function GraciasScreen() {
  const [searchParams] = useSearchParams();
  const nombre = searchParams.get('nombre') || 'estimado cliente';
  const email = searchParams.get('email') || 'tu correo electrónico';
  const servicio = searchParams.get('servicio');
  const celular = searchParams.get('celular');

  // Mensaje dinámico basado en el servicio solicitado
  const getServiceMessage = () => {
    if (servicio) {
      // Decodificar el nombre del servicio por si tiene espacios
      const decodedService = decodeURIComponent(servicio);
      return (
        <p className="text-off-white/80 mt-2 text-lg">
          Hemos recibido correctamente tu solicitud para el servicio de <strong className="text-soft-gold">{decodedService}</strong>.
        </p>
      );
    }
    return null;
  };

  return (
    <div className="text-center flex flex-col items-center gap-4">
      <img
        src={imageUrl}
        alt="Confirmación de Envío"
        className="mx-auto w-64 mb-4"
      />
      <h1 className="text-4xl font-bold text-off-white">¡Wow! ¡Ya lo recibimos!</h1>

      <div className="max-w-2xl">
        <p className="text-off-white/80 mt-2 text-lg">
          Gracias, <strong className="text-soft-gold">{nombre}</strong>. Tu solicitud está en buenas manos.
        </p>
        {getServiceMessage()}
      </div>

      {/* Sección de Próximos Pasos */}
      <div className="mt-6 w-full max-w-lg text-left bg-black/20 p-6 rounded-lg border border-white/10">
        <h2 className="text-2xl font-semibold text-off-white mb-4">Próximos Pasos</h2>
        <ul className="list-disc list-inside space-y-3 text-off-white/80">
          <li>
            Te hemos enviado un mensaje de confirmación al número <strong className="text-soft-gold">{celular || 'registrado'}</strong>. Por favor, revisa tu WhatsApp y confírmanos con un "Ok".
          </li>
          <li>
            Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo en las próximas <strong className="text-soft-gold">2 horas hábiles</strong> para coordinar los detalles.
          </li>
          <li>
            Para una comunicación más ágil, puedes agregarnos a tus contactos. ¡Estamos para ayudarte!
          </li>
        </ul>
      </div>

      {/* Botones de Acción */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <a href="https://wa.link/55f26z" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
          <img src="/icono-whatsapp.png" alt="WhatsApp" className="h-6 w-6" />
          Contactar por WhatsApp
        </a>
        <Link to="/" className="bg-transparent hover:bg-white/10 border border-soft-gold text-soft-gold font-bold py-3 px-8 rounded-lg transition-all duration-300">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default GraciasScreen;