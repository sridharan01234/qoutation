/**
 * Date manipulation utility functions
 */

/**
 * Formats a date into YYYY-MM-DD string
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Gets the start of a day
 * @param date - The date to process
 * @returns Date object set to start of day
 */
export function startOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}