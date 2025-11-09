"use client";

import Link from "next/link";
import Image from "next/image";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/repoRewards%20logo.png"
            alt="RepoRewards logo"
            width={28}
            height={28}
            priority
          />
          <span className="text-2xl font-bold">RepoRewards</span>
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

