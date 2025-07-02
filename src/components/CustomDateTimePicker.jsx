import React, { useState, useEffect, useMemo } from 'react';

const CustomDateTimePicker = ({ label, selected, onChange }) => {
  // Estado para la fecha que se está viendo en el calendario (mes/año)
  const [viewDate, setViewDate] = useState(selected || new Date());
  // Estado para la fecha completa seleccionada (solo día, mes, año)
  const [selectedDate, setSelectedDate] = useState(selected ? new Date(selected.toDateString()) : null);
  // Estado para la hora seleccionada en formato "HH:mm"
  const [selectedTime, setSelectedTime] = useState(selected ? `${String(selected.getHours()).padStart(2, '0')}:${String(selected.getMinutes()).padStart(2, '0')}` : null);
  // Estado para almacenar los horarios deshabilitados
  const [disabledTimes, setDisabledTimes] = useState(new Set());
  // Almacena el inicio del día de hoy para evitar seleccionar fechas pasadas.
  const [today] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

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
      // Bloquear la hora exacta y los 15 minutos posteriores (total 30 min de bloqueo).
      for (let i = 0; i < 2; i++) { // Bloquea el slot de la cita (i=0) y el siguiente (i=1).
        const timeToDisable = new Date(booking.getTime() + i * 15 * 60000);
        newDisabledTimes.add(`${String(timeToDisable.getHours()).padStart(2, '0')}:${String(timeToDisable.getMinutes()).padStart(2, '0')}`);
      }
    });
    setDisabledTimes(newDisabledTimes);
  }, [selectedDate]);

  // Cuando se selecciona una fecha y una hora, se notifica al formulario padre.
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const finalDate = new Date(selectedDate);
      finalDate.setHours(parseInt(hours, 10));
      finalDate.setMinutes(parseInt(minutes, 10));
      onChange(finalDate);
    } else {
      onChange(null); // Si la selección está incompleta, se envía null.
    }
  }, [selectedDate, selectedTime, onChange]);

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

  return (
    <div className="flex flex-col w-full">
      <label className="mb-2 text-sm font-medium text-off-white/80">{label}</label>
      <div className="bg-black/20 p-4 rounded-lg border border-white/10">
        {/* Encabezado del Calendario */}
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={() => changeMonth(-1)} className="text-2xl text-soft-gold/80 hover:text-soft-gold transition-colors">‹</button>
          <div className="text-center">
            <p className="font-semibold text-lg text-off-white capitalize">{monthName}</p>
            <p className="text-sm text-off-white/60">{year}</p>
          </div>
          <button type="button" onClick={() => changeMonth(1)} className="text-2xl text-soft-gold/80 hover:text-soft-gold transition-colors">›</button>
        </div>

        {/* Grilla del Calendario */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map(day => <div key={day} className="text-xs font-bold text-off-white/50">{day}</div>)}
          {/* Espacios en blanco para los días antes del 1ro del mes */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
          {/* Días del mes */}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const dayNumber = day + 1;
            const currentDate = new Date(year, month, dayNumber);
            const isPast = currentDate < today;
            const isSelected = selectedDate && selectedDate.getTime() === currentDate.getTime();

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

        {/* Selector de Hora (aparece al seleccionar una fecha) */}
        {selectedDate && (
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-center text-sm font-semibold text-off-white/80 mb-3">
              Selecciona una hora para el {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}:
            </p>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(time => {
                const isSelected = selectedTime === time;

                // Lógica para deshabilitar horas pasadas en el día actual
                const now = new Date();
                const isToday = selectedDate && selectedDate.getTime() === today.getTime();
                let isPastTime = false;
                if (isToday) {
                  const [hour, minute] = time.split(':').map(Number);
                  if (hour < now.getHours() || (hour === now.getHours() && minute < now.getMinutes())) {
                    isPastTime = true;
                  }
                }

                const isDisabled = disabledTimes.has(time) || isPastTime;

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
                    className={`py-2 px-3 rounded-lg transition-all duration-200 text-sm ${timeBtnClass}`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDateTimePicker;
