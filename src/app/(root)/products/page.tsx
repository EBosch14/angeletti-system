import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import { Aside } from "@/components/ui/aside";

const ProductsPage = async () => {
  const products = await prismadb.product.findMany({
    include: {
      Category: true,
      Size: true,
      Provider: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.sale_price.toNumber()),
    proivder: item.Provider.name,
    created_at: format(item.created_at, "dd/MM/yyyy (p)"),
  }));

  const routes = [
    { label: "Agenda", route: "/categories" },
    { label: "Editar productos", route: "/" },
    { label: "Capacidades y tamaños", route: "/" },
  ];

  return (
    <div className="flex">
      <div className="flex h-screen p-5">
        <Aside routes={routes} />
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
