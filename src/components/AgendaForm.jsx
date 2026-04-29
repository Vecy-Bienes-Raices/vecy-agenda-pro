import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import FormInput from './FormInput';
// Lazy load del componente de firma para no cargar la librería 'signature_pad' al inicio
const SignaturePadComponent = React.lazy(() => import('./SignaturePad'));


import CustomDateTimePicker from './CustomDateTimePicker';
import CustomSelect from './CustomSelect';
import AuthModal from './AuthModal';
import { validateForm } from '../utils/validations';
import { fetchProfile, updateProfile, submitSolicitud } from '../services/apiService';

const logoUrl = '/vecy_nuevo_logo.webp';

function Spinner() {
  return (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-volcanic-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
}

function AuthorizationCheckbox({ formData, handleChange, isAgentView, error }) {
  const legendText = isAgentView ? '5. Autorización Final' : '4. Autorización';
  const legendClasses = `text-xl font-semibold px-2 -ml-2 transition-colors duration-300 ${error ? 'text-red-400' : 'text-off-white'}`;
  const labelClasses = `ml-3 block text-sm transition-colors duration-300 ${error ? 'text-red-400' : 'text-off-white/80'}`;
  const fieldsetClasses = `border-t-2 pt-6 transition-colors duration-300 ${error ? 'border-red-500' : 'border-soft-gold'}`;
  const checkboxClasses = `h-4 w-4 mt-1 bg-white accent-esmeralda focus:ring-soft-gold rounded transition-colors duration-300 ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-off-white/50'}`;

  return (
    <fieldset className={fieldsetClasses}>
      <legend className={legendClasses}>{legendText}</legend>
      <div className="mt-6 flex items-start"><input id="autorizacion" name="autorizacion" type="checkbox" required checked={formData.autorizacion} onChange={handleChange} className={checkboxClasses} />
        <label htmlFor="autorizacion" className={labelClasses}>
          He leído y acepto la <Link to="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="font-semibold text-soft-gold hover:underline">cláusula de confidencialidad y veracidad de datos</Link>.
          <span className="block mt-2">
            Yo, <span className="font-bold">{formData.solicitante_nombre || "{nombre}"}</span>, con número <span className="font-bold">{formData.solicitante_numero_documento || "{numeroDeDocumento}"}</span>, al enviar este formulario, confirmo bajo la gravedad de juramento que todos los datos proporcionados son precisos y verídicos. Autorizo a Vecy Bienes Raíces para que esta información sea utilizada de acuerdo con sus políticas para los fines establecidos en este formulario.
          </span>
        </label>
      </div>
    </fieldset>
  );
}

function AgendaForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const loadProfile = async (currentSession) => {
    const { data } = await fetchProfile(currentSession);
    if (data) {
      setFormData(prev => ({
        ...prev,
        solicitante_email: currentSession.user.email || prev.solicitante_email,
        solicitante_nombre: data.full_name || prev.solicitante_nombre,
        solicitante_celular: data.celular || prev.solicitante_celular,
        solicitante_tipo_documento: data.tipo_documento || prev.solicitante_tipo_documento,
        solicitante_numero_documento: data.numero_documento || prev.solicitante_numero_documento,
        solicitante_perfil: data.perfil || prev.solicitante_perfil,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        solicitante_email: currentSession.user.email || prev.solicitante_email,
        solicitante_nombre: currentSession.user.user_metadata.full_name || prev.solicitante_nombre,
      }));
    }
  };

  // Efecto para verificar sesión y cargar datos del perfil
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadProfile(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  const [formData, setFormData] = useState({
    solicitante_nombre: '', solicitante_perfil: '', solicitante_email: '', solicitante_celular: '',
    solicitante_tipo_documento: '', solicitante_numero_documento: '',
    servicio_solicitado: '', opcion_negocio: '', codigo_inmueble: '', fecha_cita_bogota: null, cantidad_personas: '',
    tipo_cliente: '', interesado_nombre: '', interesado_tipo_documento: '', interesado_documento: '',
    firma_virtual_base64: '', autorizacion: false, metodoFirma: '', firma_digital_archivo: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Al subir un archivo, se guarda su representación Base64 y el objeto del archivo.
      setFormData(prev => ({
        ...prev,
        firma_virtual_base64: reader.result,
        firma_digital_archivo: file,
        firma_fechahora_audit: new Date().toISOString() // Captura timestamp de subida
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const rawValue = type === 'checkbox' ? checked : value;
    setFormData(prev => {
      let val = rawValue;
      let newState = { ...prev, [name]: val };

      // Validaciones y formateo en tiempo real
      if (name === 'solicitante_nombre') {
        // Solo permite letras, espacios y caracteres con tilde/ñ
        newState[name] = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      }
      else if (name === 'solicitante_celular') newState[name] = `+57${val.replace(/\D/g, '')}`;
      else if (name === 'solicitante_numero_documento' && prev.solicitante_tipo_documento !== 'Pasaporte') newState[name] = val.replace(/\D/g, '');
      else if (name === 'interesado_documento' && ((prev.tipo_cliente === 'Persona' && prev.interesado_tipo_documento !== 'Pasaporte') || prev.tipo_cliente === 'Empresa')) newState[name] = val.replace(/\D/g, '');

      // Lógica de limpieza de campos dependientes
      if (name === 'tipo_cliente') { newState.interesado_nombre = ''; newState.interesado_tipo_documento = ''; newState.interesado_documento = ''; }
      else if (name === 'solicitante_tipo_documento') newState.solicitante_numero_documento = '';
      else if (name === 'interesado_tipo_documento') newState.interesado_documento = '';
      else if (name === 'metodoFirma') {
        newState.firma_virtual_base64 = '';
        newState.firma_digital_archivo = null;
        newState.firma_fechahora_audit = null; // Reset audit
      }

      return newState;
    });
  };

  // 2. CORRECCIÓN: Se envuelve la función en `useCallback` para evitar re-renderizados innecesarios.
  const handleDateChange = useCallback((date) => {
    setFormData(prev => ({ ...prev, fecha_cita_bogota: date }));
  }, []); // El array de dependencias está vacío porque `setFormData` es estable y nunca cambia.

  const handleSignatureChange = useCallback((signatureData) => {
    setFormData(prevState => ({
      ...prevState,
      firma_virtual_base64: signatureData,
      firma_digital_archivo: null,
      firma_fechahora_audit: new Date().toISOString() // Captura timestamp de firma
    }));
  }, []);

  const handleConsent = useCallback(() => { setConsentGiven(true); }, []);

  const handleDecline = useCallback(() => {
    navigate('/declinado');
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      const fieldErrorFlags = Object.keys(validationErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setFormErrors(fieldErrorFlags);
      setError(Object.values(validationErrors)[0]);
      return;
    }

    setIsSubmitting(true);

    try {
      // Formatear la fecha y la hora
      let fecha_cita_texto = null;
      let hora_cita = null;

      if (formData.fecha_cita_bogota) {
        const dateObject = new Date(formData.fecha_cita_bogota);
        fecha_cita_texto = new Intl.DateTimeFormat('es-ES', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }).format(dateObject);
        hora_cita = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Bogota'
        }).format(dateObject);
      }

      // Preparar el payload limpio
      const payload = { ...formData, fecha_cita_texto, hora_cita, cantidad_personas: parseInt(formData.cantidad_personas, 10) || null };
      delete payload.fecha_cita_bogota;
      delete payload.firma_digital_archivo;
      if (payload.solicitante_celular) payload.solicitante_celular = payload.solicitante_celular.replace('+', '');
      Object.keys(payload).forEach(key => { if (typeof payload[key] === 'string') payload[key] = payload[key].trim(); });

      // La Edge Function genera el ID, inserta en BD y envía notificaciones
      await submitSolicitud(payload, session);

      navigate('/gracias', { state: { formData } });

    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setError(error.message || 'No se pudo completar la solicitud. Revisa tu conexión o inténtalo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPassport = formData.solicitante_tipo_documento === 'Pasaporte';
  const isClientPassport = formData.interesado_tipo_documento === 'Pasaporte';
  const showVisitDetails = formData.servicio_solicitado === 'Visitar inmueble';
  const showBusinessOption = formData.servicio_solicitado === 'Visitar inmueble' || formData.servicio_solicitado === 'Avalúo comercial';
  const showAgentSections = formData.solicitante_perfil === 'Agente';
  const perfilOptions = [{ value: 'Cliente directo', label: 'Cliente directo' }, { value: 'Agente', label: 'Agente' }];
  const tipoDocumentoOptions = [{ value: 'Cédula de ciudadanía', label: 'Cédula de ciudadanía' }, { value: 'Cédula de extranjería', label: 'Cédula de extranjería' }, { value: 'Pasaporte', label: 'Pasaporte' }];
  const servicioOptions = [{ value: 'Visitar inmueble', label: 'Visitar inmueble' }, { value: 'Avalúo comercial', label: 'Avalúo comercial' }, { value: 'Préstamo sobre inmueble', label: 'Préstamo sobre inmueble' }, { value: 'Redacción de contrato', label: 'Redacción de contrato' }, { value: 'Marketing Digital con IA', label: 'Marketing Digital con IA' }, { value: 'Curso de IA', label: 'Curso de IA' }];
  const negocioOptions = [{ value: 'Venta', label: 'Venta' }, { value: 'Arriendo', label: 'Arriendo' }];
  const tipoClienteOptions = [{ value: 'Persona', label: 'Persona' }, { value: 'Empresa', label: 'Empresa' }];
  const tipoDocumentoClienteOptions = formData.tipo_cliente === 'Persona' ? [{ value: 'Cédula de ciudadanía', label: 'Cédula de ciudadanía' }, { value: 'Cédula de extranjería', label: 'Cédula de extranjería' }, { value: 'Pasaporte', label: 'Pasaporte' }] : [{ value: 'NIT', label: 'NIT' }, { value: 'RUT', label: 'RUT' }, { value: 'Registro Mercantil', label: 'Registro Mercantil' }];
  const cantidadPersonasOptions = [{ value: '1', label: '1 persona' }, { value: '2', label: '2 personas' }, { value: '3', label: '3 personas' }, { value: '4', label: '4 personas' }, { value: '5', label: '5 personas' }, { value: '6', label: '6 personas' }];
  const radioError = !!formErrors.metodoFirma;
  const radioClasses = `mr-2 h-4 w-4 bg-transparent accent-esmeralda focus:ring-soft-gold rounded-full transition-colors duration-300 ${radioError ? 'border-red-500 ring-1 ring-red-500' : 'border-off-white/50'}`;

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="text-center mb-8">
        <img src={logoUrl} alt="Logo oficial de Vecy" className="mx-auto h-20 w-20 mb-4" />
        <h2 className="text-3xl font-bold text-off-white">Verificación de Identidad</h2>
        <Link to="/" className="text-soft-gold text-sm hover:underline mt-1 inline-block">← Volver a la portada</Link>
      </div>

      {!session ? (
        <div className="text-center mb-8 bg-black/20 p-6 rounded-xl border border-soft-gold/30 backdrop-blur-sm mx-auto max-w-2xl">
          <p className="text-soft-gold font-semibold mb-2 flex items-center justify-center gap-2">
            <span className="text-xl">⚠️</span> Atención
          </p>
          <p className="text-off-white/90 mb-6 text-base leading-relaxed">
            Por motivos de seguridad y para garantizar la veracidad de la información, <strong>es obligatorio iniciar sesión o registrarse</strong> para continuar con el formulario.
          </p>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-3 px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-luminous-gold transform hover:-translate-y-0.5"
          >
            INICIAR SESIÓN / REGISTRARSE
          </button>
        </div>
      ) : (
        <div className="text-center mb-8">
          <p className="text-off-white mb-2">Hola, <span className="font-bold text-soft-gold">{session.user.user_metadata.full_name || session.user.email}</span></p>
          <button
            type="button"
            onClick={async () => { await supabase.auth.signOut(); setSession(null); setConsentGiven(false); navigate(0); }}
            className="text-sm text-off-white/60 hover:text-soft-gold underline transition-colors"
          >
            (Cerrar Sesión / Cambiar cuenta)
          </button>
        </div>
      )}

      {/* Sección de Consentimiento */}
      {!consentGiven && (
        <fieldset
          className={`border-t-2 border-soft-gold pt-6 mb-10 transition-all duration-500 ${!session ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}
        >
          <legend className="text-xl font-semibold text-off-white px-2 -ml-2">Consentimiento de Datos</legend>
          <p className="text-off-white/80 mt-2">Para continuar, es necesario tu consentimiento. Al hacer clic en "Sí, autorizo", confirmas que has leído y aceptas nuestra <Link to="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="font-semibold text-soft-gold hover:underline">Política de Privacidad</Link> y nuestros <Link to="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="font-semibold text-soft-gold hover:underline">Términos y Condiciones</Link>.</p>
          <div className="mt-6 flex gap-4">
            <button type="button" onClick={handleConsent} disabled={!session} className="bg-esmeralda hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 disabled:cursor-not-allowed">Sí, autorizo</button>
            <button type="button" onClick={handleDecline} disabled={!session} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/50 disabled:cursor-not-allowed">NO</button>
          </div>
          {!session && <p className="text-soft-gold text-sm mt-4 font-semibold animate-pulse">🔒 Inicia sesión arriba para habilitar esta opción.</p>}
        </fieldset>
      )}
      <div className={`transition-opacity duration-700 ${consentGiven ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
        {consentGiven && (
          <>
            <fieldset className="border-t-2 border-soft-gold pt-6 mb-10"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">1. Tus Datos</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormInput onChange={handleChange} value={formData.solicitante_nombre} label="Nombre Completo" id="solicitante_nombre" name="solicitante_nombre" type="text" placeholder="Ej: Juan Pérez" required error={!!formErrors.solicitante_nombre} />
              <CustomSelect label="Perfil" name="solicitante_perfil" value={formData.solicitante_perfil} onChange={handleChange} options={perfilOptions} placeholder="Selecciona tu perfil..." error={!!formErrors.solicitante_perfil} />
              <FormInput onChange={handleChange} value={formData.solicitante_email} label="Correo Electrónico" id="solicitante_email" name="solicitante_email" type="email" placeholder="tucorreo@ejemplo.com" required error={!!formErrors.solicitante_email} />
              <FormInput onChange={handleChange} value={formData.solicitante_celular.substring(3)} label="Celular" id="solicitante_celular" name="solicitante_celular" type="tel" placeholder="3001234567" required adornment="+57" maxLength="10" pattern="[0-9]*" error={!!formErrors.solicitante_celular} />
              <CustomSelect label="Tipo de Documento" name="solicitante_tipo_documento" value={formData.solicitante_tipo_documento} onChange={handleChange} options={tipoDocumentoOptions} placeholder="Selecciona un documento..." error={!!formErrors.solicitante_tipo_documento} />
              <FormInput onChange={handleChange} value={formData.solicitante_numero_documento} label="Número de Documento" id="solicitante_numero_documento" name="solicitante_numero_documento" type={isPassport ? "text" : "tel"} pattern={isPassport ? ".*" : "[0-9]*"} placeholder="Ej: 1234567890" required maxLength="15" error={!!formErrors.solicitante_numero_documento} />
            </div></fieldset>
            <fieldset className="border-t-2 border-soft-gold pt-6 mb-10"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">2. Detalles de la Solicitud</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <CustomSelect label="¿Qué servicio necesitas?" name="servicio_solicitado" value={formData.servicio_solicitado} onChange={handleChange} options={servicioOptions} placeholder="Selecciona un servicio..." error={!!formErrors.servicio_solicitado} />
              {showBusinessOption && (<CustomSelect label="Opción de Negocio" name="opcion_negocio" value={formData.opcion_negocio} onChange={handleChange} options={negocioOptions} placeholder="Selecciona..." error={!!formErrors.opcion_negocio} />)}
              <FormInput value={formData.codigo_inmueble} onChange={handleChange} label="Código del Inmueble o Servicio" id="codigo_inmueble" name="codigo_inmueble" type="text" placeholder="Ej: 110AB" required error={!!formErrors.codigo_inmueble} />
            </div>
              {showVisitDetails && (
                <div className="transition-all duration-500 ease-in-out mt-6 flex flex-col gap-6">
                  <CustomDateTimePicker label="Fecha y Hora de la Visita" selected={formData.fecha_cita_bogota} onChange={handleDateChange} error={!!formErrors.fecha_cita_bogota} />
                  <CustomSelect label="¿Cuántas personas ingresarán?" name="cantidad_personas" value={formData.cantidad_personas} onChange={handleChange} options={cantidadPersonasOptions} placeholder="Selecciona una cantidad..." error={!!formErrors.cantidad_personas} />
                </div>
              )}</fieldset>
            {showAgentSections && (<>
              <fieldset className="border-t-2 border-soft-gold pt-6 mb-10"><legend className="text-xl font-semibold text-off-white px-2 -ml-2">3. Presenta a tu Cliente</legend><div className="p-4 bg-black/10 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomSelect label="Tu cliente es:" name="tipo_cliente" value={formData.tipo_cliente} onChange={handleChange} options={tipoClienteOptions} placeholder="Selecciona..." error={!!formErrors.tipo_cliente} />
                <FormInput value={formData.interesado_nombre} onChange={handleChange} label={formData.tipo_cliente === 'Persona' ? "Nombre completo del cliente" : "Razón Social de la Empresa"} id="interesado_nombre" name="interesado_nombre" type="text" placeholder="Nombre o Razón Social" error={!!formErrors.interesado_nombre} />
                <CustomSelect label={formData.tipo_cliente === 'Persona' ? "Tipo de documento del cliente" : "Tipo de identidad empresarial"} name="interesado_tipo_documento" value={formData.interesado_tipo_documento} onChange={handleChange} options={tipoDocumentoClienteOptions} placeholder="Selecciona..." error={!!formErrors.interesado_tipo_documento} />
                <FormInput value={formData.interesado_documento} onChange={handleChange} label={formData.tipo_cliente === 'Persona' ? "Número de documento del cliente" : "Número de NIT/Registro"} id="interesado_documento" name="interesado_documento" type={formData.tipo_cliente === 'Empresa' || (formData.tipo_cliente === 'Persona' && !isClientPassport) ? 'tel' : 'text'} pattern={formData.tipo_cliente === 'Empresa' || (formData.tipo_cliente === 'Persona' && !isClientPassport) ? '[0-9]*' : '.*'} placeholder="Número" maxLength="15" error={!!formErrors.interesado_documento} />
              </div></fieldset>
              <fieldset className={`border-t-2 pt-6 transition-colors duration-300 ${!!formErrors.metodoFirma || !!formErrors.firma_virtual_base64 || !!formErrors.firma_digital_archivo ? 'border-red-500' : 'border-soft-gold'}`}><legend className="text-xl font-semibold text-off-white px-2 -ml-2">4. Firma del Agente</legend><div className="mt-4">
                <label className={`block text-sm font-medium transition-colors duration-300 ${!!formErrors.metodoFirma ? 'text-red-400' : 'text-off-white/80'}`}>Elige el método de firma:</label>
                <div className="mt-2 flex gap-6">
                  <label className={`flex items-center transition-colors duration-300 ${!!formErrors.metodoFirma ? 'text-red-400' : 'text-off-white/80'}`}><input type="radio" name="metodoFirma" value="virtual" checked={formData.metodoFirma === 'virtual'} onChange={handleChange} className={radioClasses} /> Firma Virtual (Dibujar)</label>
                  <label className={`flex items-center transition-colors duration-300 ${!!formErrors.metodoFirma ? 'text-red-400' : 'text-off-white/80'}`}><input type="radio" name="metodoFirma" value="digital" checked={formData.metodoFirma === 'digital'} onChange={handleChange} className={radioClasses} /> Firma Digital (Subir archivo)</label>
                </div>
                {formData.metodoFirma === 'virtual' && <div className="mt-4"><label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${!!formErrors.firma_virtual_base64 ? 'text-red-400' : 'text-off-white/80'}`}>Por favor, firma en el siguiente recuadro:</label>
                  <React.Suspense fallback={<div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Cargando pad de firma...</div>}>
                    <SignaturePadComponent onSignatureChange={handleSignatureChange} />
                  </React.Suspense>
                </div>}
                {formData.metodoFirma === 'digital' && (<div className="mt-4"><label htmlFor="firma_digital_upload" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${!!formErrors.firma_digital_archivo ? 'text-red-400' : 'text-off-white/80'}`}>Sube el archivo de tu firma (PNG, JPG):</label><input type="file" id="firma_digital_upload" name="firma_digital_archivo" onChange={handleFileChange} accept=".png,.jpg,.jpeg" className={`w-full text-sm text-off-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-soft-gold/20 file:text-soft-gold hover:file:bg-soft-gold/30 ${!!formErrors.firma_digital_archivo ? 'ring-2 ring-red-500 rounded-lg p-2' : ''}`} /></div>)}
              </div></fieldset>
            </>)}
            <AuthorizationCheckbox formData={formData} handleChange={handleChange} isAgentView={showAgentSections} error={!!formErrors.autorizacion} />
            <div className="mt-8"><button type="submit" disabled={isSubmitting} className="w-full bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-4 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-luminous-gold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? <Spinner /> : null}{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}</button></div>
            {error && (<div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>)}
          </>
        )}
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </form>
  );
}

export default AgendaForm;