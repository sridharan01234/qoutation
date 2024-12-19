# Product API Usage Guide

The provided product data structure can be used with our API in the following ways:

## Product Structure

The provided product data matches our Product interface, containing:
- Basic fields: id, name, description, price, stock, sku
- Status information: status (IN_STOCK)
- Category relationship: categoryId and nested category object
- Physical properties: weight and dimensions object
- Metadata: createdAt, updatedAt
- Relations: tags (empty array)

## API Endpoints

1. **GET /api/products**
   - Supports query parameters:
     - category
     - status
     - featured
   
2. **GET /api/products/[id]**
   - Get a specific product by ID

3. **POST /api/products**
   - Create a new product using the provided structure

4. **PUT /api/products/[id]**
   - Update an existing product

5. **DELETE /api/products/[id]**
   - Delete a product by ID

## Example Usage

```typescript
// GET all products
const products = await fetch('/api/products');

// GET products by category
const categoryProducts = await fetch('/api/products?category=cm4vjpaqt000fqxs0ns04t8km');

// GET products by status
const inStockProducts = await fetch('/api/products?status=IN_STOCK');

// GET a specific product
const product = await fetch('/api/products/cm4vjpb2t000iqxs0rk0hbgb5');

// CREATE a new product
await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Bespoke Granite Chair-3",
    description: "Experience the teal brilliance of our Computer...",
    categoryId: "cm4vjpaqt000fqxs0ns04t8km",
    price: 823.69,
    stock: 82,
    sku: "SKU-003",
    status: "IN_STOCK",
    weight: 10.22818099354622,
    dimensions: {
      width: 77.85016597968077,
      height: 28.24370877999801,
      length: 57.40448496720543
    }
  })
});
```

The API will validate the input against the Product interface defined in `app/types/index.ts`.