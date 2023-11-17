import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import prismadb from "@/lib/prismadb";
import { ProviderFormSchema } from "@/schemas/form-schemas";

export async function PATCH(
  req: Request,
  { params }: { params: { service_id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user_id = session?.user.sub;
    const service_id = Number(params.service_id);

    const data = await req.json();

    if (!user_id) return new NextResponse("Unathenticated", { status: 401 });

    if (!params.service_id || isNaN(service_id))
      return new NextResponse("Invalid service ID", { status: 400 });

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

        const {client_id, is_paid } = data

    const client = await prismadb.client.findFirst({
      where :{
        id : Number(client_id)
      }
    })

    if (!client) {
      return new NextResponse("The client does not exist ", { status: 403 });
    }
    


    const updatedService = await prismadb.service.update({
      where: {
        id:service_id,
      },
      data: {
      ...data,
      used_products: {},
      client_id: client.id,
      is_paid: is_paid == "si"? true : false,
      updated_by_id: session.user.sub
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.log("[SERVICE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { service_id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user_id = session?.user.sub;
    const service_id = Number(params.service_id);

    if (!user_id) return new NextResponse("Unathenticated", { status: 401 });

    if (!params.service_id || isNaN(service_id))
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

    const deletedService = await prismadb.service.delete({
      where: {
        id: service_id,
      },
    });

    return NextResponse.json(deletedService);
  } catch (error) {
    console.log("[SERVICE_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
