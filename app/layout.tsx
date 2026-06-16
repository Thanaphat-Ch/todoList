import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Everyday - Todo App",
  description: "Minimalist Todo Application with Black and Orange Theme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 min-h-screen text-white antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>    
    </html>
  );
}
