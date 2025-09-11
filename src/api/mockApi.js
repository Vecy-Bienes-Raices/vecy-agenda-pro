// Este archivo simula una llamada a un backend/base de datos.
// En un proyecto real, aquí harías una petición fetch a tu servidor.

const MOCKED_BOOKINGS = {
  // Formato: "YYYY-MM-DD": ["HH:mm", "HH:mm"]
  "2024-07-28": ["10:00", "14:15"],
  "2024-07-29": ["09:30", "11:00", "16:45"],
};

/**
 * Simula la obtención de citas agendadas para una fecha específica.
 * @param {string} dateString - La fecha en formato "YYYY-MM-DD".
 * @returns {Promise<string[]>} Una promesa que resuelve con un array de horarios ocupados (ej: ["10:00", "14:15"]).
 */
export const fetchBookedSlotsForDate = async (dateString) => {
  console.log(`Simulando fetch para la fecha: ${dateString}`);
  // Simulamos un retraso de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Devolvemos los horarios para esa fecha, o un array vacío si no hay ninguna.
  return MOCKED_BOOKINGS[dateString] || [];
};