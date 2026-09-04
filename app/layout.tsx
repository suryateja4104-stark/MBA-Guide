import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Study Guide — Macroeconomics Study Guide & Policy Simulator",
  description:
    "An executive, scenario-based macroeconomic study guide and policy simulation workbench for MBA core curriculum based on Dornbusch, Fischer, Startz and RBI policy frameworks.",
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
