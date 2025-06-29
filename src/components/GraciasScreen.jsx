import React, { useEffect, useState } from 'react';

const imageUrl = '/Vecy_confirmacion.png';

function GraciasScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNombre(params.get('nombre') || 'invitado');
    setEmail(params.get('email') || 'tu correo');
  }, []);

  return (
    <div className="text-center">
      <img src={imageUrl} alt="Confirmación de Envío" className="mx-auto w-48 mb-6" />
      <h1 className="text-4xl font-bold text-off-white mt-6">¡Wow! ¡Ya lo recibimos!</h1>
      <p className="text-off-white/80 mt-4 text-lg">
        Gracias, <strong className="text-soft-gold">{nombre}</strong>. Acabamos de enviarte la confirmación a <strong className="text-soft-gold">{email}</strong>. ¡Gracias por confiar en nosotros!
      </p>
      <div className="mt-8">
        <a href="/" className="bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-luminous-gold">
          Llenar otra vez
        </a>
      </div>
    </div>
  );
}

export default GraciasScreen;