/**
 * Quotation-related utility functions
 */

import { prisma } from "../prisma";
import { padNumber } from "./number";

/**
 * Generates a quotation number with format QT-YYMM-XXX
 * @returns Generated quotation number
 */
export async function generateQuotationNumber(): Promise<string> {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const prefix = 'QT';

  let lastQuotationNumber = "001"; // Default starting number
  const lastQuotation = await prisma.quotation.findFirst({
    where: {
      createdAt: {
        gte: new Date(today.getFullYear(), today.getMonth(), 1),
        lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      },
    },
    orderBy: {
      quotationNumber: 'desc',
    },
  });

  if (lastQuotation) {
    const currentNumber = parseInt(lastQuotation.quotationNumber.slice(-3));
    lastQuotationNumber = padNumber(currentNumber + 1, 3);
  }

  return `${prefix}-${year}${month}-${lastQuotationNumber}`;
}