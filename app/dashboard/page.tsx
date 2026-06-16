"use client";
import { useCallback, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { auth } from "../auth";

interface Todo {
  id: number;
  title: string;
  task_date: string;
  task_time: string;
  is_completed: boolean;
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { data: session, status } = useSession();

  // State สำหรับ Form ใน Modal
  const [title, setTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");

  const fetchTodos = useCallback(async () => {
  try {
    const res = await fetch("/api/todos");
    if (res.ok) {
      const data = await res.json();
      setTodos(data);
    }
  } catch (error) {
    console.error(error);
  }
}, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const openAddModal = () => {
    setEditingTodo(null);
    setTitle("");
    setTaskDate(new Date().toISOString().split("T")[0]);
    setTaskTime("12:00");
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setTaskDate(todo.task_date);
    setTaskTime(todo.task_time);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { title, task_date: taskDate, task_time: taskTime };

    if (editingTodo) {
      // แก้ไขข้อมูล
      await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, id: editingTodo.id, is_completed: editingTodo.is_completed }),
      });
    } else {
      // เพิ่มข้อมูลใหม่
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setIsModalOpen(false);
    fetchTodos();
  };

  const toggleComplete = async (todo: Todo) => {
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...todo, is_completed: !todo.is_completed }),
    });
    fetchTodos();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจใช่ไหมที่จะลบรายการนี้?")) return;
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setIsModalOpen(false);
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center p-4 sm:p-8">
      {/* ส่วนหัวของหน้าเว็บ */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <span className="text-xs font-semibold px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">{session?.user?.name}</span>
        <button onClick={() => signOut()} className="text-xs text-red-400 hover:underline">Log out</button>
      </div>

      {/* บล็อกรายการ Todo (อิงดีไซน์ตามรูปภาพต้นฉบับ) */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[450px]">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Everyday</h1>
              <p className="text-xs text-zinc-500 mt-0.5">📅 Tasks Overview</p>
            </div>
          </div>

          {/* รายการ Tasks */}
          <div className="space-y-1 divide-y divide-zinc-800/50">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center justify-between py-3.5 first:pt-0 group">
                <div className="cursor-pointer flex-1 pr-4" onClick={() => openEditModal(todo)}>
                  <p className={`font-medium transition-all text-[15px] ${todo.is_completed ? "line-through text-zinc-600" : "text-zinc-200"}`}>{todo.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{todo.task_date} • {todo.task_time}</p>
                </div>
                
                {/* ปุ่มวงกลมติ๊กถูก */}
                <button onClick={() => toggleComplete(todo)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.is_completed ? "bg-orange-500 border-orange-500 text-zinc-950" : "border-zinc-700 hover:border-orange-500"}`}>
                  {todo.is_completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
            {todos.length === 0 && <p className="text-zinc-500 text-sm text-center py-8">ไม่มีรายการงานสำหรับวันนี้</p>}
          </div>
        </div>

        {/* ปุ่มกดเปิด Modal เพิ่มงาน */}
        <button onClick={openAddModal} className="w-full mt-6 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
          <span>+</span> Add Task
        </button>
      </div>

      {/* ─── MODAL DIALOG (เพิ่ม/แก้ไข/ลบ) ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-orange-500 mb-4">{editingTodo ? "✏️ Edit Task" : "➕ Add New Task"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">รายละเอียดงาน</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-orange-500" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">วันที่</label>
                  <input type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">เวลา</label>
                  <input type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs focus:outline-none focus:border-orange-500" required />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-orange-500 text-zinc-950 font-semibold p-2 rounded-lg text-sm hover:bg-orange-600">บันทึก</button>
                {editingTodo && (
                  <button type="button" onClick={() => handleDelete(editingTodo.id)} className="bg-red-900/30 border border-red-800 text-red-400 px-3 rounded-lg text-sm hover:bg-red-900/50">ลบ</button>
                )}
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-zinc-800 text-zinc-400 border border-zinc-700 px-3 rounded-lg text-sm hover:bg-zinc-700">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}