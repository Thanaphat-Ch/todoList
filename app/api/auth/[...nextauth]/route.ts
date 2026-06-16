// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/app/auth";

// ส่งออก HTTP Method ให้ Next.js App Router รู้จักเพื่อรองรับทั้งการเช็กเซสชัน (GET) และการล็อกอิน (POST)
export const { GET, POST } = handlers;