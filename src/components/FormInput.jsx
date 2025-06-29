import React from 'react';

// Volvemos a una versión más simple que no fuerza el modo oscuro.
function FormInput({ label, id, adornment, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-off-white/80 mb-1">
        {label}
      </label>
      <div className="relative">
        {adornment && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-grafito/80">
            {adornment}
          </span>
        )}
        <input
          id={id}
          {...props}
          // Usamos el fondo blanco sólido para todos los inputs.
          className={`w-full p-3 bg-white text-grafito border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-soft-gold transition ${adornment ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  );
}

export default FormInput;