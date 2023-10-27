import prismadb from "@/lib/prismadb";
import { ClientForm } from "./components/client-form";
import { Client } from "@prisma/client";
import { redirect } from "next/navigation";

const BillboardPage = async ({ params }: { params: { client_id: string } }) => {
  let client: Client | null = null;

  const id =
    typeof Number(params.client_id) === "number"
      ? Number(params.client_id)
      : null;

  if (id) {
    client = await prismadb.client.findUnique({
      where: { id },
    });

    if (!client) {
      redirect("/clients");
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClientForm initialData={client} />
      </div>
    </div>
  );
};

export default BillboardPage;
