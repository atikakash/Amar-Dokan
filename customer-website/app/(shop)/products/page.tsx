import { ProductsPage } from "@/components/features/products/products-page";

export default async function ProductsRoute({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;

  return <ProductsPage initialCategory={params.category} />;
}
