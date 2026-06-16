"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error);
    else router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">Create Account</h1>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 focus:outline-none focus:border-orange-500" required />
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 focus:outline-none focus:border-orange-500" required />
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 focus:outline-none focus:border-orange-500" required />
          </div>
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 font-semibold p-2.5 rounded-lg transition-colors mt-2 text-zinc-950">สมัครสมาชิก</button>
        </form>
        <p className="text-sm text-center text-zinc-400 mt-4">มีบัญชีอยู่แล้ว? <Link href="/login" className="text-orange-500 hover:underline">เข้าสู่ระบบ</Link></p>
      </div>
    </div>
  );
}