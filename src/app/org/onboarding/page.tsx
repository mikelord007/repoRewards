"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress } from "viem";
import { repoRewardsAbi } from "@/abi/RepoRewards";
import { tenderlyChain } from "@/lib/wagmi";

export default function OrgOnboarding() {
  const router = useRouter();
  const { isConnected, address } = useWallet();
  const [formData, setFormData] = useState({
    organizationName: "",
    yieldSource: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisteredOnchain, setIsRegisteredOnchain] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const REPO_REWARDS_ADDRESS = "0x94E2E71aA65aD486f697D764b63E848Da5aB4Db7" as const;

  const { writeContractAsync } = useWriteContract();
  const { isLoading: isWaitingReceipt, isSuccess: isMined } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isMined) {
      setIsRegisteredOnchain(true);
    }
  }, [isMined]);

  const canRegister = useMemo(() => {
    return (
      isConnected &&
      !!address &&
      !!formData.organizationName.trim() &&
      isAddress(formData.yieldSource as `0x${string}`)
    );
  }, [isConnected, address, formData.organizationName, formData.yieldSource]);

  const handleRegisterOnchain = async () => {
    if (!canRegister) return;
    try {
      const hash = await writeContractAsync({
        address: REPO_REWARDS_ADDRESS,
        abi: repoRewardsAbi,
        functionName: "registerOrganization",
        args: [
          formData.yieldSource as `0x${string}`,
          address as `0x${string}`,
          formData.organizationName,
        ],
        chainId: tenderlyChain.id,
      });
      setTxHash(hash);
    } catch (err: any) {
      alert(err?.shortMessage || err?.message || "Failed to send transaction");
    }
  };


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
                    <Input
                      id="yieldSource"
                      placeholder="0x..."
                      value={formData.yieldSource}
                      onChange={(e) =>
                        setFormData({ ...formData, yieldSource: e.target.value })
                      }
                      required
                    />
                  </div>
                  {!isRegisteredOnchain ? (
                    <div className="flex flex-col gap-3">
                      <Button
                        type="button"
                        className="w-full"
                        disabled={!canRegister || isWaitingReceipt}
                        onClick={handleRegisterOnchain}
                      >
                        {isWaitingReceipt ? (
                          <span className="inline-flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering onchain...
                          </span>
                        ) : (
                          "Register Organization onchain"
                        )}
                      </Button>
                      {!!txHash && (
                        <span className="text-xs text-muted-foreground">
                          Tx: {txHash.slice(0, 10)}...
                        </span>
                      )}
                    </div>
                  ) : (
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                      {isSubmitting ? (
                        <span className="inline-flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Completing...
                        </span>
                      ) : (
                        "Complete Onboarding"
                      )}
                    </Button>
                  )}
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

