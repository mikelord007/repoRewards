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

export default function OrgOnboarding() {
  const { isConnected } = useWallet();
  const [formData, setFormData] = useState({
    projectName: "",
    goal: "",
    fundingAmount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock logic
    console.log("Form submitted:", formData);
    alert("Onboarding submitted! (Mock)");
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Organization Onboarding</h1>
          <p className="text-muted-foreground mb-8">
            Create a funding pool for your open-source project
          </p>

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

          {isConnected && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Fill in the details for your funding pool
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      placeholder="My Awesome Project"
                      value={formData.projectName}
                      onChange={(e) =>
                        setFormData({ ...formData, projectName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Goal</Label>
                    <Input
                      id="goal"
                      placeholder="e.g., $50,000"
                      value={formData.goal}
                      onChange={(e) =>
                        setFormData({ ...formData, goal: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundingAmount">Funding Pool Amount</Label>
                    <Input
                      id="fundingAmount"
                      placeholder="e.g., $10,000"
                      value={formData.fundingAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fundingAmount: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Funding Pool
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

