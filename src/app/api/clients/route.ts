import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";

export async function POST(
  req: Request
) {
  try {
    const session = await getServerSession(options)
    const data = await req.json();

    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!data.name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!data.phone) {
      return new NextResponse("Phgone is required", { status: 400 });
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

    const client = await prismadb.client.create({
      data: {
        ...data,
        store_id: store.id,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
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

    const categories = await prismadb.category.findMany({
      where: { store_id: store.id },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGOIRES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
