import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ProviderFormSchema } from "@/schemas/form-schemas";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user_id = session?.user.sub;

    const values = await req.json();

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

    const provider = await prismadb.provider.create({
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

    return NextResponse.json(provider);
  } catch (error) {
    console.log("[PROVIDERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
