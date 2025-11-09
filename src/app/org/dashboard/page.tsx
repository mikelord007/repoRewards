"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockFundingPools } from "@/lib/mockData";
import { Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";

export default function OrgDashboard() {
  const router = useRouter();
  const { isConnected, address } = useWallet();
  const checked = useRef<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!isConnected || !address) return;
      const lower = address.toLowerCase();
      if (checked.current === lower) return;
      checked.current = lower;
      try {
        const res = await fetch(`/api/users/${lower}`, { cache: "no-store" });
        const data = await res.json();
        if (!data?.exists) {
          router.replace("/org/onboarding");
          return;
        }
        if (data?.role !== "organization") {
          router.replace("/onboarding/select-role");
        }
      } catch {
        // stay on page if lookup fails
      }
    };
    verify();
  }, [isConnected, address, router]);

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your funding pools and track contributions
            </p>
          </div>
          <Link href="/org/onboarding">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Pool
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFundingPools.map((pool) => (
            <Card key={pool.id}>
              <CardHeader>
                <CardTitle>{pool.name}</CardTitle>
                <CardDescription>Goal: {pool.goal}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Funds</p>
                    <p className="text-2xl font-bold">{pool.totalFunds}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Yield Distributed
                    </p>
                    <p className="text-xl font-semibold">
                      {pool.yieldDistributed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contributors</p>
                    <p className="text-lg font-medium">{pool.contributors}</p>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

