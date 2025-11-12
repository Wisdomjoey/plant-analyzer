/**
 * Protein sequence analysis using pre-trained models
 * Leverages ESM and ProtT5 through public APIs
 */

interface ProteinSequence {
  id: string
  sequence: string
  description?: string
}

interface EmbeddingResponse {
  embeddings: number[][]
  residues: string[]
}

interface UniProtResponse {
  entry: string
  sequence: {
    value: string
  }
  proteinDescription?: {
    recommendedName: {
      fullName: {
        value: string
      }
    }
  }
}

/**
 * Fetch protein sequence from UniProt by ID
 */
export async function fetchFromUniProt(uniprotId: string): Promise<ProteinSequence> {
  try {
    const url = `https://rest.uniprot.org/uniprotkb/${uniprotId}.json`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`UniProt API error: ${response.statusText}`)
    }

    const data: UniProtResponse = await response.json()

    return {
      id: data.entry,
      sequence: data.sequence.value,
      description: data.proteinDescription?.recommendedName.fullName.value,
    }
  } catch (error) {
    throw new Error(`Failed to fetch from UniProt: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

import { parseESM2Response, generateMockESM2Response } from "./esm2-embeddings"

/**
 * Generate protein embeddings using ESM-2
 * Now supports official ESM-2 API response format
 */
export async function generateEmbeddings(sequence: string): Promise<number[]> {
  try {
    // For production: replace with actual ESM-2 API call
    // Example: const response = await fetch("https://api.esmatlas.com/v1/structure/predict", ...)
    // Current: use mock response matching official API format

    const esm2Response = generateMockESM2Response(sequence)
    const embedding = parseESM2Response(esm2Response, 12) // Use layer 12 embeddings

    return embedding
  } catch (error) {
    throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Validate protein sequence format
 */
export function validateSequence(sequence: string): boolean {
  const cleanedSequence = sequence.toUpperCase().replace(/\s/g, "")
  // Standard IUPAC amino acid codes
  const validChars = /^[ACDEFGHIKLMNPQRSTVWY*-]+$/
  return validChars.test(cleanedSequence) && cleanedSequence.length > 0
}

/**
 * Clean and normalize protein sequence
 */
export function cleanSequence(sequence: string): string {
  return sequence
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[0-9]/g, "")
    .replace(/[\n\r]/g, "")
    .match(/^>.*$/m) // Remove FASTA headers
    ? sequence.split("\n").slice(1).join("")
    : sequence
}

/**
 * Extract composition features from sequence
 */
export function getSequenceComposition(sequence: string): Record<string, number> {
  const cleaned = cleanSequence(sequence).toUpperCase()
  const composition: Record<string, number> = {}

  for (const aa of cleaned) {
    composition[aa] = (composition[aa] || 0) + 1
  }

  // Normalize to percentages
  const length = cleaned.length
  Object.keys(composition).forEach((aa) => {
    composition[aa] = (composition[aa] / length) * 100
  })

  return composition
}

/**
 * Calculate sequence statistics
 */
export function getSequenceStats(sequence: string) {
  const cleaned = cleanSequence(sequence)
  const composition = getSequenceComposition(sequence)

  // Hydrophobic residues
  const hydrophobic = ["A", "I", "L", "M", "F", "W", "P", "V"]
  const hydrophobicCount = cleaned.split("").filter((aa) => hydrophobic.includes(aa)).length
  const hydrophobicity = (hydrophobicCount / cleaned.length) * 100

  // Charged residues
  const positive = ["K", "R", "H"].reduce((sum, aa) => sum + (composition[aa] || 0), 0)
  const negative = ["D", "E"].reduce((sum, aa) => sum + (composition[aa] || 0), 0)

  return {
    length: cleaned.length,
    hydrophobicity,
    positiveCharge: positive,
    negativeCharge: negative,
    netCharge: positive - negative,
    composition,
  }
}
