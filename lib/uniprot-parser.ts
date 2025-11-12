/**
 * Parse and extract structured data from UniProt API responses
 * Maps complex UniProt JSON to application-friendly formats
 */

export interface ParsedUniProtData {
  accession: string
  proteinName: string
  shortName?: string
  gene?: string
  organism: {
    scientificName: string
    commonName?: string
    taxonId: number
  }
  sequence: string
  sequenceLength: number
  proteinExistence: string
  keywords: string[]
  functions: string[]
  locations: string[]
  features: {
    type: string
    description?: string
    position?: string
  }[]
  references: {
    title: string
    authors: string[]
    journal?: string
    pubmedId?: number
  }[]
  xrefs: {
    database: string
    ids: string[]
  }[]
  lastUpdate: string
}

/**
 * Extract protein name from UniProt response
 */
function extractProteinName(data: any): { full: string; short?: string } {
  try {
    if (data.proteinDescription?.recommendedName) {
      const rec = data.proteinDescription.recommendedName
      return {
        full: rec.fullName?.value || "Unknown",
        short: rec.shortNames?.[0]?.value,
      }
    }
    return { full: "Unknown protein" }
  } catch {
    return { full: "Unknown protein" }
  }
}

/**
 * Extract gene information
 */
function extractGene(data: any): string | undefined {
  try {
    if (data.genes && data.genes.length > 0) {
      return data.genes[0].geneName?.value
    }
  } catch {
    // Silent fail
  }
  return undefined
}

/**
 * Extract organism information
 */
function extractOrganism(data: any): { scientificName: string; commonName?: string; taxonId: number } {
  try {
    if (data.organism) {
      return {
        scientificName: data.organism.scientificName || "Unknown",
        commonName: data.organism.commonName,
        taxonId: data.organism.taxonId || 0,
      }
    }
  } catch {
    // Silent fail
  }
  return {
    scientificName: "Unknown organism",
    taxonId: 0,
  }
}

/**
 * Extract functional annotations from comments
 */
function extractFunctions(data: any): string[] {
  const functions: string[] = []

  try {
    if (data.comments) {
      for (const comment of data.comments) {
        if (comment.commentType === "FUNCTION" && comment.texts) {
          for (const text of comment.texts) {
            if (text.value) functions.push(text.value)
          }
        }
      }
    }
  } catch {
    // Silent fail
  }

  return functions
}

/**
 * Extract subcellular locations
 */
function extractLocations(data: any): string[] {
  const locations: string[] = []

  try {
    if (data.comments) {
      for (const comment of data.comments) {
        if (comment.commentType === "SUBCELLULAR_LOCATION" && comment.subcellularLocations) {
          for (const loc of comment.subcellularLocations) {
            if (loc.location?.value) {
              locations.push(loc.location.value)
            }
          }
        }
      }
    }
  } catch {
    // Silent fail
  }

  return locations
}

/**
 * Extract keywords
 */
function extractKeywords(data: any): string[] {
  const keywords: string[] = []

  try {
    if (data.keywords) {
      for (const kw of data.keywords) {
        if (kw.name) keywords.push(kw.name)
      }
    }
  } catch {
    // Silent fail
  }

  return keywords
}

/**
 * Extract features (domains, sites, modifications, etc.)
 */
function extractFeatures(data: any): { type: string; description?: string; position?: string }[] {
  const features: { type: string; description?: string; position?: string }[] = []

  try {
    if (data.features) {
      for (const feature of data.features) {
        const position =
          feature.location?.start?.value && feature.location?.end?.value
            ? `${feature.location.start.value}-${feature.location.end.value}`
            : undefined

        features.push({
          type: feature.type || "Unknown",
          description: feature.description,
          position,
        })
      }
    }
  } catch {
    // Silent fail
  }

  return features
}

/**
 * Extract references/citations
 */
function extractReferences(data: any): { title: string; authors: string[]; journal?: string; pubmedId?: number }[] {
  const references: { title: string; authors: string[]; journal?: string; pubmedId?: number }[] = []

  try {
    if (data.references && data.references.length > 0) {
      // Limit to first 5 most relevant references
      for (const ref of data.references.slice(0, 5)) {
        if (ref.citation) {
          references.push({
            title: ref.citation.title || "Untitled",
            authors: ref.citation.authors || [],
            journal: ref.citation.journal,
            pubmedId: ref.citation.pubmedId,
          })
        }
      }
    }
  } catch {
    // Silent fail
  }

  return references
}

/**
 * Extract cross-references to other databases
 */
function extractXrefs(data: any): { database: string; ids: string[] }[] {
  const xrefs: Map<string, Set<string>> = new Map()

  try {
    if (data.uniProtKBCrossReferences) {
      for (const xref of data.uniProtKBCrossReferences) {
        const db = xref.database || "Unknown"
        if (!xrefs.has(db)) xrefs.set(db, new Set())
        xrefs.get(db)?.add(xref.id)
      }
    }
  } catch {
    // Silent fail
  }

  return Array.from(xrefs.entries()).map(([database, ids]) => ({
    database,
    ids: Array.from(ids),
  }))
}

/**
 * Main parser function - converts UniProt API response to application format
 */
export function parseUniProtResponse(data: any): ParsedUniProtData {
  const proteinName = extractProteinName(data)

  return {
    accession: data.primaryAccession || "Unknown",
    proteinName: proteinName.full,
    shortName: proteinName.short,
    gene: extractGene(data),
    organism: extractOrganism(data),
    sequence: data.sequence?.value || "",
    sequenceLength: data.sequence?.value?.length || 0,
    proteinExistence: data.proteinExistence || "Unknown",
    keywords: extractKeywords(data),
    functions: extractFunctions(data),
    locations: extractLocations(data),
    features: extractFeatures(data),
    references: extractReferences(data),
    xrefs: extractXrefs(data),
    lastUpdate: data.entryAudit?.lastAnnotationUpdateDate || new Date().toISOString(),
  }
}
