import { options } from "@/app/api/auth/[...nextauth]/options";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { size_id: string } }
) {
  try {
    if (!params.size_id) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: { id: params.size_id },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { category_id: string; size_id: string } }
) {
  try {
    const session = getServerSession(options)
    const { name } = await req.json();

    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.category_id) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!params.size_id) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.category_id
      }
    })

    if (!category) {
      return new NextResponse("Category does not exist", { status: 400 });
    }

    const size = await prismadb.size.updateMany({
      where: { id: params.size_id },
      data: {
        name
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { category_id: string, size_id: string } }
) {
  try {
    const session = getServerSession(options)

    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.size_id) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.category_id
      }
    })

    if (!category) {
      return new NextResponse("Category does not exist", { status: 400 });
    }

    const size = await prismadb.size.deleteMany({
      where: { id: params.size_id },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
