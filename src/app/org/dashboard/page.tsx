"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockFundingPools, mockContributions } from "@/lib/mockData";
import { Github, Info } from "lucide-react";
import { useEffect, useRef, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";

export default function OrgDashboard() {
  const router = useRouter();
  const { isConnected, address } = useWallet();
  const checked = useRef<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  type Allocation = {
    id: string;
    name: string;
    amount: number;
    goal: string;
    yieldDistributed: string;
    contributors: number;
    repo?: string;
  };
  const [allocations, setAllocations] = useState<Allocation[]>(() =>
    mockFundingPools.map((p) => ({
      id: p.id,
      name: p.name,
      amount: parseFloat(p.totalFunds.replace(/[^0-9.]/g, "")) || 0,
      goal: p.goal,
      yieldDistributed: p.yieldDistributed,
      contributors: p.contributors,
      repo: p.repo,
    }))
  );
  // Track which sliders/allocations the user has explicitly adjusted
  const [touchedIds, setTouchedIds] = useState<Set<string>>(new Set());
  const markTouched = (id: string) => {
    setTouchedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const verify = async () => {
      if (!isConnected || !address) return;
      const lower = address.toLowerCase();
      if (checked.current === lower) return;
      checked.current = lower;
      try {
        const res = await fetch(`/api/users/${lower}`, { cache: "no-store" });
        const data = await res.json();
        if (!data?.exists || data?.role !== "organization") {
          router.replace("/onboarding/select-role");
          return;
        }
      } catch {
        // stay on page if lookup fails
      }
    };
    verify();
  }, [isConnected, address, router]);

  // Temporary fixed vault balance
  const totalVaultUsd = 100400;

  const formatMoney = (n: number) =>
    `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const parseMoney = (s: string) => {
    if (!s) return 0;
    const num = parseFloat(String(s).replace(/[^0-9.]/g, ""));
    return isFinite(num) ? num : 0;
  };

  const totalPayoutUsd = useMemo(
    () => allocations.reduce((sum, a) => sum + parseMoney(a.yieldDistributed), 0),
    [allocations]
  );

  const setAllocationAmount = (id: string, nextAmountRaw: number) => {
    const total = totalVaultUsd;
    const nextAmount = Math.max(0, Math.min(nextAmountRaw, total));
    setAllocations((prev) => {
      const current = prev.find((p) => p.id === id);
      if (!current) return prev;
      // Only adjust allocations that haven't been explicitly touched by the user
      const untouchedOthers = prev.filter(
        (p) => p.id !== id && !touchedIds.has(p.id)
      );
      // If all others are touched, fall back to adjusting all others
      const others = untouchedOthers.length > 0 ? untouchedOthers : prev.filter((p) => p.id !== id);
      const diff = nextAmount - current.amount; // positive means we need to remove from others
      if (Math.abs(diff) < 1e-6 || others.length === 0) {
        return prev.map((p) => (p.id === id ? { ...p, amount: nextAmount } : p));
      }
      const totalOthers = others.reduce((s, p) => s + p.amount, 0);
      if (totalOthers <= 0) {
        // everything else is zero; clamp current to total and keep others at zero
        const clamped = Math.min(nextAmount, total);
        return prev.map((p) => (p.id === id ? { ...p, amount: clamped } : { ...p, amount: 0 }));
      }
      // distribute -diff across others proportionally to their current share
      let remaining = -diff;
      const updated = prev.map((p) => {
        if (p.id === id) return { ...p, amount: nextAmount };
        if (!others.find((o) => o.id === p.id)) return p;
        const share = p.amount / totalOthers || 0;
        const delta = remaining * share; // can be +/-
        const newAmt = Math.max(0, p.amount + delta);
        return { ...p, amount: newAmt };
      });
      // fix rounding drift to ensure sum == total
      const sumAfter = updated.reduce((s, p) => s + p.amount, 0);
      const drift = total - sumAfter;
      if (Math.abs(drift) > 1e-6) {
        // apply drift to the largest non-target bucket (or target if none)
        const nonTarget = updated.filter((p) => p.id !== id && others.find((o) => o.id === p.id));
        const targetFix = (nonTarget.length ? nonTarget : updated).reduce(
          (max, p) => (p.amount > max.amount ? p : max),
          updated[0]
        );
        return updated.map((p) =>
          p === targetFix ? { ...p, amount: Math.max(0, p.amount + drift) } : p
        );
      }
      return updated;
    });
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount) {
      alert("Enter an amount to deposit");
      return;
    }
    // Mock deposit action
    alert(`Deposited $${depositAmount} to vault (Mock)`);
    setDepositAmount("");
  };

  const handleSaveAllocations = () => {
    // Mock save action - replace with Supabase API call if needed
    const payload = allocations.map((a) => ({ id: a.id, amount: Math.round(a.amount * 100) / 100 }));
    // eslint-disable-next-line no-console
    console.log("Saving allocations:", payload);
    alert("Allocations saved! (Mock)");
    // Reset touched state after a successful save
    setTouchedIds(new Set());
  };

  // Add new project
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectRepo, setNewProjectRepo] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [distributeStep, setDistributeStep] = useState<"Harvest" | "Allocate">("Harvest");

  const addProjectDirect = (name: string, repoUrl: string) => {
    const n = name.trim();
    const r = repoUrl.trim();
    if (!n) {
      alert("Please enter a project name");
      return false;
    }
    if (!r) {
      alert("Please enter a GitHub repository URL");
      return false;
    }
    const id = `p_${Date.now()}`;
    setAllocations((prev) => [
      ...prev,
      {
        id,
        name: n,
        amount: 0,
        goal: "",
        yieldDistributed: "$0",
        contributors: 0,
        repo: r,
      },
    ]);
    setNewProjectName("");
    setNewProjectRepo("");
    return true;
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    addProjectDirect(newProjectName, newProjectRepo);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Manage your vault and track contributions
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vault Balance</CardTitle>
            <CardDescription>Total funds currently in your vault</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{formatMoney(totalVaultUsd)}</p>
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Contributor Payout</span>
                    <span className="hover:text-primary cursor-pointer" title="Yield from vault principal; distributed to contributors">
                      <Info
                        className="h-4 w-4"
                      />
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <p className="text-lg font-semibold">{formatMoney(totalPayoutUsd)}</p>
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => {
                        setDistributeStep("Harvest");
                        setShowDistributeModal(true);
                      }}
                    >
                      Distribute
                    </Button>
                  </div>
                </div>
              </div>
              <form onSubmit={handleDeposit} className="flex items-center gap-3 w-full md:w-auto">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount (USD)"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full md:w-56"
                />
                <Button type="submit">Deposit</Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Overview of all active projects</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddModal(true)}>Add Project</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b">
                    <th className="text-left py-2 pr-3">Project</th>
                    <th className="text-left py-2 pr-3">Allocation</th>
                    <th className="text-left py-2 pr-3">Contributors</th>
                    <th className="text-left py-2">GitHub</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((a) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2 pr-3">{a.name}</td>
                      <td className="py-2 pr-3">{formatMoney(a.amount)}</td>
                      <td className="py-2 pr-3">{a.contributors}</td>
                      <td className="py-2">
                        {a.repo && (
                          <a
                            href={a.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:underline"
                          >
                            <Github className="h-4 w-4" />
                            GitHub
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Allocation</CardTitle>
            <CardDescription>
              Adjust how funds are allocated across your projects. Total remains constant.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {allocations.map((a) => {
              const percent = totalVaultUsd > 0 ? Math.round((a.amount / totalVaultUsd) * 100) : 0;
              return (
                <div key={a.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-muted-foreground">{formatMoney(a.amount)} ({percent}%)</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={percent}
                    onChange={(e) => {
                      markTouched(a.id);
                      const nextPercent = Number(e.target.value);
                      const nextAmount = (nextPercent / 100) * totalVaultUsd;
                      setAllocationAmount(a.id, nextAmount);
                    }}
                    className="w-full accent-primary"
                  />
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={a.amount.toFixed(2)}
                      onChange={(e) => {
                        markTouched(a.id);
                        setAllocationAmount(a.id, Number(e.target.value));
                      }}
                      className="w-40"
                    />
                    <span className="text-sm text-muted-foreground">USD</span>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between pt-2 border-t mt-2">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-sm font-semibold">{formatMoney(totalVaultUsd)}</div>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={handleSaveAllocations}
                disabled={touchedIds.size === 0}
              >
                Save Allocation
              </Button>
            </div>
          </CardContent>
        </Card>

        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
                <CardDescription>Provide a name and GitHub link</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (addProjectDirect(newProjectName, newProjectRepo)) {
                      setShowAddModal(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <Input
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="GitHub repo URL"
                    value={newProjectRepo}
                    onChange={(e) => setNewProjectRepo(e.target.value)}
                    required
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Project</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        {showDistributeModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Distribute Yield</CardTitle>
                    <CardDescription>Harvest and allocate yield to contributors</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setShowDistributeModal(false)}>
                    Close
                  </Button>
                </div>
                <div className="mt-4 inline-flex rounded-md border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setDistributeStep("Harvest")}
                    className={`px-4 py-2 text-sm ${distributeStep === "Harvest" ? "bg-accent text-accent-foreground" : "bg-background"}`}
                  >
                    Harvest
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistributeStep("Allocate")}
                    className={`px-4 py-2 text-sm border-l ${distributeStep === "Allocate" ? "bg-accent text-accent-foreground" : "bg-background"}`}
                  >
                    Allocate
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {distributeStep === "Harvest" ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount to harvest</p>
                      <p className="text-2xl font-semibold">{formatMoney(totalPayoutUsd)}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowDistributeModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setDistributeStep("Allocate")}>
                        Harvest Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Allocate harvested yield to contributors</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-muted-foreground">
                          <tr className="border-b">
                            <th className="text-left py-2 pr-3">Contributor</th>
                            <th className="text-left py-2 pr-3">Repository</th>
                            <th className="text-left py-2 pr-3">Reference</th>
                            <th className="text-left py-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockContributions.map((c) => (
                            <tr key={c.id} className="border-b last:border-0">
                              <td className="py-2 pr-3">{`Contributor ${c.id}`}</td>
                              <td className="py-2 pr-3">{c.repository}</td>
                              <td className="py-2 pr-3">{c.pullRequest}</td>
                              <td className="py-2">{c.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDistributeStep("Harvest")}>
                        Back
                      </Button>
                      <Button onClick={() => setShowDistributeModal(false)}>Confirm Allocation</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

