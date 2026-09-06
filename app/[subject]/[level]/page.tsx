import React from "react";
import LevelRunnerClient from "./LevelRunnerClient";

export function generateStaticParams() {
  return [
    { subject: "macro", level: "l1-0-foundations" },
  ];
}

interface PageProps {
  params: {
    subject: string;
    level: string;
  };
}

export default function LevelPage({ params }: PageProps) {
  return <LevelRunnerClient params={params} />;
}
