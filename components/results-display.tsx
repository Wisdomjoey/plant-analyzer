"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, ExternalLink, Copy, Check } from "lucide-react"
import { UniProtMetadataPanel } from "./uniprot-metadata-panel"
import type { ClassificationResult, FunctionalCategory } from "@/lib/classification-engine"
import type { ParsedUniProtData } from "@/lib/uniprot-parser"
import type { extractEmbeddingFeatures } from "@/lib/esm2-embeddings"

interface ResultsDisplayProps {
  results: ClassificationResult
  uniprotData?: ParsedUniProtData
  embeddingFeatures?: ReturnType<typeof extractEmbeddingFeatures>
  embeddingStats?: {
    dimension: number
    layer: number
    mean: number
    std: number
    range: [number, number]
  }
  onBack: () => void
}

export function ResultsDisplay({
  results,
  uniprotData,
  embeddingFeatures,
  embeddingStats,
  onBack,
}: ResultsDisplayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const downloadResults = () => {
    const exportData = {
      classification: results,
      uniprotData: uniprotData,
      exportDate: new Date().toISOString(),
    }
    const json = JSON.stringify(exportData, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `protein-analysis-${results.sequenceId}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadCSV = () => {
    const rows = [
      ["Protein Analysis Export"],
      [],
      ["SEQUENCE INFORMATION"],
      ["Sequence ID", "Length", "Overall Confidence"],
      [results.sequenceId, results.length.toString(), results.confidence.toFixed(3)],
    ]

    if (uniprotData) {
      rows.push(
        [],
        ["UNIPROT METADATA"],
        ["Accession", uniprotData.accession],
        ["Protein Name", uniprotData.proteinName],
        ["Gene", uniprotData.gene || "N/A"],
        ["Organism", uniprotData.organism.scientificName],
      )
    }

    rows.push(
      [],
      ["PRIMARY FUNCTIONS"],
      ["GO ID", "Function Name", "Type", "Confidence", "Description"],
      ...results.primaryFunctions.map((f) => [
        f.id,
        f.name,
        f.type.replace(/_/g, " "),
        f.confidence.toFixed(3),
        f.description,
      ]),
      [],
      ["SECONDARY FUNCTIONS"],
      ["GO ID", "Function Name", "Type", "Confidence", "Description"],
      ...results.secondaryFunctions.map((f) => [
        f.id,
        f.name,
        f.type.replace(/_/g, " "),
        f.confidence.toFixed(3),
        f.description,
      ]),
    )

    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `protein-analysis-${results.sequenceId}-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const FunctionCard = ({ fn }: { fn: FunctionalCategory }) => (
    <Card className="border-border">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">{fn.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {fn.type.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{fn.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">{(fn.confidence * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">confidence</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">GO Term:</p>
          <div className="flex items-center gap-2 bg-muted/50 rounded p-2">
            <code className="text-xs font-mono flex-1">{fn.id}</code>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(fn.id, fn.id)}>
              {copiedId === fn.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <a
              href={`https://www.ebi.ac.uk/QuickGO/term/${fn.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {fn.examples.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Examples:</p>
            <div className="flex flex-wrap gap-2">
              {fn.examples.map((example, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">References:</p>
          <div className="flex flex-col gap-2">
            <a
              href={`https://www.uniprot.org/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              UniProt Database
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://www.ebi.ac.uk/QuickGO/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              Gene Ontology (QuickGO)
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Input
        </Button>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary Card */}
            <Card className="border-border bg-accent/5">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">SEQUENCE ID</p>
                    <p className="font-semibold truncate">{results.sequenceId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">LENGTH</p>
                    <p className="font-semibold">{results.length} aa</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">OVERALL CONFIDENCE</p>
                    <p className="font-semibold text-lg text-accent">{(results.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">FUNCTIONS FOUND</p>
                    <p className="font-semibold">
                      {results.primaryFunctions.length + results.secondaryFunctions.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {results.notes.length > 0 && (
              <Card className="border-border bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">Analysis Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {results.notes.map((note, i) => (
                    <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      {note}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* ESM-2 embedding analysis section */}
            {embeddingFeatures && (
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    ESM-2 Embedding Analysis
                  </CardTitle>
                  <CardDescription>Deep learning embeddings for structural and functional insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">DIMENSION</p>
                      <p className="font-semibold">{embeddingStats?.dimension || 1280}</p>
                      <p className="text-xs text-muted-foreground">Layer {embeddingStats?.layer || 12}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">COMPLEXITY SCORE</p>
                      <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                        {embeddingFeatures.complexity.toFixed(3)}
                      </p>
                      <p className="text-xs text-muted-foreground">Structural complexity</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">DYNAMIC RANGE</p>
                      <p className="font-semibold">{embeddingFeatures.dynamicRange.toFixed(3)}</p>
                      <p className="text-xs text-muted-foreground">Value spread</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Complexity Assessment</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-blue-200 dark:bg-blue-900 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(embeddingFeatures.complexity * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400 min-w-fit">
                        {(embeddingFeatures.complexity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {embeddingFeatures.complexity > 0.7
                        ? "High complexity indicates diverse functional regions and structural motifs"
                        : embeddingFeatures.complexity > 0.4
                          ? "Moderate complexity suggests mixed structural elements"
                          : "Lower complexity indicates simpler structural patterns"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Regional Distribution</p>
                    <div className="flex items-end justify-between gap-1 h-24 bg-muted/30 rounded p-3">
                      {embeddingFeatures.regions.map((value: number, idx: number) => (
                        <div key={idx} className="flex flex-col items-center flex-1 gap-1">
                          <div
                            className="w-full bg-linear-to-t from-blue-500 to-blue-300 dark:from-blue-600 dark:to-blue-400 rounded-sm transition-all hover:from-blue-600 hover:to-blue-400"
                            style={{ height: `${Math.max(Math.abs(value) * 80, 4)}px` }}
                            title={`Region ${idx + 1}: ${value.toFixed(3)}`}
                          />
                          <span className="text-xs text-muted-foreground">{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Distribution across 10 regions of embedding space</p>
                  </div>

                  <div className="pt-3 border-t border-border space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">EMBEDDING STATISTICS</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Mean</p>
                        <p className="font-mono font-semibold">{embeddingStats?.mean.toFixed(6)}</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Std Dev</p>
                        <p className="font-mono font-semibold">{embeddingStats?.std.toFixed(6)}</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Min</p>
                        <p className="font-mono font-semibold">{embeddingStats?.range[0].toFixed(3)}</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Max</p>
                        <p className="font-mono font-semibold">{embeddingStats?.range[1].toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={downloadResults} variant="outline" className="flex-1 sm:flex-none bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
              <Button onClick={downloadCSV} variant="outline" className="flex-1 sm:flex-none bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>

            <Tabs defaultValue="primary" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="primary">Primary Functions ({results.primaryFunctions.length})</TabsTrigger>
                <TabsTrigger value="secondary">Secondary Functions ({results.secondaryFunctions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="primary" className="space-y-4">
                {results.primaryFunctions.length > 0 ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Primary functional categories with highest confidence scores
                    </p>
                    <div className="space-y-4">
                      {results.primaryFunctions.map((fn) => (
                        <FunctionCard key={fn.id} fn={fn} />
                      ))}
                    </div>
                  </>
                ) : (
                  <Card className="border-border">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No primary functions identified
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="secondary" className="space-y-4">
                {results.secondaryFunctions.length > 0 ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Secondary or contextual functional predictions with moderate confidence
                    </p>
                    <div className="space-y-4">
                      {results.secondaryFunctions.map((fn) => (
                        <FunctionCard key={fn.id} fn={fn} />
                      ))}
                    </div>
                  </>
                ) : (
                  <Card className="border-border">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No secondary functions identified
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            <Card className="border-border bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">Understanding Gene Ontology</CardTitle>
                <CardDescription>Learn about the classification framework used in this analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Molecular Function (MF)</p>
                  <p className="text-muted-foreground">
                    Describes what the protein does at the biochemical level (e.g., catalysis, binding)
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Biological Process (BP)</p>
                  <p className="text-muted-foreground">
                    Describes the larger biological goals the protein contributes to (e.g., metabolism, cell cycle)
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Cellular Component (CC)</p>
                  <p className="text-muted-foreground">
                    Describes where in the cell the protein is located or functions (e.g., nucleus, membrane)
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <a
                    href="http://geneontology.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-xs font-medium flex items-center gap-1"
                  >
                    Learn more about Gene Ontology
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - UniProt Metadata */}
          {uniprotData && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <UniProtMetadataPanel data={uniprotData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
