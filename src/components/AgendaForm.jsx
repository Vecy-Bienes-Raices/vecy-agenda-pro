import React, { useState } from 'react';
import FormInput from './FormInput';
import SignaturePadComponent from './SignaturePad';
import FormSelect from './FormSelect';

const logoUrl = '/Vecy_logo_oficial.png';

function Spinner() { return (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-volcanic-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>); }

function AuthorizationCheckbox({ formData, handleChange, perfil }) { const legendText = perfil === 'Agente' ? '5. Autorización Final' : '4. Autorización'; return (<fieldset className="border-t-2 border-soft-gold pt-6"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">{legendText}</legend><div className="mt-6 flex items-start"><input id="autorizacion" name="autorizacion" type="checkbox" required checked={formData.autorizacion} onChange={handleChange} className="h-4 w-4 mt-1 bg-white border-off-white/50 text-soft-gold focus:ring-soft-gold rounded" /><label label htmlFor="autorizacion" className="ml-3 block text-sm text-off-white/80">
  He leído y acepto la <Link to="/terminos-y-condiciones" className="font-semibold text-soft-gold hover:underline">cláusula de confidencialidad y veracidad de datos</Link><span className="block mt-2">Yo, <span className="font-bold">{formData.solicitante_nombre || "{nombre}"}</span>, con número <span className="font-bold">{formData.solicitante_numero_documento || "{numeroDeDocumento}"}</span>, al enviar este formulario, confirmo bajo la gravedad de juramento que todos los datos proporcionados son precisos y verídicos. Autorizo a Vecy Bienes Raíces para que esta información sea utilizada de acuerdo con sus políticas para los fines establecidos en este formulario.</span></label></div></fieldset>); }

