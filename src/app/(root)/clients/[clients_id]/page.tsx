import prismadb from "@/lib/prismadb";
import { ClientForm } from "./components/product-form";

const BillboardPage = async ({ params }: { params: { client_id: number } }) => {
  const client = await prismadb.client.findUnique({
    where: { id: params.client_id },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClientForm initialData={client} />
      </div>
    </div>
  );
};

export default BillboardPage;
