
// Temporary mock for development without database
console.log("Using temporary Prisma mock...");

// Mock PrismaClient for animation testing  
const mockProducts = [
  {
    id: "1",
    name: "Sample Product 1",
    description: "A sample product for testing animations",
    categoryId: "cat1",
    price: 99.99,
    stock: 50,
    sku: "SKU001",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
    status: "IN_STOCK",
    weight: "1kg",
    dimensions: "10x10x5cm",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: { id: "cat1", name: "Electronics" },
    productTags: []
  },
  {
    id: "2", 
    name: "Sample Product 2",
    description: "Another sample product for testing animations",
    categoryId: "cat2",
    price: 149.99,
    stock: 25,
    sku: "SKU002",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
    status: "IN_STOCK",
    weight: "2kg",
    dimensions: "15x15x8cm",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: { id: "cat2", name: "Furniture" },
    productTags: []
  },
  {
    id: "3",
    name: "Sample Product 3", 
    description: "Third sample product for testing animations",
    categoryId: "cat1",
    price: 79.99,
    stock: 100,
    sku: "SKU003",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    status: "IN_STOCK",
    weight: "0.5kg",
    dimensions: "8x8x3cm",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: { id: "cat1", name: "Electronics" },
    productTags: []
  }
];

export const prisma = {
  product: {
    count: ({ where }: any = {}) => Promise.resolve(mockProducts.length),
    findMany: ({ skip = 0, take = 10, where, orderBy, include }: any = {}) => {
      const result = mockProducts.slice(skip, skip + take);
      return Promise.resolve(result);
    },
    findUnique: ({ where }: any) => {
      const product = mockProducts.find(p => p.id === where.id);
      return Promise.resolve(product || null);
    },
  },
  category: {
    findMany: () => Promise.resolve([
      { id: "cat1", name: "Electronics" },
      { id: "cat2", name: "Furniture" }
    ]),
  },
  user: {
    findUnique: () => Promise.resolve(null),
  },
  quotation: {
    findMany: () => Promise.resolve([]),
  },
} as any;
