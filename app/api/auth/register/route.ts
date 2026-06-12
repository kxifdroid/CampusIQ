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
    console.log(`[Register] Attempting to create user: ${normalizedEmail}`);
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      console.log(`[Register] User already exists: ${normalizedEmail}`);
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

    console.log(`[Register] User created successfully: ${normalizedEmail}`);
    return NextResponse.json({ message: "Account created." }, { status: 201 });
  } catch (error) {
    console.error("[Register] Error:", error);
    
    // Provide a more helpful message for common deployment errors
    let errorMessage = "An error occurred during registration.";
    if (error instanceof Error) {
      if (error.message.includes("read-only") || error.message.includes("EROFS")) {
        errorMessage = "Database is read-only. Please use a remote database for Vercel deployment.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ 
      message: errorMessage,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
