import React from 'react';

function FormSelect({ label, onChange, name, id, value, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-off-white/80 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          onChange={onChange}
          id={id}
          name={name}
          value={value}
          required
          // ¡AQUÍ ESTÁ EL CAMBIO! '[-webkit-font-smoothing:antialiased]' mejora la nitidez.
          className={`appearance-none w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-soft-gold transition [-webkit-font-smoothing:antialiased] ${!value ? 'text-gray-400' : 'text-grafito'}`}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-grafito">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default FormSelect;