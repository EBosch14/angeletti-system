import { options } from "@/app/api/auth/[...nextauth]/options";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { category_id: string } }
) {
  try {
    const session = await getServerSession(options);
    const { name } = await req.json();

    if (!session) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.category_id) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const size = await prismadb.size.create({
      data: {
        name,
        category_id: params.category_id,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: {category_id: string } }
) {
  try {
    if (!params.category_id) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.category_id
      }
    })

    if (!category) {
      return new NextResponse("Category does not exist", { status: 400 });
    }

    const sizes = await prismadb.size.findMany({
      where: { category_id: params.category_id },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
