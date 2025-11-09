"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function OrgOnboarding() {
  const router = useRouter();
  const { isConnected, address } = useWallet();
  const [formData, setFormData] = useState({
    organizationName: "",
    yieldSource: "aave" as "aave" | "morpho" | "kalani",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          role: "organization",
          organization: {
            name: formData.organizationName,
            yieldSource: formData.yieldSource,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to onboard");
      }
      router.push("/org/dashboard");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Organization Onboarding</h1>
          <p className="text-muted-foreground mb-8">
            Tell us about your organization and preferred yield source
          </p>

          {isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>Connected Wallet</CardTitle>
                <CardDescription>
                  {address}
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  Connect your wallet to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <WalletConnect />
                </div>
                {!isConnected && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please connect your wallet to continue
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {isConnected && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  Provide your organization name and yield source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      placeholder="Your Organization Inc."
                      value={formData.organizationName}
                      onChange={(e) =>
                        setFormData({ ...formData, organizationName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yieldSource">Yield Source</Label>
                    <select
                      id="yieldSource"
                      className="w-full h-10 rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm"
                      value={formData.yieldSource}
                      onChange={(e) =>
                        setFormData({ ...formData, yieldSource: e.target.value as any })
                      }
                      required
                    >
                      <option value="aave">Aave</option>
                      <option value="morpho">Morpho</option>
                      <option value="kalani">Kalani</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
                    {isSubmitting ? (
                      <span className="inline-flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing...
                      </span>
                    ) : (
                      "Complete Onboarding"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

