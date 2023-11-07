import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ProviderClient } from "./components/client";
import { ProviderColumn } from "./components/columns";

const ProvidersPage = async () => {
  const products = await prismadb.provider.findMany({
    include: {
      products: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedProviders: ProviderColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    tel: item.phone,
    tot_prods: item.products.length,
    updated_at: format(item.updated_at, "dd/MM/yyyy (p)"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProviderClient data={formattedProviders} />
      </div>
    </div>
  );
};

export default ProvidersPage;
