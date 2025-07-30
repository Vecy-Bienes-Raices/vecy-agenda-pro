import React, { useState, useEffect, useMemo } from 'react';

// Helper to get the current time in Bogotá (UTC-5), which does not observe DST.
const getBogotaNow = () => {
  const now = new Date();
  // Get the UTC time by adding the local timezone offset
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  // Subtract 5 hours for Bogotá time
  return new Date(utc - (5 * 60 * 60000));
};

const CustomDateTimePicker = ({ label, selected, onChange, error }) => {
  // --- TIMEZONE-AWARE STATE ---
  // All "now" and "today" calculations are based on Bogotá time.
  const [bogotaNow] = useState(getBogotaNow());
  const [todayInBogota] = useState(() => {
    const d = getBogotaNow();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Estado para la fecha que se está viendo en el calendario (mes/año)
  const [viewDate, setViewDate] = useState(selected || bogotaNow);
  // Estado para la fecha completa seleccionada (solo día, mes, año)
  const [selectedDate, setSelectedDate] = useState(selected ? new Date(selected.toDateString()) : null);
  // Estado para la hora seleccionada en formato "HH:mm"
  const [selectedTime, setSelectedTime] = useState(selected ? `${String(selected.getHours()).padStart(2, '0')}:${String(selected.getMinutes()).padStart(2, '0')}` : null);
  // Estado para almacenar los horarios deshabilitados
  const [disabledTimes, setDisabledTimes] = useState(new Set());

  // --- SIMULACIÓN DE CITAS AGENDADAS ---
  // En una aplicación real, estos datos vendrían de una API al seleccionar una fecha.
  useEffect(() => {
    if (!selectedDate) return;

    // Esta función simula una llamada a la base de datos para el día seleccionado.
    // Para la demostración, solo se agregan citas si se elige el día 15 del mes.
    const getBookedAppointmentsForDate = (date) => {
      if (date.getDate() === 15) {
        return [
          new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0), // 9:00 AM
          new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14, 15), // 2:15 PM
        ];
      }
      return [];
    };

    const bookedAppointments = getBookedAppointmentsForDate(selectedDate);
    const newDisabledTimes = new Set();
    bookedAppointments.forEach(booking => {
      // Bloquear la hora exacta y los 15 minutos posteriores (total 30 min de bloqueo)
      for (let i = 0; i < 2; i++) {
        const timeToDisable = new Date(booking.getTime() + i * 15 * 60000);
        newDisabledTimes.add(`${String(timeToDisable.getHours()).padStart(2, '0')}:${String(timeToDisable.getMinutes()).padStart(2, '0')}`);
      }
    });
    setDisabledTimes(newDisabledTimes);
  }, [selectedDate]);

  // Cuando se selecciona una fecha y una hora, se notifica al formulario padre.
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hour, minute] = selectedTime.split(':');
      // Construct an ISO-like string with the Bogotá timezone offset (-05:00).
      // This ensures the created Date object represents the exact moment in Bogotá time,
      // regardless of the user's local timezone.
      const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}T${hour}:${minute}:00-05:00`;
      const finalDate = new Date(dateString);
      onChange(finalDate);
    } else {
      onChange(null); // Si la selección está incompleta, se envía null.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedTime]); // << -- CORRECCIÓN APLICADA AQUÍ: Se eliminó 'onChange' del array

  const handleDateSelect = (day) => {
    const newSelectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    setSelectedTime(null); // Resetea la hora al cambiar de fecha
  };

  const changeMonth = (amount) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };

  // --- Lógica para generar el calendario ---
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString('es-ES', { month: 'long' });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Generar los horarios de 8 AM a 5 PM en intervalos de 15 minutos
  const timeSlots = useMemo(() => {
    const slots = [];
    const baseDate = new Date();
    const startTime = new Date(baseDate.setHours(8, 0, 0, 0));
    const endTime = new Date(baseDate.setHours(17, 0, 0, 0));

    let currentTime = new Date(startTime);
    while (currentTime <= endTime) {
      slots.push(
        `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`
      );
      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }
    return slots;
  }, []);

  // Clases condicionales para el estado de error
  const errorBorderClasses = 'border-red-500';
  const defaultBorderClasses = 'border-white/10';
  const errorLabelClasses = 'text-red-400';
  const defaultLabelClasses = 'text-off-white/80';

  // --- ¡NUEVO! Helper para formatear la hora a formato 12h AM/PM ---
  const formatTimeTo12Hour = (time24) => {
    const [hour, minute] = time24.split(':');
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));
    // Usamos 'en-US' para el formato AM/PM estándar.
    // toLocaleTimeString se encargará de la conversión.
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="flex flex-col w-full">
      <label className={`mb-2 text-sm font-medium transition-colors duration-300 ${error ? errorLabelClasses : defaultLabelClasses}`}>{label}</label>
      <div className={`bg-black/20 p-4 rounded-lg border transition-colors duration-300 ${error ? errorBorderClasses : defaultBorderClasses}`}>
        {/* Encabezado del Calendario */}
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={() => changeMonth(-1)} className="text-2xl text-soft-gold/80 hover:text-soft-gold transition-colors">‹</button>
          <div className="text-center">
            <p className="font-semibold text-lg text-off-white capitalize">{monthName}</p>
            <p className="text-sm text-off-white/60">{year}</p>
          </div>
          <button type="button" onClick={() => changeMonth(1)} className="text-2xl text-soft-gold/80 hover:text-soft-gold transition-colors">›</button>
        </div>

        {/* --- MEJORA: Contenedor flexible para vista de escritorio --- */}
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Columna Izquierda: Calendario */}
          <div className="lg:w-[300px] flex-shrink-0">
            <div className="grid grid-cols-7 gap-1 text-center">
              {daysOfWeek.map(day => <div key={day} className="text-xs font-bold text-off-white/50">{day}</div>)}
              {/* Espacios en blanco para los días antes del 1ro del mes */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
              {/* Días del mes */}
              {Array.from({ length: daysInMonth }).map((_, day) => {
                const dayNumber = day + 1;
                // We compare date parts to avoid timezone issues with the `<` operator.
                const isPast =
                  year < todayInBogota.getFullYear() ||
                  (year === todayInBogota.getFullYear() && month < todayInBogota.getMonth()) ||
                  (year === todayInBogota.getFullYear() && month === todayInBogota.getMonth() && dayNumber < todayInBogota.getDate());

                const isSelected = selectedDate &&
                  selectedDate.getDate() === dayNumber &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;

                let dayClass = 'text-off-white/80 hover:bg-white/10';
                if (isPast) {
                  dayClass = 'text-off-white/30 cursor-not-allowed';
                } else if (isSelected) {
                  dayClass = 'bg-soft-gold text-volcanic-black font-bold';
                }

            return (
              <button
                type="button"
                key={dayNumber}
                onClick={() => !isPast && handleDateSelect(dayNumber)}
                disabled={isPast}
                className={`w-9 h-9 rounded-full transition-all duration-200 ${dayClass}`}
              >
                {dayNumber}
              </button>
            );
          })}
          </div>
          </div>

          {/* Columna Derecha: Selector de Hora (aparece al seleccionar una fecha) */}
          <div className="flex-grow mt-6 lg:mt-0 lg:border-l lg:border-white/10 lg:pl-6">
            {selectedDate ? (
              <div>
                <p className="text-center text-sm font-semibold text-off-white/80 mb-3">
                  Selecciona una hora para el {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}:
                </p>
                {/* --- MEJORA: Se usa un grid responsivo y se elimina el scroll para ver todas las horas --- */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {timeSlots.map(time => {
                    const isSelected = selectedTime === time;
                    
                    const isToday = selectedDate &&
                      selectedDate.getFullYear() === todayInBogota.getFullYear() &&
                      selectedDate.getMonth() === todayInBogota.getMonth() &&
                      selectedDate.getDate() === todayInBogota.getDate();

                    let isTimeBlocked = false;
                    if (isToday) {
                      const minAllowedTime = new Date(bogotaNow.getTime() + 4 * 60 * 60 * 1000);
                      const [hour, minute] = time.split(':').map(Number);
                      const timeSlotDate = new Date(selectedDate);
                      timeSlotDate.setHours(hour, minute, 0, 0);
                      if (timeSlotDate < minAllowedTime) isTimeBlocked = true;
                    }

                    const isDisabled = disabledTimes.has(time) || isTimeBlocked;

                    let timeBtnClass = '';
                    if (isDisabled) {
                      timeBtnClass = 'bg-gray-700 text-gray-500 cursor-not-allowed line-through';
                    } else if (isSelected) {
                      timeBtnClass = 'bg-soft-gold text-volcanic-black font-bold shadow-luminous-gold';
                    } else {
                      timeBtnClass = 'bg-esmeralda text-white hover:bg-green-500';
                    }

                    return (
                      <button
                        type="button"
                        key={time}
                        onClick={() => !isDisabled && setSelectedTime(time)}
                        disabled={isDisabled}
                        // --- MEJORA: Botones de hora uniformes y texto centrado ---
                        className={`py-2 px-3 rounded-lg transition-all duration-200 text-sm whitespace-nowrap flex items-center justify-center ${timeBtnClass}`}
                      >
                        {formatTimeTo12Hour(time)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center justify-center h-full">
                <p className="text-off-white/50">Selecciona un día para ver los horarios disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDateTimePicker;