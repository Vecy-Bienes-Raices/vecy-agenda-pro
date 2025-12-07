import React, { useState, useEffect, useMemo } from 'react';
import { format, set, isBefore, isAfter, startOfDay, addDays } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';

const TIMEZONE = 'America/Bogota'; // Zona horaria fija para toda la app

// Helper para obtener "ahora" en la zona horaria de Bogotá
const getBogotaNow = () => {
  return toZonedTime(new Date(), TIMEZONE);
};

const CustomDateTimePicker = ({ label, selected, onChange, error }) => {
  // --- TIMEZONE-AWARE STATE ---
  // Inicializamos todo basado en la hora actual de Bogotá
  const [bogotaNow] = useState(getBogotaNow());

  // "Hoy" en Bogotá (inicio del día, 00:00:00)
  const [todayInBogota] = useState(() => {
    const now = getBogotaNow();
    return startOfDay(now);
  });

  // Estado para la fecha que se está viendo en el calendario (mes/año)
  const [viewDate, setViewDate] = useState(selected || bogotaNow);
  // Estado para la fecha completa seleccionada (solo día, mes, año)
  const [selectedDate, setSelectedDate] = useState(selected ? new Date(selected.toDateString()) : null);
  // Estado para la hora seleccionada en formato "HH:mm"
  const [selectedTime, setSelectedTime] = useState(selected ? `${String(selected.getHours()).padStart(2, '0')}:${String(selected.getMinutes()).padStart(2, '0')}` : null);
  // Estado para almacenar los horarios deshabilitados
  const [disabledTimes, setDisabledTimes] = useState(new Set());

  // --- GESTIÓN DE DISPONIBILIDAD (A FUTURO) ---
  // Actualmente solo aplica la regla de las 4 horas de antelación.
  // En una próxima fase, aquí consultaremos a Supabase ('solicitudes') para bloquear citas reales.
  useEffect(() => {
    // Por ahora limpiamos los bloqueos externos al cambiar de fecha
    setDisabledTimes(new Set());
  }, [selectedDate]);

  // Cuando se selecciona una fecha y una hora, se notifica al formulario padre.
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hour, minute] = selectedTime.split(':').map(Number);

      // 1. Tomamos la fecha seleccionada (que representa YYYY-MM-DD 00:00:00)
      // 2. Establecemos la hora y minuto
      const dateTimeLocal = set(selectedDate, { hours: hour, minutes: minute, seconds: 0, milliseconds: 0 });

      // 3. Convertimos esa "fecha local abstracta" a una fecha real en la zona horaria de Bogotá
      // fromZonedTime toma una fecha y asume que "esa hora" es en la zona horaria dada, devolviendo el UTC real.
      // E.g. Si el usuario seleccionó "14:30" para Bogotá, esto nos da el timestamp UTC correcto.
      const finalZonedDate = fromZonedTime(dateTimeLocal, TIMEZONE);

      onChange(finalZonedDate);
    } else {
      onChange(null); // Si la selección está incompleta, se envía null.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedTime]);

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
  // Intl es seguro aquí porque viewDate es un objeto Date estándar manejado como local en render
  // pero lo obtuvimos de source of truth de Bogota.
  const monthName = format(viewDate, 'MMMM', { locale: es });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Generar los horarios de 8 AM a 5 PM en intervalos de 15 minutos
  // Generar los horarios de 8 AM a 5 PM en intervalos de 15 minutos
  const timeSlots = useMemo(() => {
    const slots = [];
    // Usamos una fecha base arbitraria, solo nos importan las horas
    let currentTime = set(new Date(), { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 });
    const endTime = set(new Date(), { hours: 17, minutes: 0, seconds: 0, milliseconds: 0 }); // 5:00 PM

    while (isBefore(currentTime, endTime) || currentTime.getTime() === endTime.getTime()) {
      slots.push(format(currentTime, 'HH:mm'));
      currentTime = new Date(currentTime.getTime() + 15 * 60000);
    }
    return slots;
  }, []);

  // Clases condicionales para el estado de error
  const errorBorderClasses = 'border-red-500';
  const defaultBorderClasses = 'border-white/10';
  const errorLabelClasses = 'text-red-400';
  const defaultLabelClasses = 'text-off-white/80';

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

        {/* Grilla del Calendario */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map(day => <div key={day} className="text-xs font-bold text-off-white/50">{day}</div>)}
          {/* Espacios en blanco para los días antes del 1ro del mes */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
          {/* Días del mes */}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const dayNumber = day + 1;
            // We compare date parts to avoid timezone issues with the `<` operator.
            const isPast =
              isBefore(new Date(year, month, dayNumber), todayInBogota);

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

        {/* Selector de Hora (aparece al seleccionar una fecha) */}
        {selectedDate && (
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-center text-sm font-semibold text-off-white/80 mb-3">
              Selecciona una hora para el {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}:
            </p>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2">
              {timeSlots.map(time => {
                const isSelected = selectedTime === time;

                const isToday = selectedDate &&
                  selectedDate.getFullYear() === todayInBogota.getFullYear() &&
                  selectedDate.getMonth() === todayInBogota.getMonth() &&
                  selectedDate.getDate() === todayInBogota.getDate();

                let isTimeBlocked = false;
                if (isToday) {
                  // Calcula la hora mínima permitida (ahora en Bogotá + 4 horas)
                  const minAllowedTime = new Date(bogotaNow.getTime() + 4 * 60 * 60 * 1000);

                  // Construimos la fecha/hora del slot en Bogotá para comparar
                  const [slotHour, slotMinute] = time.split(':').map(Number);
                  const timeSlotDate = set(todayInBogota, { hours: slotHour, minutes: slotMinute });

                  if (isBefore(timeSlotDate, minAllowedTime)) isTimeBlocked = true;
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
                    className={`py-2 px-3 rounded-lg transition-all duration-200 text-sm ${timeBtnClass}`}
                  >
                    {/* Mostramos la hora en formato 12h AM/PM para el usuario */}
                    {format(set(new Date(), { hours: parseInt(time.split(':')[0]), minutes: parseInt(time.split(':')[1]) }), 'hh:mm a')}
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