import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
  return new Response(JSON.stringify({ id: user.id, name: user.name, email: user.email }), { status: 200 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return new Response(JSON.stringify({ message: "Name required" }), { status: 400 });

  try {
    const user = await prisma.user.update({ where: { id: session.user.id }, data: { name } });
    return new Response(JSON.stringify({ id: user.id, name: user.name, email: user.email }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: "Update failed" }), { status: 500 });
  }
}
