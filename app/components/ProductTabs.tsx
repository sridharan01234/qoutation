// components/ProductTabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Product } from "@/types";
import { StarIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews ({product.reviews.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <div className="prose max-w-none">
          <p className="text-gray-600">{product.description}</p>
        </div>
      </TabsContent>

      <TabsContent value="details">
        <dl className="divide-y divide-gray-200">
          <div className="grid grid-cols-2 gap-4 py-3">
            <dt className="font-medium text-gray-900">Category</dt>
            <dd className="text-gray-700">{product.category.name}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4 py-3">
            <dt className="font-medium text-gray-900">Availability</dt>
            <dd className="text-gray-700">
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </dd>
          </div>
          {/* Add more product details as needed */}
        </dl>
      </TabsContent>

      <TabsContent value="reviews">
        <div className="space-y-8">
          {product.reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-8">
              <div className="flex items-start space-x-4">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={review.user.image}
                    alt={review.user.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {review.user.name}
                    </h4>
                    <time className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
