"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { ResultsDisplay } from "./results-display"
import type { ClassificationResult } from "@/lib/classification-engine"
import type { ParsedUniProtData } from "@/lib/uniprot-parser"
import type { extractEmbeddingFeatures } from "@/lib/esm2-embeddings"

interface SequenceInputProps {
  onBack: () => void
}

interface AnalysisResults {
  classification: ClassificationResult
  uniprotData?: ParsedUniProtData
  embeddingFeatures?: ReturnType<typeof extractEmbeddingFeatures>
  embeddingStats?: {
    dimension: number
    layer: number
    mean: number
    std: number
    range: [number, number]
  }
}

export function SequenceInput({ onBack }: SequenceInputProps) {
  const [inputType, setInputType] = useState<"sequence" | "uniprot">("sequence")
  const [sequenceInput, setSequenceInput] = useState("")
  const [uniprotId, setUniprotId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<AnalysisResults | null>(null)

  const handleAnalyze = async () => {
    if ((!sequenceInput && !uniprotId) || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequence: sequenceInput || undefined,
          uniprotId: uniprotId || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Classification failed")
      }

      setResults({
        classification: data.data.classification,
        uniprotData: data.data.uniprotData,
        embeddingFeatures: data.data.embeddingFeatures,
        embeddingStats: data.data.embeddingStats,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const isInputValid =
    (inputType === "sequence" && sequenceInput.trim()) || (inputType === "uniprot" && uniprotId.trim())

  if (results) {
    return (
      <ResultsDisplay
        results={results.classification}
        uniprotData={results.uniprotData}
        embeddingFeatures={results.embeddingFeatures}
        embeddingStats={results.embeddingStats}
        onBack={() => setResults(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Analyze Protein Sequence</h1>
          <p className="text-muted-foreground">
            Input your protein sequence or UniProt ID for functional classification
          </p>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="pt-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Error</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Input Method</CardTitle>
            <CardDescription>Choose how you want to provide your protein data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={inputType} onValueChange={(v) => setInputType(v as "sequence" | "uniprot")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sequence">Raw Sequence</TabsTrigger>
                <TabsTrigger value="uniprot">UniProt ID</TabsTrigger>
              </TabsList>

              <TabsContent value="sequence" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Protein Sequence</label>
                  <textarea
                    value={sequenceInput}
                    onChange={(e) => setSequenceInput(e.target.value)}
                    placeholder="Enter protein sequence in single or three-letter code (e.g., MVHLTPE...)
Or paste a FASTA format sequence"
                    className="w-full h-32 p-3 rounded-md border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports standard IUPAC amino acid codes and FASTA format
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="uniprot" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">UniProt ID</label>
                  <input
                    type="text"
                    value={uniprotId}
                    onChange={(e) => setUniprotId(e.target.value.toUpperCase())}
                    placeholder="e.g., P12345 or HUMAN_P12345"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a valid UniProt accession number to automatically fetch the sequence and metadata
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Example Proteins:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• Human Hemoglobin subunit beta (P68871)</p>
                <p>• E. coli β-galactosidase (P00096)</p>
                <p>• SARS-CoV-2 Spike protein (P0DTC2)</p>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!isInputValid || isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⚙️</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Classify Protein
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              1. <strong>Input</strong> your protein sequence or UniProt identifier
            </p>
            <p>
              2. <strong>Fetch</strong> curated metadata and annotations from UniProt
            </p>
            <p>
              3. <strong>Process</strong> using ESM-2 or ProtT5 pre-trained models
            </p>
            <p>
              4. <strong>Classify</strong> into Gene Ontology functional categories
            </p>
            <p>
              5. <strong>Explore</strong> detailed annotations and biological context
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
