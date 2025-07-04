import React from 'react';

// Este componente ahora acepta 'maxLength' y 'pattern' para las validaciones.
function FormInput({ label, id, adornment, placeholder, maxLength, pattern, error, ...props }) {
  const errorInputClasses = 'border-red-500 bg-white focus:border-red-500 focus:ring-red-500';
  const defaultInputClasses = 'border-gray-300 bg-white focus:ring-soft-gold focus:border-soft-gold';
  const errorLabelClasses = 'text-red-400';
  const defaultLabelClasses = 'text-off-white/80';
  const errorAdornmentClasses = 'text-red-400/80';
  const defaultAdornmentClasses = 'text-grafito/80';

  return (
    <div>
      <label htmlFor={id} className={`block text-sm font-medium mb-1 transition-colors duration-300 ${error ? errorLabelClasses : defaultLabelClasses}`}>
        {label}
      </label>
      <div className="relative">
        {adornment && (
          <span className={`absolute inset-y-0 left-0 flex items-center pl-3 transition-colors duration-300 ${error ? errorAdornmentClasses : defaultAdornmentClasses}`}>
            {adornment}
          </span>
        )}
        <input
          id={id}
          placeholder={placeholder || ''} maxLength={maxLength} pattern={pattern}
          {...props}
          className={`w-full p-3 text-grafito rounded-lg border focus:ring-2 transition-colors duration-300 placeholder-gray-400/70 ${adornment ? 'pl-10' : ''} ${error ? errorInputClasses : defaultInputClasses}`}
        />
      </div>
    </div>
  );
}

export default FormInput;