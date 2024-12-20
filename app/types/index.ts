import { QuotationStatus, PaymentTerms } from "@prisma/client";

export enum ProductStatus {
  IN_STOCK = "IN_STOCK",
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED",
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

export type ProductFormData = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "category"
>;

export interface QuotationItem {
  id: string;
  quotationId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
  };
}

export interface Attachment {
  id: string;
  quotationId: string;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  userId: string;
  date: Date;
  validUntil: Date;
  status: QuotationStatus;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  discountType?: string;
  shippingCost: number;
  totalAmount: number;
  notes?: string;
  terms?: string;
  paymentTerms: PaymentTerms;
  currency: string;
  revisionNumber: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  items: QuotationItem[];
  activities: Activity[];
  attachments: Attachment[];
}

export interface QuotationsResponse {
  success: boolean;
  quotations: Quotation[];
  pagination: PaginationData;
  error?: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}