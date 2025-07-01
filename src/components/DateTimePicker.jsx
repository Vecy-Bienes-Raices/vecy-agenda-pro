import React, { useState, useEffect, useMemo } from 'react';
import { fetchBookedSlotsForDate } from '../api/mockApi';

function DateTimePicker({ value, onChange, label }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Función para obtener la fecha de hoy en formato YYYY-MM-DD
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Efecto para cargar los horarios ocupados cuando cambia la fecha
  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);
      fetchBookedSlotsForDate(selectedDate)
        .then(slots => {
          const disabledSlots = new Set();
          slots.forEach(slot => {
            // Añadimos el slot reservado
            disabledSlots.add(slot);

            // --- LÓGICA DEL BÚFER DE 30 MINUTOS ---
            // Añadimos también el siguiente slot de 15 minutos para bloquearlo
            const [hours, minutes] = slot.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes + 15, 0, 0);
            const nextSlot = date.toTimeString().slice(0, 5);
            disabledSlots.add(nextSlot);
          });
          setBookedSlots(disabledSlots);
        })
        .catch(err => console.error("Error fetching slots:", err))
        .finally(() => setIsLoading(false));
    }
  }, [selectedDate]);

  // Generamos la lista de todos los posibles horarios (de 8:00 a 17:00)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 8; h < 17; h++) { // 8 AM hasta 4 PM (16:xx)
      for (let m = 0; m < 60; m += 15) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        slots.push(`${hour}:${minute}`);
      }
    }
    // Añadimos la última hora manualmente: 5:00 PM
    slots.push('17:00');
    return slots;
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(''); // Reseteamos la hora al cambiar de fecha
    onChange({ target: { name: 'fecha_cita', value: '' } }); // Limpiamos el valor en el form padre
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    // Combinamos fecha y hora en el formato que espera el input datetime-local (ISO)
    const dateTimeString = `${selectedDate}T${time}`;
    onChange({ target: { name: 'fecha_cita', value: dateTimeString } });
  };

  return (
    <div>
      <label htmlFor="date-picker" className="block text-sm font-medium text-off-white/80 mb-1">
        {label}
      </label>
      <input
        id="date-picker"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        min={getTodayString()} // Restringe fechas pasadas
        className="w-full p-3 bg-white text-grafito border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-soft-gold transition"
      />

      {selectedDate && (
        <div className="mt-4">
          <p className="text-sm text-off-white/80 mb-2">Selecciona una hora disponible:</p>
          {isLoading ? (
            <p className="text-off-white/80">Cargando horarios...</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {timeSlots.map(time => {
                const isBooked = bookedSlots.has(time);
                const isSelected = time === selectedTime;

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-2 rounded-lg text-sm font-semibold transition-all
                      ${isBooked ? 'bg-grafito/50 text-off-white/40 cursor-not-allowed' : ''}
                      ${!isBooked && !isSelected ? 'bg-esmeralda/80 hover:bg-esmeralda text-white' : ''}
                      ${isSelected ? 'bg-soft-gold text-volcanic-black ring-2 ring-white' : ''}
                    `}
                  >
                    {time}
                    {isBooked && <span className="block text-xs opacity-70 -mt-1">(Ocupado)</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DateTimePicker;