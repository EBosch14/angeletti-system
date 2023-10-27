import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";
import { redirect } from "next/navigation";
import { Product } from "@prisma/client";

const BillboardPage = async ({
  params,
}: {
  params: { product_id: string };
}) => {
  let product: Product | null;

  const id =
    typeof Number(params.product_id) === "number"
      ? Number(params.product_id)
      : null;

  if (id) {
    product = await prismadb.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!product) {
      redirect("/products");
    }
  }

  // const categories = prismadb.category.findMany()
  // const sizes = prismadb.size.findMany()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
};

export default BillboardPage;
