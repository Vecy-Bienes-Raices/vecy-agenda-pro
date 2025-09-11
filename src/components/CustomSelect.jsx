import React, { useState, useEffect, useRef } from 'react';

function CustomSelect({ label, options, value, onChange, name, placeholder = "Selecciona...", error }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const errorButtonClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const defaultButtonClasses = 'border-gray-300 focus:ring-soft-gold focus:border-soft-gold';
  const errorLabelClasses = 'text-red-400';
  const defaultLabelClasses = 'text-off-white/80';

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleOptionClick = (optionValue) => {
    // Simulamos el objeto 'event' que espera la función handleChange del formulario
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${error ? errorLabelClasses : defaultLabelClasses}`}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 bg-white text-grafito border rounded-lg focus:ring-2 transition text-left flex justify-between items-center ${error ? errorButtonClasses : defaultButtonClasses}`}
      >
        <span className={selectedOption ? 'text-grafito' : 'text-gray-400'}>{displayValue}</span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className="w-full text-left px-4 py-2 text-grafito hover:bg-esmeralda hover:text-white transition-colors disabled:bg-gray-100 disabled:text-gray-400"
              disabled={option.disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;