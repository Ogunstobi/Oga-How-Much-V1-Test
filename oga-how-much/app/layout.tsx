import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oga, How Much?",
  description: "A fun Nigerian bargaining calculator.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
