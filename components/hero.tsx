"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface HeroProps {
  onGetStarted: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-lg">ProteinClassify</span>
        </div>
        <nav className="hidden sm:flex gap-6 text-sm">
          <Link href="/learn" className="text-muted-foreground hover:text-foreground transition">
            Learn
          </Link>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">
            About
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">
            Docs
          </a>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance">Unlock Protein Function</h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance">
            Classify protein sequences into functional categories using cutting-edge AI models. Built for students and
            researchers working with limited resources.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Button onClick={onGetStarted} size="lg" className="bg-accent hover:bg-accent/90 text-white px-8">
            Start Analyzing
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Link href="/learn">
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <span className="text-accent text-xl">⚡</span>
            </div>
            <h3 className="font-semibold">Fast Analysis</h3>
            <p className="text-sm text-muted-foreground">Pre-trained models deliver results in seconds</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <span className="text-accent text-xl">🔬</span>
            </div>
            <h3 className="font-semibold">Accurate Classification</h3>
            <p className="text-sm text-muted-foreground">ESM & ProtT5 models with multi-functional support</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <span className="text-accent text-xl">📚</span>
            </div>
            <h3 className="font-semibold">Educational</h3>
            <p className="text-sm text-muted-foreground">Detailed explanations with biological context</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>Built with pre-trained deep learning models for protein sequence analysis</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-foreground transition">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
