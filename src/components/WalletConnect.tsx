"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const checkedRef = useRef<string | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!isConnected || !address) return;
      const lower = address.toLowerCase();
      if (checkedRef.current === lower) return;
      checkedRef.current = lower;
      try {
        const res = await fetch(`/api/users/${lower}`, { cache: "no-store" });
        const data = await res.json();
        if (data?.exists && data?.role === "contributor") {
          router.push("/contributor/dashboard");
        } else if (data?.exists && data?.role === "organization") {
          router.push("/org/dashboard");
        } else {
          // If user not found, only force redirect to role selection
          // when not already on onboarding-related pages.
          const onOnboarding =
            pathname === "/onboarding/select-role" ||
            pathname?.startsWith("/contributor/onboarding") ||
            pathname?.startsWith("/org/onboarding");
          const onDashboard =
            pathname?.startsWith("/contributor/dashboard") ||
            pathname?.startsWith("/org/dashboard");
          if (!onOnboarding && !onDashboard) {
            router.push("/onboarding/select-role");
          }
        }
      } catch {
        // On error, do not redirect. Stay on current page to avoid false bounces.
        // eslint-disable-next-line no-console
        console.warn("User lookup failed; staying on current page.");
      }
    };
    check();
  }, [isConnected, address, router, pathname]);

  return <ConnectButton />;
}

