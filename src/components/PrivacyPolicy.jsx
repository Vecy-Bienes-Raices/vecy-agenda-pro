import React from 'react';

const logoUrl = '/Vecy_logo_oficial.png';

function PrivacyPolicy({ onBack }) {
  return (
    <div className="text-left max-w-4xl mx-auto text-off-white/90">
      <div className="text-center mb-10">
        <img src={logoUrl} alt="Logo oficial de Vecy" className="mx-auto h-20 w-20 mb-4" />
        <h1 className="text-3xl font-bold text-off-white">Política de Privacidad de Vecy Bienes Raíces</h1>
        <button type="button" onClick={onBack} className="text-soft-gold text-sm hover:underline mt-2">
          ← Volver al formulario
        </button>
      </div>

      <div className="space-y-6 text-base">
        <p className="italic">Modificado por última vez: 11/abril/2023</p>
        
        <p>En <strong>Vecy Bienes Raíces</strong>, la confianza y la transparencia son el pilar de nuestra relación contigo. Nos comprometemos a proteger la privacidad de nuestros clientes y usuarios, utilizando la tecnología no solo para agilizar procesos, sino para hacerlo de una forma segura y consciente.</p>

        <h2 className="text-2xl font-semibold text-soft-gold pt-4 border-t border-soft-gold/20">Nuestro Compromiso Eco-Digital</h2>
        <p>Creemos en un futuro sostenible. Por eso, hemos eliminado el uso de papel en nuestros procesos publicitarios y de gestión, evitando la exposición de información sensible en fachadas y ahorrando miles de litros de agua. Al usar nuestros servicios digitales, te unes a este compromiso con la seguridad y el medio ambiente.</p>
        
        <h2 className="text-2xl font-semibold text-soft-gold pt-4 border-t border-soft-gold/20">1. Información que Recopilamos</h2>
        <p>Recopilamos información personal cuando visitas nuestro sitio, te registras, llenas un formulario o te comunicas con nosotros. Esto puede incluir, entre otros, tu nombre, correo electrónico, número de teléfono y los detalles específicos de tu solicitud.</p>

        <h2 className="text-2xl font-semibold text-soft-gold pt-4 border-t border-soft-gold/20">2. Cómo Usamos tu Información</h2>
        <p>Utilizamos tu información para:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Procesar eficientemente tus solicitudes de servicios.</li>
          <li>Comunicarnos contigo acerca del estado de tus trámites.</li>
          <li>Personalizar y mejorar tu experiencia en nuestra plataforma.</li>
          <li>Cumplir con todas las obligaciones legales y reglamentarias.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-soft-gold pt-4 border-t border-soft-gold/20">3. Con Quién la Compartimos</h2>
        <p>Tu privacidad es sagrada. No vendemos, intercambiamos ni transferimos tu información a terceros. Únicamente compartimos datos con socios de confianza (como notarias o entidades financieras) que son esenciales para completar tu solicitud, siempre bajo estrictos acuerdos de confidencialidad.</p>
        
        <h2 className="text-2xl font-semibold text-soft-gold pt-4 border-t border-soft-gold/20">4. Cómo Contactarnos</h2>
        <p>Si tienes alguna pregunta sobre esta política o sobre cómo manejamos tus datos, no dudes en contactarnos:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
            <li><strong>Correo electrónico:</strong> vecybienesraices@gmail.com</li>
            <li><strong>Teléfono celular con WhatsApp:</strong> +57 3166569719</li>
        </ul>
      </div>
    </div>
  );
}

export default PrivacyPolicy;