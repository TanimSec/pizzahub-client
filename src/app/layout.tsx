import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const body = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const display = Fraunces({ variable: "--font-display", subsets: ["latin"], axes: ["opsz"] });

export const metadata: Metadata = {
  title: { default: "PizzaHub — Hot & Fresh Pizza Delivered", template: "%s | PizzaHub" },
  description:
    "Discover local pizza shops, browse menus and order fresh pizza, sides and desserts delivered to your door.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${body.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
