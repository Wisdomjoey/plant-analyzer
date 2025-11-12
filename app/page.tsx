"use client"

import { useState } from "react"
import { SequenceInput } from "@/components/sequence-input"
import { Hero } from "@/components/hero"

export default function Home() {
  const [showInput, setShowInput] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background">
      {!showInput ? (
        <Hero onGetStarted={() => setShowInput(true)} />
      ) : (
        <SequenceInput onBack={() => setShowInput(false)} />
      )}
    </main>
  )
}
