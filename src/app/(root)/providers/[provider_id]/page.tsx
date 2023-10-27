import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { ProviderForm } from "./components/provider-form";
import { Provider } from "@prisma/client";

const BillboardPage = async ({
  params,
}: {
  params: { provider_id: string };
}) => {
  let provider: Provider | null = null;
  if (!isNaN(Number(params.provider_id))) {
    provider = await prismadb.provider.findUnique({
      where: {
        id: Number(params.provider_id),
      },
    });
  }

  if (!provider && params.provider_id !== "new") redirect("/providers");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProviderForm initialData={provider} />
      </div>
    </div>
  );
};

export default BillboardPage;
