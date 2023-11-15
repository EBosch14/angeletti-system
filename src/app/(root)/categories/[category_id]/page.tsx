import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";
import { Category, Size } from "@prisma/client";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SizeClient } from "./components/client";
import { SizesColumn } from "./components/columns";

const CategoryPage = async ({
  params,
}: {
  params: { category_id: string };
}) => {
  let category: Category | null = null;

  let formattedSizes: SizesColumn[] | [] = [];

  if (params.category_id !== "new") {
    category = await prismadb.category.findUnique({
      where: { id: params.category_id },
    });

    if (!category) {
      redirect("/categories");
    }

    const sizes = await prismadb.size.findMany({
      where: {
        category_id: category.id,
      },
      include: {
        products: true,
      },
    });

    if (sizes) {
      formattedSizes = await sizes.map((e) => {
        return {
          id: e.id,
          name: e.name,
          products: e.products.length,
        };
      });
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
        <Separator />
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default CategoryPage;
