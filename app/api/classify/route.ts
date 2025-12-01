import { type NextRequest, NextResponse } from "next/server";
import {
  validateSequence,
  cleanSequence,
  getSequenceStats,
} from "@/lib/protein-api";
import { classifyProteinWithEmbeddings } from "@/lib/classification-engine";
import { parseUniProtResponse } from "@/lib/uniprot-parser";
import {
  extractEmbeddingFeatures,
  generateESM2Response,
  // generateMockESM2Response,
  parseESM2Response,
} from "@/lib/esm2-embeddings";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sequence, uniprotId } = body;

    if (!sequence && !uniprotId) {
      return NextResponse.json(
        { error: "Either sequence or uniprotId is required" },
        { status: 400 }
      );
    }

    let proteinSequence = sequence;
    let sequenceId = uniprotId || "N/A";
    let rawUniProtData = null;

    // Fetch and parse full UniProt response when ID provided
    if (uniprotId && !sequence) {
      try {
        const response = await fetch(
          `https://rest.uniprot.org/uniprotkb/${uniprotId}`
        );
        if (!response.ok) {
          throw new Error(`UniProt API error: ${response.statusText}`);
        }
        rawUniProtData = await response.json();
        proteinSequence = rawUniProtData.sequence?.value;
        sequenceId = rawUniProtData.primaryAccession || uniprotId;
        console.log(proteinSequence)
      } catch (error) {
        return NextResponse.json(
          {
            error: `Failed to fetch UniProt sequence: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
          { status: 400 }
        );
      }
    }

    // Validate sequence
    const cleaned = cleanSequence(proteinSequence);
    if (!validateSequence(cleaned)) {
      return NextResponse.json(
        { error: "Invalid protein sequence format" },
        { status: 400 }
      );
    }

    if (cleaned.length < 10) {
      return NextResponse.json(
        { error: "Sequence must be at least 10 amino acids long" },
        { status: 400 }
      );
    }

    // const esm2Response = generateMockESM2Response(cleaned);
    const esm2Response = await generateESM2Response(cleaned);
    const embeddings = parseESM2Response(esm2Response, 12);
    const embeddingFeatures = extractEmbeddingFeatures(embeddings);

    // Calculate sequence statistics
    const stats = getSequenceStats(cleaned);

    const classification = classifyProteinWithEmbeddings(
      cleaned,
      stats,
      sequenceId,
      embeddingFeatures
    );

    // Parse UniProt data if available
    let uniprotData = null;
    if (rawUniProtData) {
      uniprotData = parseUniProtResponse(rawUniProtData);
    }

    return NextResponse.json({
      success: true,
      data: {
        classification,
        stats,
        embeddingFeatures,
        embeddingStats: {
          dimension: embeddings.length,
          layer: 12,
          mean: embeddingFeatures.embeddingStats.mean,
          std: embeddingFeatures.embeddingStats.std,
          range: [
            embeddingFeatures.embeddingStats.min,
            embeddingFeatures.embeddingStats.max,
          ],
        },
        uniprotData,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Server error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
