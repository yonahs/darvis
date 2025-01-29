import { ProductCatalogTable } from "@/components/pharmacy/ProductCatalogTable";

const Products = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductCatalogTable />
    </div>
  );
};

export default Products;