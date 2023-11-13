import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ProviderClient } from "./components/client";
import { ServicesColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProvidersPage = async () => {
  const services = await prismadb.service.findMany({
    include: {
      Client: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedServices: ServicesColumn[] = services.map((item) => ({
    id: item.id,
    Client: item.Client.name,
    description: item.description,
    state: item.state,
    price: formatter.format(item.price.toNumber()),
    is_paid: item.is_paid,
    created_at: format(item.created_at, "dd/MM/yyyy (p)"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProviderClient data={formattedServices} />
      </div>
    </div>
  );
};

export default ProvidersPage;
