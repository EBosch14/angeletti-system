import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";
import { Category } from "@prisma/client";
import { redirect } from "next/navigation";

const CategoryPage = async ({
  params,
}: {
  params: { category_id: string };
}) => {
  let category: Category | null = null;

  if (params.category_id !== "new") {
    category = await prismadb.category.findUnique({
      where: { id: params.category_id },
    });

    if (!category) {
      redirect("/categories");
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
