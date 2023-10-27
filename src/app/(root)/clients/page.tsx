import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ClientColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import { Aside } from "@/components/ui/aside";

const ProductsPage = async () => {
  const clients = await prismadb.client.findMany({
    include: {
      orders: true,
      services: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedClients: ClientColumn[] = clients.map((item) => ({
    id: item.id,
    name: item.name,
    phone: item.phone,
    city: item.city ? item.city : undefined,
    orders: item.orders.length,
    services: item.services.length,
    created_at: format(item.created_at, "dd/MM/yyyy (p)"),
  }));

  const routes = [
    { label: "Agenda", route: "/clients" },
    { label: "Editar clientes", route: "/" },
    { label: "Ajustes", route: "/" },
  ];

  return (
    <div className="flex">
      <div className="flex h-screen p-5">
        <Aside routes={routes} />
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedClients} />
      </div>
    </div>
  );
};

export default ProductsPage;
