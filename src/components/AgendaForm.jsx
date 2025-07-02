import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from './FormInput';
import SignaturePadComponent from './SignaturePad';
import CustomDateTimePicker from './CustomDateTimePicker';
import CustomSelect from './CustomSelect'; // Importamos el nuevo componente personalizado

const logoUrl = '/Vecy_logo_oficial.png';

function Spinner() {
  return (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-volcanic-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
}

function AuthorizationCheckbox({ formData, handleChange, perfil }) {
  const legendText = perfil === 'Agente' ? '5. Autorización Final' : '4. Autorización';
  return (
    <fieldset className="border-t-2 border-soft-gold pt-6">
      <legend className="text-xl font-semibold text-off-white px-2 -ml-2">{legendText}</legend>
      <div className="mt-6 flex items-start"><input id="autorizacion" name="autorizacion" type="checkbox" required checked={formData.autorizacion} onChange={handleChange} className="h-4 w-4 mt-1 bg-white border-off-white/50 accent-esmeralda focus:ring-soft-gold rounded" />
        <label htmlFor="autorizacion" className="ml-3 block text-sm text-off-white/80">
          He leído y acepto la <Link to="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="font-semibold text-soft-gold hover:underline">cláusula de confidencialidad y veracidad de datos</Link>.
          <span className="block mt-2">
            Yo, <span className="font-bold">{formData.solicitante_nombre || "{nombre}"}</span>, con número <span className="font-bold">{formData.solicitante_numero_documento || "{numeroDeDocumento}"}</span>, al enviar este formulario, confirmo bajo la gravedad de juramento que todos los datos proporcionados son precisos y verídicos. Autorizo a Vecy Bienes Raíces para que esta información sea utilizada de acuerdo con sus políticas para los fines establecidos en este formulario.
          </span>
        </label>
      </div>
    </fieldset>
  );
}

function AgendaForm({ onBack }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [formData, setFormData] = useState({
    solicitante_nombre: '', solicitante_perfil: '', solicitante_email: '', solicitante_celular: '',
    solicitante_tipo_documento: '', solicitante_numero_documento: '',
    servicio_solicitado: '', opcion_negocio: '', codigo_inmueble: '', fecha_cita: null, cantidad_personas: '0',
    tipo_cliente: '', interesado_nombre: '', interesado_tipo_documento: '', interesado_documento: '',
    firma_virtual_base64: '', autorizacion: false, metodoFirma: 'virtual',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const rawValue = type === 'checkbox' ? checked : value;

    // Usar la forma funcional de setState para garantizar el estado más reciente
    setFormData(prev => {
      let val = rawValue;
      if (typeof val === 'string') {
        val = val.trim();
      }

      let newState = { ...prev, [name]: val };

      // Lógica de sanitización para campos numéricos
      if (name === 'solicitante_celular') {
        newState[name] = `+57${val.replace(/\D/g, '')}`;
      } else if (name === 'solicitante_numero_documento') {
        // Si el tipo de documento NO es pasaporte, solo permitir números
        if (prev.solicitante_tipo_documento !== 'Pasaporte') {
          newState[name] = val.replace(/\D/g, '');
        }
      } else if (name === 'interesado_documento') {
        // Si el cliente es Persona y su tipo de doc NO es pasaporte, solo números
        if (prev.tipo_cliente === 'Persona' && prev.interesado_tipo_documento !== 'Pasaporte') {
          newState[name] = val.replace(/\D/g, '');
        }
        // Si el cliente es Empresa, también forzamos solo números para NIT/RUT
        if (prev.tipo_cliente === 'Empresa') {
          newState[name] = val.replace(/\D/g, '');
        }
      }

      // Lógica para resetear campos dependientes
      if (name === 'tipo_cliente') {
        newState.interesado_nombre = '';
        newState.interesado_tipo_documento = '';
        newState.interesado_documento = '';
      } else if (name === 'solicitante_tipo_documento') {
        // Limpiar el número de documento al cambiar el tipo para evitar datos inválidos
        newState.solicitante_numero_documento = '';
      } else if (name === 'interesado_tipo_documento') {
        // Limpiar el número de documento del cliente al cambiar el tipo
        newState.interesado_documento = '';
      }

      return newState;
    });
  };

  // Handler específico para el componente de fecha y hora personalizado
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, fecha_cita: date }));
  };

  const handleSignatureChange = (signatureData) => { setFormData(prevState => ({ ...prevState, firma_virtual_base64: signatureData })); };
  const handleConsent = () => { setConsentGiven(true); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    // --- VALIDACIÓN DINÁMICA MEJORADA ---
    const fieldsToValidate = {
      solicitante_nombre: 'Nombre Completo',
      solicitante_perfil: 'Perfil',
      solicitante_email: 'Correo Electrónico',
      solicitante_celular: 'Celular',
      solicitante_tipo_documento: 'Tipo de Documento',
      solicitante_numero_documento: 'Número de Documento',
      servicio_solicitado: 'Servicio solicitado',
    };

    if (formData.servicio_solicitado === 'Visitar un inmueble') {
      fieldsToValidate.fecha_cita = 'Fecha y Hora de la Visita';
      fieldsToValidate.cantidad_personas = 'Número de personas';
    }
    if (formData.solicitante_perfil === 'Agente') {
      fieldsToValidate.tipo_cliente = 'Tipo de cliente';
      fieldsToValidate.interesado_nombre = 'Nombre del cliente';
      fieldsToValidate.interesado_tipo_documento = 'Tipo de documento del cliente';
      fieldsToValidate.interesado_documento = 'Número de documento del cliente';
    }

    for (const field in fieldsToValidate) {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        setError(`El campo "${fieldsToValidate[field]}" es obligatorio.`);
        return;
      }
      // Validación específica para la cantidad de personas
      if (field === 'cantidad_personas' && parseInt(formData[field], 10) < 1) {
        setError('El campo "Número de personas" debe ser al menos 1.');
        return;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.solicitante_email)) {
      setError('Por favor, ingresa un formato de correo electrónico válido.');
      return;
    }
    if (!formData.autorizacion) {
      setError('Debes aceptar la cláusula de confidencialidad para continuar.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Formatear la fecha a un string estándar (ISO) antes de enviarla
      const dataToSend = {
        ...formData,
        fecha_cita: formData.fecha_cita ? formData.fecha_cita.toISOString() : null,
      };

      const response = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSend) });

      if (!response.ok) {
        let errorMessage = `Error del servidor: ${response.status}`;
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.message || errorMessage;
        } catch (e) { /* No hacer nada si el cuerpo del error no es JSON */ }
        throw new Error(errorMessage);
      }

      navigate(`/gracias?nombre=${encodeURIComponent(formData.solicitante_nombre)}&email=${encodeURIComponent(formData.solicitante_email)}`);
    } catch (error) {
      console.error("Error detallado al enviar:", error);
      setError(error.message || 'No se pudo completar la solicitud. Revisa tu conexión o inténtalo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPassport = formData.solicitante_tipo_documento === 'Pasaporte';
  const isClientPassport = formData.interesado_tipo_documento === 'Pasaporte';
  const showVisitDetails = formData.servicio_solicitado === 'Visitar un inmueble';
  const showBusinessOption = formData.servicio_solicitado === 'Visitar un inmueble' || formData.servicio_solicitado === 'Avalúo comercial';
  const showAgentSections = formData.solicitante_perfil === 'Agente';

  // --- Opciones para los menús desplegables ---
  const perfilOptions = [
    { value: 'Cliente directo', label: 'Cliente directo' },
    { value: 'Agente', label: 'Agente' },
  ];

  const tipoDocumentoOptions = [
    { value: 'Cédula de ciudadanía', label: 'Cédula de ciudadanía' },
    { value: 'Cédula de extranjería', label: 'Cédula de extranjería' },
    { value: 'Pasaporte', label: 'Pasaporte' },
  ];

  const servicioOptions = [
    { value: 'Visitar un inmueble', label: 'Visitar un inmueble' },
    { value: 'Avalúo comercial', label: 'Avalúo comercial' },
    { value: 'Préstamo sobre inmueble', label: 'Préstamo sobre inmueble' },
    { value: 'Redacción de contrato', label: 'Redacción de contrato' },
    { value: 'Marketing Digital con IA', label: 'Marketing Digital con IA' },
    { value: 'Curso de IA', label: 'Curso de IA' },
  ];

  const negocioOptions = [
    { value: 'Venta', label: 'Venta' },
    { value: 'Arriendo', label: 'Arriendo' },
  ];

  const tipoClienteOptions = [
    { value: 'Persona', label: 'Persona' },
    { value: 'Empresa', label: 'Empresa' },
  ];

  const tipoDocumentoClienteOptions = formData.tipo_cliente === 'Persona'
    ? [
        { value: 'Cédula de ciudadanía', label: 'Cédula de ciudadanía' },
        { value: 'Cédula de extranjería', label: 'Cédula de extranjería' },
        { value: 'Pasaporte', label: 'Pasaporte' },
      ]
    : [
        { value: 'NIT', label: 'NIT' }, { value: 'RUT', label: 'RUT' }, { value: 'Registro Mercantil', label: 'Registro Mercantil' },
      ];

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="text-center mb-8"><img src={logoUrl} alt="Logo oficial de Vecy" className="mx-auto h-20 w-20 mb-4" /><h2 className="text-3xl font-bold text-off-white">Formulario de Solicitud</h2><button type="button" onClick={onBack} className="text-soft-gold text-sm hover:underline mt-1">← Volver a la portada</button></div>
      {!consentGiven && (<fieldset className="border-t-2 border-soft-gold pt-6 mb-10 transition-opacity duration-500"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">Consentimiento de Datos</legend><p className="text-off-white/80 mt-2">Para continuar, es necesario tu consentimiento. Al hacer clic en "Sí, autorizo", confirmas que has leído y aceptas nuestra <Link to="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="font-semibold text-soft-gold hover:underline">Política de Privacidad</Link> y nuestros <Link to="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="font-semibold text-soft-gold hover:underline">Términos y Condiciones</Link>.</p><div className="mt-6 flex gap-4"><button type="button" onClick={handleConsent} className="bg-esmeralda hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-all">Sí, autorizo</button><button type="button" className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-all">NO</button></div></fieldset>)}
      <div className={`transition-opacity duration-700 ${consentGiven ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
        {consentGiven && (
          <>
            <fieldset className="border-t-2 border-soft-gold pt-6 mb-10"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">1. Tus Datos</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormInput onChange={handleChange} value={formData.solicitante_nombre} label="Nombre Completo" id="solicitante_nombre" name="solicitante_nombre" type="text" placeholder="Ej: Juan Pérez" required />
              <CustomSelect
                label="Perfil"
                name="solicitante_perfil"
                value={formData.solicitante_perfil}
                onChange={handleChange}
                options={perfilOptions}
                placeholder="Selecciona tu perfil..."
              />
              <FormInput onChange={handleChange} value={formData.solicitante_email} label="Correo Electrónico" id="solicitante_email" name="solicitante_email" type="email" placeholder="tucorreo@ejemplo.com" required />
              <FormInput onChange={handleChange} value={formData.solicitante_celular.substring(3)} label="Celular" id="solicitante_celular" name="solicitante_celular" type="tel" placeholder="3001234567" required adornment="+57" maxLength="10" pattern="[0-9]*" />
              <CustomSelect
                label="Tipo de Documento"
                name="solicitante_tipo_documento"
                value={formData.solicitante_tipo_documento}
                onChange={handleChange}
                options={tipoDocumentoOptions}
                placeholder="Selecciona un documento..."
              />
              <FormInput onChange={handleChange} value={formData.solicitante_numero_documento} label="Número de Documento" id="solicitante_numero_documento" name="solicitante_numero_documento" type={isPassport ? "text" : "tel"} pattern={isPassport ? ".*" : "[0-9]*"} placeholder="Ej: 1234567890" required maxLength="15" />
            </div></fieldset>
            
            <fieldset className="border-t-2 border-soft-gold pt-6 mb-10"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">2. Detalles de la Solicitud</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <CustomSelect label="¿Qué servicio necesitas?" name="servicio_solicitado" value={formData.servicio_solicitado} onChange={handleChange} options={servicioOptions} placeholder="Selecciona un servicio..." />
              {showBusinessOption && (<CustomSelect label="Opción de Negocio" name="opcion_negocio" value={formData.opcion_negocio} onChange={handleChange} options={negocioOptions} placeholder="Selecciona..." />)}
              <FormInput value={formData.codigo_inmueble} onChange={handleChange} label="Código del Inmueble o Servicio" id="codigo_inmueble" name="codigo_inmueble" type="text" placeholder="Ej: 110AB" />
            </div>
            {showVisitDetails && (
              <div className="transition-all duration-500 ease-in-out mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomDateTimePicker label="Fecha y Hora de la Visita" selected={formData.fecha_cita} onChange={handleDateChange} />
                  <FormInput onChange={handleChange} value={formData.cantidad_personas} label="¿Cuántas personas ingresarán?" id="cantidad_personas" name="cantidad_personas" type="number" min="1" placeholder="Ej: 3" required />
                </div>
              </div>
            )}
            </fieldset>
            
            {showAgentSections && (<>
              <fieldset className="border-t-2 border-soft-gold pt-6 mb-10">
                <legend className="text-xl font-semibold text-off-white px-2 -ml-2">3. Presenta a tu Cliente</legend>
                <div className="p-4 bg-black/10 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomSelect
                    label="Tu cliente es:"
                    name="tipo_cliente"
                    value={formData.tipo_cliente}
                    onChange={handleChange}
                    options={tipoClienteOptions}
                    placeholder="Selecciona..."
                  />
                  <FormInput value={formData.interesado_nombre} onChange={handleChange} label={formData.tipo_cliente === 'Persona' ? "Nombre completo del cliente" : "Razón Social de la Empresa"} id="interesado_nombre" name="interesado_nombre" type="text" placeholder="Nombre o Razón Social" />
                  <CustomSelect
                    label={formData.tipo_cliente === 'Persona' ? "Tipo de documento del cliente" : "Tipo de identidad empresarial"}
                    name="interesado_tipo_documento"
                    value={formData.interesado_tipo_documento}
                    onChange={handleChange}
                    options={tipoDocumentoClienteOptions}
                    placeholder="Selecciona..."
                  />
                  <FormInput
                    value={formData.interesado_documento}
                    onChange={handleChange}
                    label={formData.tipo_cliente === 'Persona' ? "Número de documento del cliente" : "Número de NIT/Registro"}
                    id="interesado_documento"
                    name="interesado_documento"
                    type={formData.tipo_cliente === 'Empresa' || (formData.tipo_cliente === 'Persona' && !isClientPassport) ? 'tel' : 'text'}
                    pattern={formData.tipo_cliente === 'Empresa' || (formData.tipo_cliente === 'Persona' && !isClientPassport) ? '[0-9]*' : '.*'}
                    placeholder="Número"
                    maxLength="15"
                  />
                </div>
              </fieldset>
              <fieldset className="border-t-2 border-soft-gold pt-6"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">4. Firma del Agente</legend><div className="mt-4"><label className="block text-sm font-medium text-off-white/80">Elige el método de firma:</label><div className="mt-2 flex gap-6"><label className="flex items-center text-off-white/80"><input type="radio" name="metodoFirma" value="virtual" checked={formData.metodoFirma === 'virtual'} onChange={handleChange} className="mr-2 h-4 w-4 bg-transparent border-off-white/50 accent-esmeralda focus:ring-soft-gold" />Firma Virtual (Dibujar)</label><label className="flex items-center text-off-white/80"><input type="radio" name="metodoFirma" value="digital" checked={formData.metodoFirma === 'digital'} onChange={handleChange} className="mr-2 h-4 w-4 bg-transparent border-off-white/50 accent-esmeralda focus:ring-soft-gold" />Firma Digital (Subir archivo)</label></div>{formData.metodoFirma === 'virtual' && <div className="mt-4"><label className="block text-sm font-medium text-off-white/80 mb-2">Por favor, firma en el siguiente recuadro:</label><SignaturePadComponent onSignatureChange={handleSignatureChange} /></div>}{formData.metodoFirma === 'digital' && <div className="mt-4"><label htmlFor="firma_digital_upload" className="block text-sm font-medium text-off-white/80 mb-2">Sube el archivo de tu firma (PDF, PNG, JPG):</label><input type="file" id="firma_digital_upload" name="firma_digital_upload" className="w-full text-sm text-off-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-soft-gold/20 file:text-soft-gold hover:file:bg-soft-gold/30" /></div>}</div></fieldset>
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