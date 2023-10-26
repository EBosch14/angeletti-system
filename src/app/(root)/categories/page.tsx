import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoriesColumn } from "./components/columns";
import { Aside } from "@/components/ui/aside";
import Link from "next/link";

const CategoriesPage = async () => {
  const categories = await prismadb.category.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedCategories: CategoriesColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    created_at: format(item.created_at, "dd/MM/yyyy (p)"),
  }));

  const routes = [
    { label: "Agenda", route: "/categories" },
    { label: "Editar categorias", route: "/" },
    { label: "Capacidades y tamaños", route: "/" },
  ];

  return (
    <div className="flex">
      <div className="flex h-screen p-5">
        <Aside routes={routes} />
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
