"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MacroRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/economics/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4F1E9] text-[#211E19]">
      <div className="dash-card max-w-md w-full text-center space-y-4 p-8 bg-white border border-[#C7BFA9] rounded shadow-sm">
        <div className="w-10 h-10 rounded bg-[#2E5C8A] text-white flex items-center justify-center font-bold text-lg mx-auto mono">
          EC
        </div>
        <h1 className="text-xl font-bold font-sans text-[#211E19]">
          Redirecting to Economics Guide...
        </h1>
        <p className="text-xs text-[#686254]">
          Taking you to the Macroeconomics &amp; Policy Simulation Workbench.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/economics/"
            className="px-4 py-2 bg-[#2E5C8A] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#23486d] transition"
          >
            Go to Economics Guide
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-[#FAF8F2] text-[#211E19] border border-[#C7BFA9] rounded text-xs font-semibold hover:bg-[#EAE5D8] transition"
          >
            ← MBA Domains Home
          </Link>
        </div>
      </div>
    </div>
  );
}
