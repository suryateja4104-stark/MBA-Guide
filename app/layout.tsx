import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MBA Executive Curriculum — Domain Portals & Interactive Simulation Workbenches",
  description:
    "Executive MBA study guides, domain session sandboxes, and policy simulation workbenches across Operations, Finance, Economics, Marketing, and Strategy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
