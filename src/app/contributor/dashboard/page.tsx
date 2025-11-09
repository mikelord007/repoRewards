"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockContributions } from "@/lib/mockData";
import { CheckCircle2, Clock } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";

export default function ContributorDashboard() {
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
        if (!data?.exists || data?.role !== "contributor") {
          router.replace("/onboarding/select-role");
          return;
        }
      } catch {
        // stay on page if lookup fails
      }
    };
    verify();
  }, [isConnected, address, router]);

  const handleClaim = (id: string) => {
    // Mock claim logic
    console.log("Claiming reward:", id);
    alert(`Claiming reward ${id}... (Mock)`);
  };

  const pendingRewards = mockContributions.filter((c) => c.status === "pending");
  const totalClaimable = pendingRewards.reduce(
    (sum, c) => sum + parseFloat(c.amount.replace("$", "")),
    0
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Contributor Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          View your contributions and claimable rewards
        </p>

        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rewards Summary</CardTitle>
            <CardDescription>Your total claimable rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Claimable</p>
                <p className="text-3xl font-bold">${totalClaimable.toFixed(2)}</p>
              </div>
              {pendingRewards.length > 0 && (
                <Button onClick={() => handleClaim("all")}>
                  Claim All Rewards
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contributions List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Contributions</h2>
          {mockContributions.map((contribution) => (
            <Card key={contribution.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {contribution.repository}
                    </CardTitle>
                    <CardDescription>
                      Pull Request: {contribution.pullRequest}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{contribution.amount}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {contribution.status === "claimed" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500">Claimed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-yellow-500">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {contribution.status === "pending"
                  ? contribution.id === "2"
                    ? (
                      <p className="text-sm text-muted-foreground">
                        Pending. Claim will be available soon.
                      </p>
                    )
                    : (
                      <Button
                        onClick={() => handleClaim(contribution.id)}
                        className="w-full"
                      >
                        Claim Reward
                      </Button>
                    )
                  : (
                    <p className="text-sm text-muted-foreground">
                      Claimed on {contribution.claimedAt}
                    </p>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

