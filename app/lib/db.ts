// src/lib/db.ts
import { Pool } from 'pg';

// สร้าง Pool Connection เพื่อแชร์การเชื่อมต่อฐานข้อมูล
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ฟังก์ชันกลางสำหรับยิง Raw SQL
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};