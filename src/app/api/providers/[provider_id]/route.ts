import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import prismadb from "@/lib/prismadb";
import { ProviderFormSchema } from "@/schemas/form-schemas";

export async function PATCH(
  req: Request,
  { params }: { params: { provider_id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user_id = session?.user.sub;
    const provider_id = Number(params.provider_id);

    const values = await req.json();

    if (!user_id) return new NextResponse("Unathenticated", { status: 401 });

    if (!params.provider_id || isNaN(provider_id))
      return new NextResponse("Invalid Provider ID", { status: 400 });

    const foundStore = await prismadb.store.findFirst({
      include: {
        users: {
          where: {
            id: user_id,
          },
        },
      },
    });

    if (!foundStore) return new NextResponse("Unauthorized", { status: 403 });

    const result = ProviderFormSchema.safeParse(values);
    if (!result.success) return NextResponse.json(result.error);

    const updatedProvider = await prismadb.provider.update({
      where: {
        id: Number(params.provider_id),
      },
      data: {
        store_id: foundStore.id,
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        country: result.data.country,
        state: result.data.state,
        city: result.data.city,
        address: result.data.address,
        postal_code: result.data.postal_code,
      },
    });

    return NextResponse.json(updatedProvider);
  } catch (error) {
    console.log("[PROVIDER_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { provider_id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user_id = session?.user.sub;
    const provider_id = Number(params.provider_id);

    if (!user_id) return new NextResponse("Unathenticated", { status: 401 });

    if (!params.provider_id || isNaN(provider_id))
      return new NextResponse("Invalid Provider ID", { status: 400 });

    const foundStore = await prismadb.store.findFirst({
      include: {
        users: {
          where: {
            id: user_id,
          },
        },
      },
    });

    if (!foundStore) return new NextResponse("Unauthorized", { status: 403 });

    const deletedProvider = await prismadb.provider.delete({
      where: {
        id: provider_id,
      },
    });

    return NextResponse.json(deletedProvider);
  } catch (error) {
    console.log("[PROVIDER_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
