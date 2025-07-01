import React from 'react';

// Este componente ahora acepta 'maxLength' y 'pattern' para las validaciones.
function FormInput({ label, id, adornment, placeholder, maxLength, pattern, ...props }) {
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
          placeholder={placeholder || ''}
          maxLength={maxLength}
          pattern={pattern}
          {...props}
          className={`w-full p-3 bg-white text-grafito border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-soft-gold transition placeholder:text-gray-400 ${adornment ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  );
}

export default FormInput;