function AgendaForm({ onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [formData, setFormData] = useState({
    solicitante_nombre: '', solicitante_perfil: '', solicitante_email: '', solicitante_celular: '',
    solicitante_tipo_documento: '', solicitante_numero_documento: '',
    servicio_solicitado: '', opcion_negocio: '', codigo_inmueble: '', fecha_cita: '', cantidad_personas: '1',
    tipo_cliente: '', interesado_nombre: '', interesado_tipo_documento: '', interesado_documento: '',
    firma_virtual_base64: '', autorizacion: false, metodoFirma: 'virtual',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    let newState = { ...formData, [name]: val };

    if (name === 'solicitante_celular') {
      newState[name] = `+57${val.replace(/\D/g,'')}`;
    }
    
    // Si se cambia el tipo de cliente, reseteamos los campos dependientes.
    if (name === 'tipo_cliente') {
      newState = { ...newState, interesado_tipo_documento: '', interesado_documento: '' };
    }

    setFormData(newState);
  };

  const handleSignatureChange = (signatureData) => { setFormData(prevState => ({ ...prevState, firma_virtual_base64: signatureData })); };
  const handleConsent = () => { setConsentGiven(true); };
  const handleSubmit = async (event) => { event.preventDefault(); setError(''); if (!formData.autorizacion) { setError('Debes aceptar la cláusula de confidencialidad para continuar.'); return; } setIsSubmitting(true); try { const response = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) }); const result = await response.json(); if (!response.ok) { throw new Error(result.message || 'Hubo un problema al enviar la solicitud.'); } const nombre = encodeURIComponent(formData.solicitante_nombre); const email = encodeURIComponent(formData.solicitante_email); window.location.href = `/gracias?nombre=${nombre}&email=${email}`; } catch (error) { setError(error.message); setIsSubmitting(false); } };

  const showVisitDetails = formData.servicio_solicitado === 'Visitar un inmueble';
  const showBusinessOption = formData.servicio_solicitado === 'Visitar un inmueble' || formData.servicio_solicitado === 'Avalúo comercial';
  const showAgentSections = formData.solicitante_perfil === 'Agente';

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="text-center mb-8"><img src={logoUrl} alt="Logo oficial de Vecy" className="mx-auto h-20 w-20 mb-4" /><h2 className="text-3xl font-bold text-off-white">Formulario de Solicitud</h2><button type="button" onClick={onBack} className="text-soft-gold text-sm hover:underline mt-1">← Volver a la portada</button></div>
      {!consentGiven && (<fieldset className="border-t-2 border-soft-gold pt-6 mb-10 transition-opacity duration-500"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">Consentimiento de Datos</legend><p className="text-off-white/80 mt-2">
  Para continuar, es necesario tu consentimiento. Al hacer clic en "Sí, autorizo", confirmas que has leído y aceptas nuestra <Link to="/politica-privacidad" className="font-semibold text-soft-gold hover:underline">Política de Privacidad</Link> y nuestros <Link to="/terminos-y-condiciones" className="font-semibold text-soft-gold hover:underline">Términos y Condiciones</Link>. </p><div className="mt-6 flex gap-4"><button type="button" onClick={handleConsent} className="bg-esmeralda hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-all">Sí, autorizo</button><button type="button" className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-all">NO</button></div></fieldset>)}
      <div className={`transition-opacity duration-700 ${consentGiven ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
        {consentGiven && (
          <>
            <fieldset className="border-t-2 border-soft-gold pt-6 mb-10"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">1. Tus Datos</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"><FormInput onChange={handleChange} value={formData.solicitante_nombre} label="Nombre Completo" id="solicitante_nombre" name="solicitante_nombre" type="text" required /><FormSelect value={formData.solicitante_perfil} label="Perfil" id="perfil" name="solicitante_perfil" onChange={handleChange}><option value="" disabled>Selecciona...</option><option value="Cliente directo">Cliente directo</option><option value="Agente">Agente</option></FormSelect><FormInput onChange={handleChange} value={formData.solicitante_email} label="Correo Electrónico" id="solicitante_email" name="solicitante_email" type="email" required /><FormInput onChange={handleChange} value={formData.solicitante_celular.substring(3)} label="Celular" id="solicitante_celular" name="solicitante_celular" type="tel" required adornment="+57" /><FormSelect value={formData.solicitante_tipo_documento} label="Tipo de Documento" id="solicitante_tipo_documento" name="solicitante_tipo_documento" onChange={handleChange}><option value="" disabled>Selecciona...</option><option value="Cédula de ciudadanía">Cédula de ciudadanía</option><option value="Cédula de extranjería">Cédula de extranjería</option><option value="Pasaporte">Pasaporte</option></FormSelect><FormInput onChange={handleChange} value={formData.solicitante_numero_documento} label="Número de Documento" id="solicitante_numero_documento" name="solicitante_numero_documento" type="text" required /></div></fieldset>
            <fieldset className="border-t-2 border-soft-gold pt-6 mb-10"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">2. Detalles de la Solicitud</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"><FormSelect value={formData.servicio_solicitado} label="¿Qué servicio necesitas?" id="servicio_solicitado" name="servicio_solicitado" onChange={handleChange}><option value="" disabled>Selecciona un servicio...</option><option value="Visitar un inmueble">Visitar un inmueble</option><option value="Avalúo comercial">Avalúo comercial</option><option value="Préstamo sobre inmueble">Préstamo sobre inmueble</option><option value="Redacción de contrato">Redacción de contrato</option><option value="Marketing Digital con IA">Marketing Digital con IA</option><option value="Curso de IA">Curso de IA</option></FormSelect>{showBusinessOption && (<FormSelect value={formData.opcion_negocio} label="Opción de Negocio" id="opcion_negocio" name="opcion_negocio" onChange={handleChange}><option value="" disabled>Selecciona...</option><option value="Venta">Venta</option><option value="Arriendo">Arriendo</option></FormSelect>)}<FormInput value={formData.codigo_inmueble} onChange={handleChange} label="Código del Inmueble o Servicio" id="codigo_inmueble" name="codigo_inmueble" type="text" /></div>{showVisitDetails && (<div className="transition-all duration-500 ease-in-out mt-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><FormInput onChange={handleChange} value={formData.fecha_cita || ''} label="Fecha y Hora de la Visita" id="fecha_cita" name="fecha_cita" type="datetime-local" /><FormInput onChange={handleChange} value={formData.cantidad_personas} label="¿Cuántas personas ingresarán?" id="cantidad_personas" name="cantidad_personas" type="number" defaultValue="1" /></div></div>)}</fieldset>
            {showAgentSections && (<>
              <fieldset className="border-t-2 border-soft-gold pt-6 mb-10"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">3. Presenta a tu Cliente</legend><div className="p-4 bg-black/10 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 gap-6"><FormSelect value={formData.tipo_cliente} label="Tu cliente es:" id="tipo_cliente" name="tipo_cliente" onChange={handleChange}><option value="" disabled>Selecciona...</option><option value="Persona">Persona</option><option value="Empresa">Empresa</option></FormSelect><FormInput value={formData.interesado_nombre} onChange={handleChange} label={formData.tipo_cliente === 'Persona' ? "Nombre completo del cliente" : "Razón Social de la Empresa"} id="interesado_nombre" name="interesado_nombre" type="text" /><FormSelect key={formData.tipo_cliente} value={formData.interesado_tipo_documento} label={formData.tipo_cliente === 'Persona' ? "Tipo de documento del cliente" : "Tipo de identidad empresarial"} id="interesado_tipo_documento" name="interesado_tipo_documento" onChange={handleChange}>{formData.tipo_cliente === 'Persona' ? (<><option value="" disabled>Selecciona...</option><option value="Cédula de ciudadanía">Cédula de ciudadanía</option><option value="Cédula de extranjería">Cédula de extranjería</option><option value="Pasaporte">Pasaporte</option></>) : (<><option value="" disabled>Selecciona...</option><option value="NIT">NIT</option><option value="RUT">RUT</option><option value="Registro Mercantil">Registro Mercantil</option></>)}</FormSelect><FormInput value={formData.interesado_documento} onChange={handleChange} label={formData.tipo_cliente === 'Persona' ? "Número de documento del cliente" : "Número de NIT/Registro"} id="interesado_documento" name="interesado_documento" type="text" /></div></fieldset>
              <fieldset className="border-t-2 border-soft-gold pt-6"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">4. Firma del Agente</legend><div className="mt-4"><label className="block text-sm font-medium text-off-white/80">Elige el método de firma:</label><div className="mt-2 flex gap-6"><label className="flex items-center text-off-white/80"><input type="radio" name="metodoFirma" value="virtual" checked={formData.metodoFirma === 'virtual'} onChange={handleChange} className="mr-2 h-4 w-4 bg-transparent border-off-white/50 text-soft-gold focus:ring-soft-gold" />Firma Virtual (Dibujar)</label><label className="flex items-center text-off-white/80"><input type="radio" name="metodoFirma" value="digital" checked={formData.metodoFirma === 'digital'} onChange={handleChange} className="mr-2 h-4 w-4 bg-transparent border-off-white/50 text-soft-gold focus:ring-soft-gold" />Firma Digital (Subir archivo)</label></div>{formData.metodoFirma === 'virtual' && <div className="mt-4"><label className="block text-sm font-medium text-off-white/80 mb-2">Por favor, firma en el siguiente recuadro:</label><SignaturePadComponent onSignatureChange={handleSignatureChange} /></div>}{formData.metodoFirma === 'digital' && <div className="mt-4"><label htmlFor="firma_digital_upload" className="block text-sm font-medium text-off-white/80 mb-2">Sube el archivo de tu firma (PDF, PNG, JPG):</label><input type="file" id="firma_digital_upload" name="firma_digital_upload" className="w-full text-sm text-off-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-soft-gold/20 file:text-soft-gold hover:file:bg-soft-gold/30" /></div>}</div></fieldset>
            </>)}
            <AuthorizationCheckbox formData={formData} handleChange={handleChange} perfil={formData.solicitante_perfil} />
            <div className="mt-8"><button type="submit" disabled={isSubmitting} className="w-full bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-4 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-luminous-gold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? <Spinner /> : null}{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}</button></div>
            {error && (<div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>)}
          </>
        )}
      </div>
    </form>
  );
}

export default AgendaForm;