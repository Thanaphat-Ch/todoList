import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, cleanEmail, hashedPassword]
    );

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ" }, { status: 201 });
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }
    return NextResponse.json({ error: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์" }, { status: 500 });
  }
}