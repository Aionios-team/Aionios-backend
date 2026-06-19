export function formatFecha(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('es-MX', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}
