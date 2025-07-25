import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaRegHandshake } from 'react-icons/fa';
import { BsInfoCircle } from 'react-icons/bs';

const portadImageUrl = '/Vecy_agenda1.png';

// Pequeño componente para encapsular la lógica de los ítems con icono
const InfoItem = ({ icon: Icon, children }) => (
  <p className="flex items-start">
    <Icon className="text-soft-gold text-xl mt-1 flex-shrink-0" />
    <span className="ml-2">{children}</span>
  </p>
);

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      
      <div className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-xs mx-auto mb-8">
        <img
          src={portadImageUrl}
          alt="Portada de Vecy Agenda"
          className="w-full h-auto rounded-2xl shadow-xl"
        />
      </div>

      <div className="px-4 sm:px-0">
        <h1 className="text-4xl font-bold text-off-white mt-4">
          Vecy Agenda
        </h1>

        {/* --- ¡AQUÍ ESTÁ EL NUEVO BLOQUE DE TEXTO! --- */}
        <div className="text-off-white/90 max-w-2xl mx-auto my-6 space-y-4 text-left">
          <p className="font-semibold text-lg flex items-center">
            <BsInfoCircle className="text-soft-gold text-xl" />
            <span className="ml-2">Instrucciones:</span>
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><strong>Cliente directo:</strong> Autoriza, llena tus datos y envía.</li>
            <li><strong>Agente:</strong> Autoriza, llena tus datos y los del cliente, firma y envía.</li>
          </ul>
          <InfoItem icon={FaUserShield}>
            Por tu seguridad y la nuestra es clave ingresar datos reales para agilizar el permiso de ingreso.
          </InfoItem>
          <InfoItem icon={FaRegHandshake}>
            <strong>¡Gracias por confiar en nosotros!</strong>
          </InfoItem>
        </div>
        
        
      </div>
      
      <button
        onClick={() => navigate('/formulario')}
        className="bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-3 px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-luminous-gold"
      >
        EMPECEMOS
      </button>
    </div>
  );
}

export default WelcomeScreen;