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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.161l-1.317 4.814 4.895-1.282zM9.062 8.612c-.099-.197-.676-1.36-1.016-1.748-.339-.387-.683-.39-.963-.396-.279-.005-.59-.005-.909-.005-.319 0-.834.119-1.264.582-.43.463-1.648 1.615-1.648 3.935 0 2.32 1.687 4.559 1.917 4.872.23 3.12 3.39 5.799 6.536 7.671.889.512 1.582.825 2.109 1.055.527.23 1.008.192 1.404.118.475-.088 1.429-.584 1.64-1.155.211-.571.211-1.056.14-1.174-.071-.119-.27-.164-.571-.28-.301-.117-1.76-1.11-2.032-1.232-.271-.122-.469-.183-.666.123-.197.307-.767.99-1.017 1.232-.25.242-.5.274-.8.152-.3-.122-1.256-.463-2.39-1.475-.889-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.104-.606.107-.133.237-.344.356-.521.119-.177.15-.307.231-.504.081-.197.041-.376-.018-.521-.06-.145-.667-1.612-.917-2.19z"/></svg>
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