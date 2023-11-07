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

    const {images, provider_id, ...dataNew} = data



    const provider = await prismadb.provider.findFirst({
      where : {
        id : Number(provider_id)
      }
    })


    if(!provider){
      return new NextResponse("Provider inexistente", { status: 405 });
    }


    const product = await prismadb.product.create({
      data: {
        ...dataNew,
        provider_id: provider.id,
        images: {
          createMany: {
            data: images,
          }
        },
        store_id: store.id,
        created_by_id : session.user.sub,
        updated_by_id: session.user.sub
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
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

    const products = await prismadb.product.findMany({
      where: { store_id: store.id },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
