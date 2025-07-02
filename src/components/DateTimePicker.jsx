import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';

// Importamos los estilos base y nuestros estilos personalizados
import "react-datepicker/dist/react-datepicker.css";
import "./DateTimePicker.css";

// Registramos el idioma español para que los meses y días aparezcan correctamente
registerLocale('es', es);

const CustomDateTimePicker = ({ label, selected, onChange }) => {
  // El componente DatePicker se renderiza dentro de un Popover,
  // por lo que debemos asegurarnos de que se muestre por encima de otros elementos.
  const renderCustomHeader = ({ date, decreaseMonth, increaseMonth }) => (
    <div className="flex justify-between items-center px-4 py-2">
      <button onClick={decreaseMonth} className="text-xl hover:text-soft-gold">{"<"}</button>
      <span className="text-lg font-semibold">{date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
      <button onClick={increaseMonth} className="text-xl hover:text-soft-gold">{">"}</button>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <label className="mb-2 text-sm font-medium text-off-white/80">{label}</label>
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        locale="es"
        dateFormat="d 'de' MMMM, yyyy h:mm aa"
        placeholderText="Selecciona fecha y hora"
        renderCustomHeader={renderCustomHeader} // <-- ¡Este es el cambio clave!
        className="w-full bg-white/5 border border-white/20 text-off-white placeholder-off-white/40 text-sm rounded-lg focus:ring-soft-gold focus:border-soft-gold block p-2.5 transition-all"
        popperClassName="z-50" // Asegura que el calendario aparezca por encima de otros elementos
      />
    </div>
  );
};

export default CustomDateTimePicker;
