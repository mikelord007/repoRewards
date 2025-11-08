"use client";

import Link from "next/link";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          RepoRewards
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/org/dashboard"
            className="text-sm font-medium hover:text-primary"
          >
            For Organizations
          </Link>
          <Link
            href="/contributor/dashboard"
            className="text-sm font-medium hover:text-primary"
          >
            For Contributors
          </Link>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}

