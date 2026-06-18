import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/auth/providers";

export const metadata: Metadata = {
  title: "MewMew Pet Shop Admin",
  description: "Admin dashboard for pet shop operations",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
