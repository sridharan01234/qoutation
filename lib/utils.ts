import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "../lib/prisma";

/**
 * Formats a number into a price string with currency symbol
 * @param price - The price value to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted price string
 */
export function formatPrice(
  price: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Example usage:
// formatPrice(29.99) => "$29.99"
// formatPrice(29.99, 'EUR', 'de-DE') => "29,99 €"
// formatPrice(29.99, 'GBP') => "£29.99"

/**
 * Combines multiple class names and merges Tailwind CSS classes efficiently
 * @param inputs - Class names or conditional class name expressions
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a new quotation number
 * @returns Promise resolving to the generated quotation number
 */
export async function generateQuotationNumber() {
  try {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const prefix = 'QT';
    
    // Get the latest quotation for the current year/month
    const lastQuotation = await prisma.quotation.findFirst({
      where: {
        quotationNumber: {
          startsWith: `${prefix}-${year}${month}`,
        },
      },
      orderBy: {
        quotationNumber: 'desc',
      },
    });

    let sequentialNumber = 1;
    if (lastQuotation) {
      const lastNumber = parseInt(lastQuotation.quotationNumber.split('-').pop() || '0');
      sequentialNumber = lastNumber + 1;
    }

    // Format: QT-YYMM-XXXX (e.g., QT-2401-0001)
    const quotationNumber = `${prefix}-${year}${month}-${sequentialNumber.toString().padStart(4, '0')}`;
    
    return quotationNumber;
  } catch (error) {
    console.error('Error generating quotation number:', error);
    throw new Error('Failed to generate quotation number');
  }
}

export function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}