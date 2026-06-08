import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/auth/providers";

export const metadata: Metadata = {
  title: "Ecommerce Admin",
  description: "Admin dashboard for the ecommerce platform",
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
