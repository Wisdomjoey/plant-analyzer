import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="size-6 sm:size-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>

          <span className="font-bold sm:text-lg">ProteinClassify</span>
        </div>

        <nav className="hidden sm:flex gap-6 text-sm">
          <Link
            href="/learn"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Learn
          </Link>

          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition"
          >
            About
          </Link>

          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Docs
          </Link>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="max-w-4xl pt-24 mx-auto text-center space-y-8 flex-1">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance">
            Unlock Protein Function
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground text-balance">
            Classify protein sequences into functional categories using
            cutting-edge AI models. Built for students and researchers working
            with limited resources.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="text-white px-8"
          >
            <Link href={"/analyze"}>
              Start Analyzing
              <ArrowRight className="size-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 bg-transparent"
          >
            <Link href="/learn">Learn More</Link>
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
          <div className="space-y-2">
            <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <span className="text-accent text-xl">⚡</span>
            </div>

            <h3 className="font-semibold">Fast Analysis</h3>

            <p className="text-sm text-muted-foreground">
              Pre-trained models deliver results in seconds
            </p>
          </div>

          <div className="space-y-2">
            <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <span className="text-accent text-xl">🔬</span>
            </div>

            <h3 className="font-semibold">Accurate Classification</h3>

            <p className="text-sm text-muted-foreground">
              ESM & ProtT5 models with multi-functional support
            </p>
          </div>

          <div className="space-y-2">
            <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <span className="text-accent text-xl">📚</span>
            </div>

            <h3 className="font-semibold">Educational</h3>

            <p className="text-sm text-muted-foreground">
              Detailed explanations with biological context
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>
            Built with pre-trained deep learning models for protein sequence
            analysis
          </p>

          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-foreground transition">
              Privacy
            </Link>

            <Link href="#" className="hover:text-foreground transition">
              Terms
            </Link>

            <Link href="#" className="hover:text-foreground transition">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
