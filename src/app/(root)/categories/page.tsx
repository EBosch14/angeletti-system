import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoriesColumn } from "./components/columns";

const CategoriesPage = async ({ params }: { params: { store_id: string } }) => {
  const categories = await prismadb.category.findMany({
    where: {
      store_id: params.store_id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedCategories: CategoriesColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    created_at: format(item.created_at, "dd/MM/yyyy (p)"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
