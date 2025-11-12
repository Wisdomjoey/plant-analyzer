/**
 * Protein functional classification engine
 * Maps sequence features to Gene Ontology categories
 */

import type { extractEmbeddingFeatures } from "./esm2-embeddings"

export interface FunctionalCategory {
  id: string
  name: string
  type: "molecular_function" | "biological_process" | "cellular_component"
  confidence: number
  description: string
  examples: string[]
  references: {
    geneOntology: string
    uniProt?: string
  }
  embeddingBased?: boolean
}

export interface ClassificationResult {
  sequence: string
  sequenceId: string
  length: number
  primaryFunctions: FunctionalCategory[]
  secondaryFunctions: FunctionalCategory[]
  confidence: number
  notes: string[]
  embeddingFeatures?: ReturnType<typeof extractEmbeddingFeatures>
}

/**
 * Rule-based classifier for functional categories
 * Maps sequence features to GO terms
 */
export function classifyProtein(
  sequence: string,
  stats: ReturnType<typeof import("./protein-api").getSequenceStats>,
  sequenceId: string,
): ClassificationResult {
  return classifyProteinWithEmbeddings(sequence, stats, sequenceId)
}

/**
 * Enhanced classification using both sequence stats and embedding features
 */
export function classifyProteinWithEmbeddings(
  sequence: string,
  stats: ReturnType<typeof import("./protein-api").getSequenceStats>,
  sequenceId: string,
  embeddingFeatures?: ReturnType<typeof extractEmbeddingFeatures>,
): ClassificationResult {
  const primaryFunctions: FunctionalCategory[] = []
  const secondaryFunctions: FunctionalCategory[] = []

  // Hydrophobic-rich proteins: membrane proteins, lipid binding
  if (stats.hydrophobicity > 45) {
    const confidence = 0.75 + (stats.hydrophobicity - 45) * 0.005
    // Boost confidence if embedding suggests structured membrane protein
    const boostedConfidence =
      embeddingFeatures && embeddingFeatures.complexity > 0.5 ? Math.min(confidence + 0.1, 0.95) : confidence

    primaryFunctions.push({
      id: "GO:0005215",
      name: "Transporter Activity",
      type: "molecular_function",
      confidence: boostedConfidence,
      description: "Enables the directed movement of substances across membranes or cellular components.",
      examples: ["Ion channels", "Aquaporins", "Transporters"],
      references: {
        geneOntology: "GO:0005215",
        uniProt: "TRANSMEM",
      },
      embeddingBased: embeddingFeatures ? true : false,
    })

    secondaryFunctions.push({
      id: "GO:0031224",
      name: "Intrinsic Component of Membrane",
      type: "cellular_component",
      confidence: 0.68,
      description: "Proteins with strong hydrophobic character often localize to membranes.",
      examples: ["GPCRs", "Tight junction proteins", "Adhesion molecules"],
      references: {
        geneOntology: "GO:0031224",
      },
    })
  }

  // Highly charged proteins: DNA/RNA binding, enzymatic activity
  if (Math.abs(stats.netCharge) > 15) {
    // Embedding complexity as indicator of functional regions
    const chargeConfidence = 0.7 + (embeddingFeatures?.complexity || 0) * 0.15

    primaryFunctions.push({
      id: "GO:0003677",
      name: "DNA Binding",
      type: "molecular_function",
      confidence: Math.min(chargeConfidence, 0.95),
      description: "Interacting selectively and non-covalently with DNA.",
      examples: ["Transcription factors", "Histones", "Helicases"],
      references: {
        geneOntology: "GO:0003677",
        uniProt: "DNA_BIND",
      },
      embeddingBased: embeddingFeatures ? true : false,
    })

    primaryFunctions.push({
      id: "GO:0003723",
      name: "RNA Binding",
      type: "molecular_function",
      confidence: 0.65,
      description: "Interacting selectively and non-covalently with RNA.",
      examples: ["Ribosomes", "snRNPs", "tRNA synthetases"],
      references: {
        geneOntology: "GO:0003723",
        uniProt: "RNA_BIND",
      },
    })
  }

  // Enzyme-like characteristics
  if (stats.composition["H"] && stats.composition["H"] > 2) {
    primaryFunctions.push({
      id: "GO:0016740",
      name: "Transferase Activity",
      type: "molecular_function",
      confidence: 0.62,
      description: "Catalyzes the transfer of a group from one compound to another.",
      examples: ["Kinases", "Phosphatases", "Methyltransferases"],
      references: {
        geneOntology: "GO:0016740",
        uniProt: "TRANSFERASE",
      },
    })
  }

  // Proline-rich proteins: signal transduction, structural
  if (stats.composition["P"] && stats.composition["P"] > 5) {
    secondaryFunctions.push({
      id: "GO:0004871",
      name: "Signal Transducer Activity",
      type: "molecular_function",
      confidence: 0.58,
      description: "Conveys a signal across a cell to trigger a response.",
      examples: ["SH3-domain proteins", "PH-domain proteins"],
      references: {
        geneOntology: "GO:0004871",
      },
    })
  }

  // Cysteine-rich: structural proteins, redox activity
  if (stats.composition["C"] && stats.composition["C"] > 3) {
    secondaryFunctions.push({
      id: "GO:0015035",
      name: "Protein Disulfide Oxidoreductase Activity",
      type: "molecular_function",
      confidence: 0.64,
      description: "Catalyzes the formation and reduction of disulfide bonds.",
      examples: ["Thioredoxins", "PDI", "Glutaredoxins"],
      references: {
        geneOntology: "GO:0015035",
      },
    })

    secondaryFunctions.push({
      id: "GO:0005200",
      name: "Structural Protein Activity",
      type: "molecular_function",
      confidence: 0.6,
      description: "Provides structural support to cells.",
      examples: ["Keratins", "Collagens", "Fibrinogen"],
      references: {
        geneOntology: "GO:0005200",
      },
    })
  }

  // Cell signaling / metabolic processes
  if (stats.length > 300) {
    primaryFunctions.push({
      id: "GO:0008152",
      name: "Metabolic Process",
      type: "biological_process",
      confidence: 0.55,
      description: "Chemical reactions and pathways that modify substances.",
      examples: ["Glycolysis", "TCA cycle", "Photosynthesis"],
      references: {
        geneOntology: "GO:0008152",
      },
    })
  }

  // General cellular localization
  primaryFunctions.push({
    id: "GO:0005623",
    name: "Intracellular Component",
    type: "cellular_component",
    confidence: 0.5,
    description: "Proteins contained within the cell.",
    examples: ["Soluble proteins", "Organellar proteins"],
    references: {
      geneOntology: "GO:0005623",
    },
  })

  // Sort by confidence and filter
  const allFunctions = [...primaryFunctions, ...secondaryFunctions]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 8)

  // Split back into primary and secondary
  const sortedPrimary = allFunctions.filter((f) => primaryFunctions.includes(f))
  const sortedSecondary = allFunctions.filter((f) => secondaryFunctions.includes(f))

  const overallConfidence =
    sortedPrimary.length > 0 ? sortedPrimary.reduce((sum, f) => sum + f.confidence, 0) / sortedPrimary.length : 0.5

  const notes: string[] = []
  if (stats.hydrophobicity > 45) {
    notes.push(`High hydrophobicity (${stats.hydrophobicity.toFixed(1)}%) suggests membrane association`)
  }
  if (Math.abs(stats.netCharge) > 15) {
    notes.push(
      `High net charge (${stats.netCharge > 0 ? "+" : ""}${stats.netCharge.toFixed(1)}) suggests nucleic acid binding`,
    )
  }
  if (stats.length < 50) {
    notes.push("Short sequence detected - may be a peptide or domain")
  }
  // Add embedding-based insights
  if (embeddingFeatures) {
    if (embeddingFeatures.complexity > 0.7) {
      notes.push(
        `Complex structural patterns detected in embedding (score: ${embeddingFeatures.complexity.toFixed(2)})`,
      )
    }
    if (embeddingFeatures.dynamicRange > 1.5) {
      notes.push("Diverse functional regions predicted based on embedding analysis")
    }
  }

  return {
    sequence,
    sequenceId,
    length: stats.length,
    primaryFunctions: sortedPrimary,
    secondaryFunctions: sortedSecondary,
    confidence: overallConfidence,
    notes,
    embeddingFeatures,
  }
}
