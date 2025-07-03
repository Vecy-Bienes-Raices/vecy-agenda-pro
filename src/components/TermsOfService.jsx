import React from 'react';
import { Link } from 'react-router-dom';

const logoUrl = '/Vecy_logo_oficial.png';

function TermsOfService() {
  return (
    <div className="text-left max-w-4xl mx-auto text-off-white/90">
      <div className="text-center mb-10">
        <img src={logoUrl} alt="Logo oficial de Vecy" className="mx-auto h-20 w-20 mb-4" />
        <h1 className="text-3xl font-bold text-off-white">Términos y Condiciones de Uso</h1>
        <Link to="/formulario" className="text-soft-gold text-sm hover:underline mt-2 inline-block">
          ← Volver al formulario
        </Link>
      </div>

      <div className="space-y-8 text-base">
        <p className="italic">Modificado por última vez: 30/juni/2025</p>
        
        <p>Bienvenido a <strong>Vecy Bienes Raíces</strong>. Al acceder o utilizar nuestro sitio web y nuestro formulario de solicitud (en adelante, "el sitio"), aceptas y te comprometes a cumplir los siguientes términos y condiciones. Si no estás de acuerdo, por favor no utilices nuestros servicios.</p>

        <section>
          <h2 className="text-2xl font-semibold text-soft-gold mb-2">1. Uso del Sitio y Formulario</h2>
          <p>El uso de nuestro sitio está destinado a fines legales dentro del sector inmobiliario y de servicios asociados en Colombia. Queda prohibido cualquier uso que pueda dañar, sobrecargar o comprometer la integridad de nuestra plataforma. Al enviar un formulario, aceptas que la información proporcionada es precisa y verídica, y que lo haces con la intención legítima de solicitar nuestros servicios.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-soft-gold mb-2">2. Propiedad Intelectual</h2>
          <p>Todo el contenido del sitio, incluyendo textos, gráficos, logotipos, y el software de este formulario, es propiedad exclusiva de Vecy Bienes Raíces y está protegido por las leyes de propiedad intelectual. Queda estrictamente prohibida su reproducción o distribución sin nuestro consentimiento previo y por escrito.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-soft-gold mb-2">3. Tipos de Formularios y Servicios</h2>
          <p>Nuestro sitio utiliza formularios para diversas finalidades, tales como:</p>
          <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
            <li><strong>Solicitud de Servicios:</strong> Incluye, pero no se limita a, visitas a inmuebles, avalúos comerciales, préstamos sobre inmuebles, redacción de contratos y cursos de IA.</li>
            <li><strong>Intermediación Financiera:</strong> Vecy Bienes Raíces actúa como bróker o intermediario entre el cliente y prestamistas de dinero. No somos una entidad financiera y no ofrecemos préstamos directamente. No nos hacemos responsables por la aprobación o denegación del crédito por parte del prestamista.</li>
            <li><strong>Acuerdos de Corretaje:</strong> Para ciertos servicios, se requerirá la firma de un acuerdo de corretaje que establecerá los términos de nuestra relación profesional, incluyendo honorarios y comisiones.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-soft-gold mb-2">4. Legislación Aplicable</h2>
          <p>Estos términos y condiciones se rigen por las leyes de la República de Colombia. Cualquier disputa o controversia será sometida a la jurisdicción de los tribunales competentes de la ciudad de Bogotá.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-soft-gold mb-2">5. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Cualquier cambio será publicado en nuestro sitio web y entrará en vigor inmediatamente. Es tu responsabilidad revisar estos términos periódicamente.</p>
        </section>

      </div>
    </div>
  );
}

export default TermsOfService;