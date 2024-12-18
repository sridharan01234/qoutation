// app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import ProductDetails from "../../components/ProductDetails";
import { getProductById } from "@/lib/api"; // We'll create this

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} - Your Store Name`,
    description: product.description,
    openGraph: {
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </main>
  );
}
