// app/types/index.ts
export enum ProductStatus {
    IN_STOCK = 'IN_STOCK',
    LOW_STOCK = 'LOW_STOCK',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    DISCONTINUED = 'DISCONTINUED'
  }
  
  export interface Dimensions {
    length: number;
    width: number;
    height: number;
  }
  
  export interface Category {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ProductTag {
    id: string;
    name: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
    category: Category;
    price: number;
    stock: number;
    sku: string;
    image?: string;
    status: ProductStatus;
    featured: boolean;
    weight?: number;
    dimensions?: Dimensions;
    tags: ProductTag[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>;
  