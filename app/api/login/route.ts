// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 1. ยิง Raw SQL ไปเช็กที่ Supabase ตรงๆ
    const res = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = res.rows[0];

    if (!user) {
      return NextResponse.json({ error: "ไม่พบอีเมลนี้ในระบบ" }, { status: 401 });
    }

    // 2. เช็กความถูกต้องของรหัสผ่าน
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // 3. ถ้าถูกต้อง สามารถส่งข้อมูลผู้ใช้กลับไปให้หน้าบ้านเอาไปจัดการต่อได้
    return NextResponse.json({
      message: "ตรวจสอบข้อมูลถูกต้อง",
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}