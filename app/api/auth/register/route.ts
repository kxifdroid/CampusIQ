import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
  const normalizedName = typeof name === "string" ? name.trim() : "";

  if (!normalizedName || !normalizedEmail || typeof password !== "string") {
    return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ message: "An account already exists for this email." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Account created." }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      message: "An error occurred during registration.",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
