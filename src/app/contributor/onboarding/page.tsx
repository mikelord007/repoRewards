"use client";

import { Suspense, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

function ContributorOnboardingInner() {
  const router = useRouter();
  const { isConnected, address } = useWallet();
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const handleGithubConnect = () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }
    window.location.href = `/api/github/login?wallet=${address}`;
  };

  // When returning from OAuth, or when wallet connects, fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!address) return;
      const res = await fetch(`/api/contributors/${address.toLowerCase()}`, { cache: "no-store" });
      const json = await res.json();
      const p = json?.profile;
      if (p?.login) {
        setIsGithubConnected(true);
        setProfileName(p.name || p.login);
        setProfileAvatar(p.avatar_url || null);
      }
    };
    if (isConnected) {
      const ghConnected = searchParams.get("github") === "connected";
      if (ghConnected) fetchProfile();
      // Also try once on connect
      fetchProfile();
    }
  }, [isConnected, address, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGithubConnected) {
      alert("Please connect GitHub first");
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
            Connect your GitHub to get started
          </p>

          <Card className="mt-0">
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
                    <div className="p-4 bg-green-900/20 rounded-md border border-green-800 flex items-center gap-3">
                      {profileAvatar && (
                        <img src={profileAvatar} alt="GitHub avatar" className="h-8 w-8 rounded-full" />
                      )}
                      <p className="text-sm text-green-200">
                        ✓ GitHub connected{profileName ? `: ${profileName}` : ""}
                      </p>
                    </div>
                  )}

                  {isGithubConnected && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="inline-flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Continuing...
                          </span>
                        ) : (
                          "Continue"
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ContributorOnboarding() {
  return (
    <Suspense fallback={null}>
      <ContributorOnboardingInner />
    </Suspense>
  );
}

