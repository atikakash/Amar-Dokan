import { ProductDetailsPage } from "@/components/features/products/product-details-page";

export default async function ProductDetailsRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ProductDetailsPage id={id} />;
}
