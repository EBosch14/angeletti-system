import { options } from "@/app/api/auth/[...nextauth]/options";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { client_id: number } }
) {
  try {
    if (!params.client_id) {
      return new NextResponse("Client id is required", { status: 400 });
    }

    const client = await prismadb.client.findUnique({
      where: { id: params.client_id },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { client_id: string } }
) {
  try {
    const session = getServerSession(options);
    const data = await req.json();

    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.client_id) {
      return new NextResponse("Client id is required", { status: 400 });
    }

    if (!data) {
      return new NextResponse("Data  is required", { status: 400 });
    }

    const id = Number(params.client_id)

    const client = await prismadb.client.updateMany({
      where: { id},
      data: {
        ...data
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: {client_id: string } }
) {
  try {
    const session = getServerSession(options);
    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.client_id) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const id = Number(params.client_id)

    const client = await prismadb.client.deleteMany({
      where: { id },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
