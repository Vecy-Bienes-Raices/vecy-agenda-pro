import React, { useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const logoUrl = '/Vecy_logo_oficial.png';
import firmaJaniUrl from '../assets/jani 1.png'; // IMPORTANTE: Importamos la firma directamente
function ContratoPuntas() {
  const location = useLocation();
  const contractRef = useRef(null);
  // Obtenemos formData del estado de la navegación
  const { formData } = location.state || {};

  // Manejar el caso en que un usuario navegue directamente a esta página sin datos o no sea agente
  if (!formData || formData.solicitante_perfil !== 'Agente') {
    return (
      <div className="text-center text-off-white">
        <h2 className="text-2xl font-bold text-red-400">Acceso no autorizado</h2>
        <p className="mt-4">Esta página solo es accesible para agentes después de completar una solicitud.</p>
        <Link to="/formulario" className="mt-6 inline-block bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-2 px-6 rounded-lg transition-all">
          Volver al formulario
        </Link>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    const input = contractRef.current;
    const buttons = document.getElementById('contract-buttons');
    if (buttons) buttons.style.display = 'none'; // Ocultar botones antes de capturar

    html2canvas(input, {
      scale: 2, // Aumentar la escala para mejor resolución
      useCORS: true,
      backgroundColor: '#ffffff', // Fondo blanco explícito para el PDF
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const imgWidth = pdfWidth - 20; // Ancho con márgenes de 10mm a cada lado
      const imgHeight = imgWidth / ratio;

      let heightLeft = imgHeight;
      let position = 10; // Margen superior

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10; // Ajuste de posición para la siguiente página
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Contrato_Puntas_Vecy_${formData.solicitante_nombre.replace(/\s/g, '_')}.pdf`);
      if (buttons) buttons.style.display = 'flex'; // Mostrar botones de nuevo
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // El resto del código (el JSX que renderiza el contrato) vendrá en la siguiente parte.
  // ...
  return (
    // Wrapper div for the whole page content
    <div>
        {/* This is the part that will be converted to PDF */}
        <div ref={contractRef} className="bg-white text-grafito p-8 md:p-12 rounded-lg shadow-lg font-sans max-w-4xl mx-auto">
            <header className="flex justify-between items-center border-b-2 border-gray-300 pb-4 mb-8">
                <img src={logoUrl} alt="Logo Vecy" className="h-16 w-16" />
                <div className="text-right">
                    <h1 className="text-2xl font-bold font-serif text-volcanic-black">CONTRATO DE PUNTAS COMPARTIDAS</h1>
                    <p className="text-sm text-gray-500">Acuerdo de Colaboración Inmobiliaria</p>
                </div>
            </header>

            <section className="mb-6 text-sm leading-relaxed">
                <p className="mb-4">Entre los suscritos a saber, por una parte, <strong>JANI ALVES SOUZA</strong>, mayor de edad, identificada con la cédula de ciudadanía No. 41.057.506, en representación de <strong>VECY BIENES RAÍCES</strong>, quien en adelante se denominará <strong>EL AGENTE 1</strong>; y por otra parte, <strong>{formData.solicitante_nombre}</strong>, mayor de edad, identificado(a) con {formData.solicitante_tipo_documento} No. {formData.solicitante_numero_documento}, quien en adelante se denominará <strong>EL AGENTE 2</strong>, hemos convenido celebrar el presente contrato de colaboración, que se regirá por las siguientes cláusulas:</p>
            </section>

            {/* Cláusulas */}
            <div className="space-y-6 text-sm leading-relaxed">
                <section>
                    <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Primera: Objeto</h2>
                    <p>El objeto del presente contrato es establecer los términos y condiciones de la colaboración entre EL AGENTE 1 y EL AGENTE 2 para la prestación del servicio de intermediación en <strong>"{formData.opcion_negocio}"</strong>, del inmueble identificado con código <strong>{formData.codigo_inmueble || 'N/A'}</strong> y para el cual EL AGENTE 2 solicita al AGENTE 1 <strong>"{formData.servicio_solicitado}"</strong>, para el día <strong>{formatDate(formData.fecha_cita_bogota)}</strong>, en favor del cliente final presentado por EL AGENTE 2, Sr(a). <strong>{formData.interesado_nombre}</strong>, identificado(a) con {formData.interesado_tipo_documento} No. {formData.interesado_documento}.</p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Segunda: Honorarios</h2>
                    <p>Las partes acuerdan que, en caso de perfeccionarse exitosamente el negocio objeto de esta colaboración, los honorarios o comisiones generados serán distribuidos en partes iguales, correspondiendo un cincuenta por ciento (50%) para EL AGENTE 1 y un cincuenta por ciento (50%) para EL AGENTE 2, salvo acuerdo escrito en contrario.</p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Tercera: Validez y Firmas</h2>
                    <p>Este contrato se considera válido y vinculante desde la fecha de su generación, el día <strong>{formatDate(new Date().toISOString())}</strong>. Las partes aceptan la validez de las firmas aquí consignadas, ya sean virtuales (dibujadas) o digitales (archivo adjunto), como manifestación inequívoca de su consentimiento con los términos aquí expuestos. La validez de este acuerdo está supeditada a la aceptación previa por parte de EL AGENTE 2 de la Política de Privacidad y los Términos y Condiciones de <strong>Vecy Bienes Raíces</strong>, realizada en el formulario de solicitud.</p>
                </section>

                <section>
                    <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Cuarta: Notificaciones</h2>
                    <p>Para todos los efectos legales, las partes recibirán notificaciones en las siguientes direcciones:</p>
                    <ul className="list-none ml-4 mt-2 space-y-1">
                        <li><strong>EL AGENTE 1:</strong> Correo electrónico: <a href="mailto:vecybienesraices@gmail.com" className="text-blue-600 hover:underline">vecybienesraices@gmail.com</a>, Celular: +573166569719.</li>
                        <li><strong>EL AGENTE 2:</strong> Correo electrónico: <a href={`mailto:${formData.solicitante_email}`} className="text-blue-600 hover:underline">{formData.solicitante_email}</a>, Celular: {formData.solicitante_celular}.</li>
                    </ul>
                </section>
            </div>

            {/* Sección de Firmas */}
            <section className="mt-16">
                <p className="text-sm mb-8">En constancia de lo anterior, las partes firman el presente documento:</p>
                <div className="flex flex-col md:flex-row justify-around items-start gap-12">
                    {/* Firma AGENTE 1 */}
                    <div className="flex-1 text-center flex flex-col h-32">
                        <div className="flex-grow flex items-center justify-center">
                            <img src={firmaJaniUrl} alt="Firma Jani Alves Souza" className="max-h-20" />
                        </div>
                        <div className="border-t border-grafito pt-2 text-xs">
                            <p className="font-bold">JANI ALVES SOUZA</p>
                            <p>C.C. 41.057.506</p>
                            <p>AGENTE 1 - VECY BIENES RAÍCES</p>
                        </div>
                    </div>

                    {/* Firma AGENTE 2 */}
                    <div className="flex-1 text-center flex flex-col h-32">
                        <div className="flex-grow flex items-center justify-center">
                            {/* Muestra la firma sin importar el método, ya que ambas se guardan en `firma_virtual_base64` */}
                            {formData.firma_virtual_base64 ? (
                                <img src={formData.firma_virtual_base64} alt="Firma del Agente" className="max-h-20 bg-gray-50" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 italic">(Sin Firma)</div>
                            )}
                        </div>
                        <div className="border-t border-grafito pt-2 text-xs">
                            <p className="font-bold">{formData.solicitante_nombre}</p>
                            <p>{formData.solicitante_tipo_documento} No. {formData.solicitante_numero_documento}</p>
                            <p>AGENTE 2</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div id="contract-buttons" className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={handleDownloadPdf} className="bg-esmeralda hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50">
                Descargar Contrato en PDF
            </button>
            <Link to="/" className="bg-transparent hover:bg-white/10 border border-soft-gold text-soft-gold font-bold py-3 px-8 rounded-lg transition-all duration-300 text-center">
                Volver al Inicio
            </Link>
        </div>
    </div>
  );
}

export default ContratoPuntas;