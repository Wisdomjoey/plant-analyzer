"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import type { ParsedUniProtData } from "@/lib/uniprot-parser"

interface UniProtMetadataPanelProps {
  data: ParsedUniProtData
}

export function UniProtMetadataPanel({ data }: UniProtMetadataPanelProps) {
  return (
    <div className="space-y-6">
      {/* Protein Identity */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Protein Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">PROTEIN NAME</p>
            <p className="font-semibold text-foreground">{data.proteinName}</p>
            {data.shortName && <p className="text-sm text-muted-foreground mt-1">Short name: {data.shortName}</p>}
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">ACCESSION</p>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{data.accession}</code>
              <a
                href={`https://www.uniprot.org/uniprotkb/${data.accession}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {data.gene && (
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">GENE</p>
              <Badge variant="secondary">{data.gene}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organism */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Organism</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">SCIENTIFIC NAME</p>
            <p className="italic text-foreground">{data.organism.scientificName}</p>
          </div>
          {data.organism.commonName && (
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">COMMON NAME</p>
              <p className="text-foreground">{data.organism.commonName}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">TAXON ID</p>
            <a
              href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${data.organism.taxonId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline text-sm"
            >
              {data.organism.taxonId}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Sequence Info */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Sequence Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">LENGTH</p>
              <p className="font-semibold text-lg">{data.sequenceLength} aa</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">EXISTENCE</p>
              <p className="font-semibold text-sm">{data.proteinExistence}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">LAST UPDATE</p>
            <p className="text-sm text-foreground">{new Date(data.lastUpdate).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Functions */}
      {data.functions.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Functions (UniProt)</CardTitle>
            <CardDescription>Curated functional annotations from UniProt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.functions.map((fn, i) => (
              <p key={i} className="text-sm text-foreground leading-relaxed">
                {fn}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Locations */}
      {data.locations.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Subcellular Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.locations.map((loc, i) => (
                <Badge key={i} variant="outline">
                  {loc}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords */}
      {data.keywords.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      {data.features.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Features ({data.features.length})</CardTitle>
            <CardDescription>Domains, sites, and modifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {data.features.slice(0, 10).map((feat, i) => (
              <div key={i} className="border-l-2 border-accent/50 pl-3 py-1">
                <p className="text-sm font-medium text-foreground">{feat.type}</p>
                {feat.position && <p className="text-xs text-muted-foreground">Position: {feat.position}</p>}
                {feat.description && <p className="text-xs text-muted-foreground mt-1">{feat.description}</p>}
              </div>
            ))}
            {data.features.length > 10 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                +{data.features.length - 10} more features
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Key References</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.references.map((ref, i) => (
              <div key={i} className="border-l-2 border-accent/50 pl-3 py-1">
                <p className="text-sm font-medium text-foreground leading-snug">{ref.title}</p>
                {ref.authors.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {ref.authors.slice(0, 2).join(", ")}
                    {ref.authors.length > 2 ? " et al." : ""}
                  </p>
                )}
                {ref.journal && <p className="text-xs text-muted-foreground italic">{ref.journal}</p>}
                {ref.pubmedId && (
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pubmedId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-xs flex items-center gap-1 mt-1"
                  >
                    PubMed: {ref.pubmedId}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
