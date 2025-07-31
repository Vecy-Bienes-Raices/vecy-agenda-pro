import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Confetti from 'react-confetti';

// Un ícono de check animado para dar feedback visual positivo
function AnimatedCheck() {
  return (
    <svg className="h-24 w-24 text-esmeralda mx-auto" viewBox="0 0 52 52">
      <circle className="stroke-current" cx="26" cy="26" r="25" fill="none" strokeWidth="2" />
      <path className="stroke-current" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        style={{
          strokeDasharray: 48,
          strokeDashoffset: 48,
          animation: 'draw 0.4s ease-out 0.5s forwards',
        }}
        d="M14 27l5.917 5.917L38 18" />
      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
}

function GraciasScreen() {
  const location = useLocation();
  const formData = location.state?.formData;
  const [showContent, setShowContent] = useState(false);
  const [recycleConfetti, setRecycleConfetti] = useState(false);

  // Simula una pequeña carga para que la animación se aprecie y la transición sea suave
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      setRecycleConfetti(true); // ¡Aquí empieza la fiesta!
    }, 3000); // 3 segundos de "procesamiento" simulado
    return () => clearTimeout(timer);
  }, []);

  // Este efecto se encarga de detener el confeti después de un tiempo.
  useEffect(() => {
    if (recycleConfetti) {
      const stopConfettiTimer = setTimeout(() => {
        setRecycleConfetti(false);
      }, 8000); // El confeti dejará de generarse después de 8 segundos.
      return () => clearTimeout(stopConfettiTimer);
    }
  }, [recycleConfetti]);

  const nombreSolicitante = formData?.solicitante_nombre?.split(' ')[0] || 'tú';

  if (!showContent) {
    return (
      <div className="text-center transition-opacity duration-500">
        <h2 className="text-3xl font-bold text-off-white mb-4">Procesando tu solicitud...</h2>
        <p className="text-off-white/80 mb-8">Estamos finalizando los detalles y preparando todo.</p>
        <div className="flex justify-center items-center">
          {/* MEJORA: Spinner con colores de la marca para una apariencia más profesional */}
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-soft-gold/20 border-t-soft-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center transition-opacity duration-700 opacity-100">
      <Confetti
        recycle={recycleConfetti}
        numberOfPieces={250}
        gravity={0.1}
        colors={['#D4AF37', '#2ECC71', '#F5F5F5', '#1C1C1C']} // Usamos los colores de la marca: soft-gold, esmeralda, off-white, volcanic-black
      />
      <AnimatedCheck />
      <h1 className="text-4xl font-bold text-off-white mt-6 mb-3">¡Gracias, {nombreSolicitante}!</h1>
      <p className="text-lg text-off-white/80 max-w-2xl mx-auto">Hemos recibido tu solicitud correctamente.</p>
      <div className="mt-8 bg-black/20 p-6 rounded-lg border border-white/10"><h3 className="font-semibold text-soft-gold text-lg">Siguientes Pasos</h3><p className="text-off-white/80 mt-2">Te hemos enviado un correo de confirmación a <strong className="text-white">{formData?.solicitante_email || 'tu correo'}</strong>.</p><p className="text-sm text-off-white/60 mt-4"><strong>Importante:</strong> El correo puede tardar unos minutos en llegar mientras generamos los documentos necesarios. Por favor, revisa también tu carpeta de correo no deseado (spam).</p></div>
      <Link to="/" className="mt-10 inline-block bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-luminous-gold">Volver al Inicio</Link>
    </div>
  );
}

export default GraciasScreen;