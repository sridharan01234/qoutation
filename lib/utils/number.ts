/**
 * Number formatting utility functions
 */

/**
 * Pads a number with leading zeros
 * @param num The number to pad
 * @param size The desired string length
 * @returns The padded number string
 */
export function padNumber(num: number, size: number): string {
  return String(num).padStart(size, '0');
}