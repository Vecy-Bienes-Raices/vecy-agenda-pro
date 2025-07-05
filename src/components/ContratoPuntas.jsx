import React, { useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '../supabaseClient';

const logoUrl = '/Vecy_logo_oficial.png';
import firmaJaniUrl from '../assets/jani 1.png';

function ContratoPuntas() {
  const location = useLocation();
  const contractRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { formData } = location.state || {};

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

  const handleGenerateAndSavePdf = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setFeedbackMessage('Iniciando proceso, por favor espera...');

    const input = contractRef.current;
    const buttons = document.getElementById('contract-buttons');
    if (buttons) buttons.style.display = 'none';

    try {
      setFeedbackMessage('Generando vista previa del contrato...');
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      setFeedbackMessage('Creando el documento PDF...');
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      const imgHeight = pdfWidth / ratio;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = -heightLeft;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`Contrato_Puntas_Vecy_${formData.solicitante_nombre.replace(/\s/g, '_')}.pdf`);
      setFeedbackMessage('PDF descargado. Guardando copia de seguridad en el sistema...');

      const pdfBlob = pdf.output('blob');
      const fileName = `contratos-puntas/agente_${formData.solicitante_numero_documento}_${Date.now()}.pdf`;

      const { data, error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) throw uploadError;
      console.log('PDF subido a Supabase:', data);
      setFeedbackMessage('¡Éxito! El contrato se ha descargado y guardado de forma segura.');
    } catch (error) {
      console.error('Error en el proceso del PDF:', error);
      setFeedbackMessage(`Error al guardar la copia: ${error.message}. Por favor, inténtalo de nuevo.`);
    } finally {
      if (buttons) buttons.style.display = 'flex';
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
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

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Primera: Objeto</h2>
            <p>Establecer los términos bajo los cuales EL AGENTE 1 y EL AGENTE 2 colaboran para la intermediación de <strong>{formData.opcion_negocio}</strong> del inmueble con código <strong>{formData.codigo_inmueble || 'N/A'}</strong>, solicitada para el <strong>{formatDate(formData.fecha_cita_bogota)}</strong>, en favor de <strong>{formData.interesado_nombre}</strong>, identificado(a) con {formData.interesado_tipo_documento} No. {formData.interesado_documento}.</p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Segunda: Honorarios</h2>
            <p>Los honorarios generados serán divididos en partes iguales (50% para cada parte), salvo acuerdo escrito distinto. Si EL AGENTE 2 solo refiere al cliente sin asistir o colaborar activamente, su comisión será del 20%.</p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Tercera: Obligaciones de las partes</h2>
            <p><strong>Obligaciones de EL AGENTE 1:</strong></p>
            <ul className="list-disc ml-6">
              <li>Promocionar y mostrar el inmueble a los clientes de EL AGENTE 2.</li>
              <li>Facilitar información y documentos para el cierre.</li>
              <li>Coordinar visitas conjuntas con EL AGENTE 2.</li>
            </ul>
            <p className="mt-4"><strong>Obligaciones de EL AGENTE 2:</strong></p>
            <ul className="list-disc ml-6">
              <li>Apoyar la promoción del inmueble con sus canales.</li>
              <li>Presentar prospectos a EL AGENTE 1.</li>
              <li>Asistir a visitas, negociaciones y cierre.</li>
              <li>Gestionar documentos y acompañamiento al cliente.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Cuarta: Confidencialidad</h2>
            <p>Ambas partes se comprometen a mantener confidencial toda la información del inmueble, clientes y condiciones de negocio.</p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Quinta: Resolución de Conflictos</h2>
            <p>Las diferencias serán resueltas inicialmente por vía amistosa. Si no se llega a un acuerdo, se recurrirá a mecanismos alternativos como la conciliación o el arbitraje conforme a la ley colombiana.</p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Sexta: Validez y Firmas</h2>
            <p>Este contrato tiene validez legal desde el momento de su generación digital. Las firmas electrónicas, ya sean dibujadas o adjuntas, son legalmente válidas conforme a la legislación colombiana.</p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-2 uppercase tracking-wider">Cláusula Séptima: Notificaciones</h2>
            <p>Las notificaciones se enviarán a:</p>
            <ul className="list-none ml-4 mt-2 space-y-1">
              <li><strong>EL AGENTE 1:</strong> vecybienesraices@gmail.com, +573166569719.</li>
              <li><strong>EL AGENTE 2:</strong> {formData.solicitante_email}, {formData.solicitante_celular}</li>
            </ul>
          </section>
        </div>

        <section className="mt-16">
          <p className="text-sm mb-8">En constancia de lo anterior, las partes firman el presente documento:</p>
          <div className="flex flex-col md:flex-row justify-around items-start gap-12">
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

            <div className="flex-1 text-center flex flex-col h-32">
              <div className="flex-grow flex items-center justify-center">
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
        <button onClick={handleGenerateAndSavePdf} disabled={isProcessing} className="bg-esmeralda hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 disabled:bg-gray-500 disabled:cursor-not-allowed">
          {isProcessing ? 'Procesando...' : 'Descargar y Guardar Contrato'}
        </button>
        <Link to="/" className="bg-transparent hover:bg-white/10 border border-soft-gold text-soft-gold font-bold py-3 px-8 rounded-lg transition-all duration-300 text-center">
          Volver al Inicio
        </Link>
      </div>
      {feedbackMessage && <p className="text-center text-white mt-4 animate-pulse">{feedbackMessage}</p>}
    </div>
  );
}

export default ContratoPuntas;
