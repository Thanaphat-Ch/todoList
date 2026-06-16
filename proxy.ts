// // src/middleware.ts
// import { auth } from "@/app/auth";

// export default auth((req) => {
//   const isLoggedIn = !!req.auth;
//   const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

//   // ถ้าพยายามเข้าหน้า dashboard แต่ยังไม่ได้ล็อกอิน ให้ดีดกลับไปหน้า login ทันที
//   if (isDashboard && !isLoggedIn) {
//     return Response.redirect(new URL("/login", req.nextUrl));
//   }
// });

// // กำหนดว่าต้องการให้ Middleware นี้ทำงานที่หน้าไหนบ้าง
// export const config = {
//   matcher: ["/dashboard/:path*"],
// };

// src/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config"; // 💡 เรียกใช้จากตัวแปร config ตัวเบาแทน!
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};