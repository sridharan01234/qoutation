// lib/api.ts
import { Product } from "../types/type";
import  {prisma as db}  from "./db"; // Your database configuration

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
