// src/auth.ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config"; 
import Credentials from "next-auth/providers/credentials"; // ⚡ นำเข้าตรงนี้เพิ่ม
import { query } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, 
  secret: process.env.AUTH_SECRET,
  
  // ประกาศ Provider เต็มรูปแบบที่นี่เลย ไม่ต้องดึง ...authConfig.providers[0]
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 1. ค้นหาผู้ใช้ด้วย Raw SQL
          const res = await query("SELECT * FROM users WHERE email = $1", [credentials.email]);
          
          if (res.rows.length === 0) {
            console.log("❌ ไม่พบอีเมลนี้ในระบบ Supabase");
            return null;
          }

          const user = res.rows[0];

          // 2. เปรียบเทียบรหัสผ่านที่แฮชไว้
          const isValid = await bcrypt.compare(credentials.password as string, user.password);
          
          if (isValid) {
            console.log("✅ ล็อกอินผ่านฉลุยสำหรับคุณ:", user.name);
            return { 
              id: user.id.toString(), // ห้ามลืมแปลงเป็น string
              name: user.name, 
              email: user.email 
            };
          }
          
          console.log("❌ รหัสผ่านไม่ถูกต้อง");
          return null;
        } catch (error) {
          console.error("Database Auth Error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
});