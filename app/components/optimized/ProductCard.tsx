import { memo, useState } from 'react';
import Image from 'next/image';
import { measurePerformance } from '../../utils/performance';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    status: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  };
  minimal?: boolean;
  onClick?: () => void;
}

const ProductCard = memo(function ProductCard({
  product,
  minimal = false,
  onClick
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const endRender = measurePerformance('ProductCard render');

  // Optimize status display computation
  const statusDisplay = {
    IN_STOCK: { text: 'In Stock', color: 'text-green-600' },
    OUT_OF_STOCK: { text: 'Out of Stock', color: 'text-red-600' },
    LOW_STOCK: { text: 'Low Stock', color: 'text-yellow-600' },
  }[product.status];

  if (minimal) {
    return (
      <div
        onClick={onClick}
        className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex-shrink-0 w-16 h-16 relative">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={64}
              height={64}
              className={`rounded-md object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadingComplete={() => setImageLoaded(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </p>
          <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-3 aspect-h-2">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoadingComplete={() => setImageLoaded(true)}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-2 text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className={`px-2 py-1 rounded-full text-sm ${statusDisplay.color}`}>
            {statusDisplay.text}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;