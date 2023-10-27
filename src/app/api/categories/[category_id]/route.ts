import { options } from "@/app/api/auth/[...nextauth]/options";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { category_id: string } }
) {
  try {
    if (!params.category_id) {
      return new NextResponse("Categoty id is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: { id: params.category_id },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { category_id: string } }
) {
  try {
    const session = getServerSession(options);
    const { name } = await req.json();

    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.category_id) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name URL is required", { status: 400 });
    }

    const category = await prismadb.category.updateMany({
      where: { id: params.category_id },
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: {category_id: string } }
) {
  try {
    const session = getServerSession(options);
    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.category_id) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const category = await prismadb.category.deleteMany({
      where: { id: params.category_id },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
