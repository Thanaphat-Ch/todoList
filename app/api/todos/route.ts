import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { query } from "@/app/lib/db";

// GET: ดึงรายการ Todo ทั้งหมดของผู้ใช้ที่ล็อกอินอยู่
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await query(
    "SELECT id, title, to_char(task_date, 'YYYY-MM-DD') as task_date, to_char(task_time, 'HH24:MI') as task_time, is_completed FROM todos WHERE user_id = $1 ORDER BY task_date ASC, task_time ASC",
    [session.user.id]
  );
  return NextResponse.json(res.rows);
}

// POST: เพิ่ม Todo ใหม่
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, task_date, task_time } = await req.json();
  const res = await query(
    "INSERT INTO todos (user_id, title, task_date, task_time) VALUES ($1, $2, $3, $4) RETURNING *",
    [session.user.id, title, task_date, task_time]
  );
  return NextResponse.json(res.rows[0]);
}

// PUT: แก้ไขเนื้อหา หรือเปลี่ยนสถานะติ๊กถูก
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, task_date, task_time, is_completed } = await req.json();
  
  const res = await query(
    "UPDATE todos SET title = $1, task_date = $2, task_time = $3, is_completed = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
    [title, task_date, task_time, is_completed, id, session.user.id]
  );
  return NextResponse.json(res.rows[0]);
}

// DELETE: ลบ Todo
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [id, session.user.id]);
  return NextResponse.json({ message: "ลบรายการสำเร็จ" });
}