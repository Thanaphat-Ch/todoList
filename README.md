# My Everyday — Full-Stack Todo App

A minimalist, high-performance daily task management application designed with a dark/orange theme. Built as a monolithic architecture using Next.js 16, leveraging direct PostgreSQL pooling and lightweight edge routing for authentication.

## 🚀 Tech Stack & Architecture

- **Frontend/Backend:** Next.js 16 (App Router) with TypeScript
- **Package Manager:** pnpm
- **Styling:** Tailwind CSS (Custom Dark/Orange Palette)
- **Authentication:** NextAuth.js (Auth.js v5)
- **Database:** PostgreSQL (Supabase) via Direct Connection
- **Database Driver:** `pg` (node-postgres) with Parameterized Raw SQL
- **Security:** `bcryptjs` for single-way password hashing

---

## 🗄️ Database Schema

Run the following DDL in your PostgreSQL environment to set up the relational schema:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  task_date DATE NOT NULL,
  task_time TIME NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
