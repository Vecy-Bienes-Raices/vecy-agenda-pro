import React, { useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';

function SignaturePadComponent({ onSignatureChange }) {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  useEffect(() => {
    // Usamos un pequeño retraso para asegurar que el canvas es visible antes de inicializar
    const timeoutId = setTimeout(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);

        signaturePadRef.current = new SignaturePad(canvas);
        signaturePadRef.current.addEventListener("endStroke", () => {
          if (!signaturePadRef.current.isEmpty()) {
            const signatureData = signaturePadRef.current.toDataURL();
            onSignatureChange(signatureData);
          }
        });
      }
    }, 0); // Este timeout de 0 es una técnica para ejecutar esto en el siguiente "tick" del navegador

    return () => {
      // Limpiamos el timeout si el componente se desmonta
      clearTimeout(timeoutId);
    };
  }, []);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      onSignatureChange('');
    }
  };

  return (
    <div className="relative w-full border border-gray-400/50 rounded-lg bg-white">
      <canvas ref={canvasRef} className="w-full h-48 rounded-lg"></canvas>
      <button 
        type="button" 
        onClick={handleClear}
        className="absolute top-2 right-2 bg-gray-200/80 text-gray-800 text-xs font-semibold py-1 px-3 rounded-full hover:bg-gray-300"
      >
        Limpiar
      </button>
    </div>
  );
}

export default SignaturePadComponent;