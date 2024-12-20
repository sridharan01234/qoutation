/**
 * String manipulation utility functions
 */

/**
 * Capitalizes the first letter of a string
 * @param str The input string to capitalize
 * @returns The capitalized string
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}