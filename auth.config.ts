// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// ไฟล์นี้ใส่เฉพาะโครงและฟังก์ชันล็อกอินเบื้องต้น ห้ามใช้ 'pg' หรือยิง SQL ในนี้เด็ดขาด!
export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize() {
        // ในนี้ปล่อยว่างไว้ได้เลยครับ เพราะเราจะไปเขียนไส้ในตัวเต็มที่ไฟล์ auth.ts
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" }
} satisfies NextAuthConfig;