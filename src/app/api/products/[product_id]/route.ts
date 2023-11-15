import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(
  _req: Request,
  { params }: { params: { product_id: string } }
) {
  try {
    if (!params.product_id) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const id = Number(params.product_id)

    const product = await prismadb.product.findUnique({
      where: {id},
      include :{
        images : true,
        Category: true,
        Provider: true,
        Size : true,
        Created_By: true,
        Updated_By: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { product_id: string } }
) {
  try {
    const session = getServerSession(authOptions);
    const data = await req.json();

    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.product_id) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!data) {
      return new NextResponse("Data  is required", { status: 400 });
    }

    const id = Number(params.product_id)

    const client = await prismadb.client.updateMany({
      where: { id},
      data: {
        ...data
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: {product_id: string } }
) {
  try {
    const session = getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.product_id) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const id = Number(params.product_id)

    const client = await prismadb.client.deleteMany({
      where: { id },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
