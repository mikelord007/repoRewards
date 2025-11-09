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
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ContributorOnboarding() {
  const router = useRouter();
  const { isConnected, address } = useWallet();
  const [githubUsername, setGithubUsername] = useState("");
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGithubConnect = () => {
    // Mock GitHub OAuth flow
    setIsGithubConnected(true);
    alert("GitHub connected! (Mock)");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGithubConnected || !githubUsername) {
      alert("Please connect GitHub and enter your username");
      return;
    }
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          role: "contributor",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to register");
      }
      router.push("/contributor/dashboard");
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
          <h1 className="text-3xl font-bold mb-2">Contributor Onboarding</h1>
          <p className="text-muted-foreground mb-8">
            Connect your wallet and GitHub to start earning rewards
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to receive rewards
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

          {isConnected && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Connect GitHub</CardTitle>
                <CardDescription>
                  Connect your GitHub account to link your contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!isGithubConnected ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGithubConnect}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Connect GitHub
                    </Button>
                  ) : (
                    <div className="p-4 bg-green-900/20 rounded-md border border-green-800">
                      <p className="text-sm text-green-200">
                        ✓ GitHub connected
                      </p>
                    </div>
                  )}

                  {isGithubConnected && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="githubUsername">GitHub Username</Label>
                        <Input
                          id="githubUsername"
                          placeholder="your-username"
                          value={githubUsername}
                          onChange={(e) => setGithubUsername(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="inline-flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                          </span>
                        ) : (
                          "Register as Contributor"
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

