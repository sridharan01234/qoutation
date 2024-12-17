'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import ProductForm from '../components/ProductForm'
import { FaPlus, FaBox } from 'react-icons/fa'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(
        selectedProduct ? `/api/products/${selectedProduct.id}` : '/api/products',
        {
          method: selectedProduct ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error('Failed to save product');

      await fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      await fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <FaBox className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-500 text-center mb-6">
            Get started by creating your first product
          </p>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Create Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {product.image ? (
                <div className="relative h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <FaBox className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="space-y-1 text-sm">
                  <p className="text-gray-900 font-medium">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    Stock: {product.stock}
                  </p>
                  <p className="text-gray-600">
                    Category: {product.category.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${product.status === 'IN_STOCK' ? 'bg-green-100 text-green-800' :
                        product.status === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {product.status.replace('_', ' ')}
                    </span>
                    {product.featured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {selectedProduct ? 'Edit Product' : 'Create New Product'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <ProductForm
                product={selectedProduct || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedProduct(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
