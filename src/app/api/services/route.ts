import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(
  req: Request
) {
  try {
    const session = await getServerSession(authOptions)
    const data = await req.json();

    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    const store= await prismadb.store.findFirst({
      include:{
        users:{
          where:{
            id: session.user.sub
          }
        }
      }
    });

    if (!store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const {client_id, is_paid } = data

    const client = await prismadb.client.findFirst({
      where :{
        id : Number(client_id)
      }
    })

    if (!client) {
      return new NextResponse("The client does not exist ", { status: 403 });
    }
    

    const service = await prismadb.service.create({
      data : {
        ...data,
        used_products: {},
        store_id : store.id,
        client_id: client.id,
        is_paid: is_paid == "true"? true : false,
        created_by_id: session.user.sub,
        updated_by_id: session.user.sub
      }
    })

    return NextResponse.json(service);
  } catch (error) {
    console.log("[SERVICE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request
) {
  try {

    const store= await prismadb.store.findFirst();

    if (!store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const services = await prismadb.service.findMany({
      where: { store_id: store.id },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.log("[SERVICES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
