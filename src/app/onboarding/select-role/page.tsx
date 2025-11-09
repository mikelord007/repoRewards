import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function SelectRole() {
  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Join RepoRewards</h1>
          <p className="text-muted-foreground mb-8">
            Choose how you want to participate
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Join as Contributor</CardTitle>
              <CardDescription>Earn rewards for your open-source work</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contributor/onboarding">
                <Button className="w-full">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Join as Organization</CardTitle>
              <CardDescription>Create a pool and fund contributors</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/org/onboarding">
                <Button className="w-full" variant="outline">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}


