import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function OrgBriefing() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">For Organizations</h1>
            <p className="text-muted-foreground text-lg">
              Understand how RepoRewards helps you fund contributors using pooled funds and automated yield distribution.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>1. Create a Funding Pool</CardTitle>
                <CardDescription>Define your project, goal, and pool size</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Set up a pool dedicated to your open-source project. Specify your funding goal and initial contribution.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Deposit & Generate Yield</CardTitle>
                <CardDescription>Your principal stays intact</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Funds are pooled and deployed via Optent-integrated strategies. Yield generated from the pool is used for rewards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Reward Contributors</CardTitle>
                <CardDescription>Fair distribution based on impact</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contributors submit PRs and work items. Yield is distributed automatically based on contribution metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>What you get</CardTitle>
                <CardDescription>Transparent reporting and simple controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                  <li>Dashboard to track total funds, generated yield, and payouts</li>
                  <li>Clear view of contributor activity and reward distribution</li>
                  <li>Non-custodial: withdraw your principal anytime (mocked in this demo)</li>
                </ul>
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link href="/org/onboarding" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/org/dashboard" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


