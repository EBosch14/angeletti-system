"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ClientColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
// import { ApiList } from "@/components/ui/api-list";

interface ClientsClientProps {
  data: ClientColumn[];
}

export const ProductClient: React.FC<ClientsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Clientes (${data?.length})`}
          description="Administra los clientes"
        />
        <Button onClick={() => router.push(`/clients/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* <Heading title="API" description="Llamadas a la API para los productos" /> */}
      {/* <Separator /> */}
      {/* <ApiList entityName="products" entityIdName="productId" /> */}
    </>
  );
};
