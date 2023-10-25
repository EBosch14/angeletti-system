import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const BillboardPage = async ({
  params,
}: {
  params: { product_id: number };
}) => {
  const product = await prismadb.product.findUnique({
    where: { id: params.product_id },
    include: {
      images: true,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
};

export default BillboardPage;
