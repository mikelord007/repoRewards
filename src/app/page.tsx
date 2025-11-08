import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">RepoRewards</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Fund open-source contributors using the Optent protocol. Distribute
            yield from pooled funds to contributors — like Kickstarter for
            open-source.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/org/onboarding">
              <Button size="lg">
                For Organizations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contributor/onboarding">
              <Button variant="outline" size="lg">
                For Contributors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Funding Pool</h3>
              <p className="text-muted-foreground">
                Organizations create funding pools with their goals and
                contribution targets.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Contributors Work</h3>
              <p className="text-muted-foreground">
                Open-source contributors submit PRs and get rewarded for their
                contributions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Yield Distribution</h3>
              <p className="text-muted-foreground">
                Yield from pooled funds is automatically distributed to
                contributors based on their work.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

