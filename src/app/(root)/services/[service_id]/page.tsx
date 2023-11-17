import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { ServiceForm } from "./components/service-form";
import { Service } from "@prisma/client";

const BillboardPage = async ({
  params,
}: {
  params: { service_id: string };
}) => {
  let service: Service | null = null;
  if (!isNaN(Number(params.service_id))) {
    service = await prismadb.service.findUnique({
      where: {
        id: Number(params.service_id),
      },
    });
  }

  if (!service && params.service_id !== "new") redirect("/providers");

  const clients = await prismadb.client.findMany();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServiceForm initialData={service} clients={clients} />
      </div>
    </div>
  );
};

export default BillboardPage;
