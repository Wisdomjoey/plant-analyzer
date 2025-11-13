/**
 * ESM-2 embedding parser and processor
 * Handles official ESM-2 API response format
 */

interface ESM2ResponseLayer {
  layer: number;
  embedding: number[];
}

interface ESM2ResponseResult {
  sequence_index: number;
  embeddings: ESM2ResponseLayer[];
}

export interface ESM2Response {
  results: ESM2ResponseResult[];
}

export interface ProcessedEmbedding {
  sequenceIndex: number;
  layer: number;
  embedding: number[];
  mean: number;
  std: number;
  min: number;
  max: number;
}

/**
 * Parse official ESM-2 API response
 * Extracts embeddings from the specified layer (default: 12)
 */
export function parseESM2Response(
  response: ESM2Response,
  layer = 12
): number[] {
  try {
    if (!response.results || response.results.length === 0) {
      throw new Error("No results in ESM-2 response");
    }

    const result = response.results[0];
    const layerData = result.embeddings.find((e) => e.layer === layer);

    if (!layerData) {
      throw new Error(`Layer ${layer} not found in ESM-2 response`);
    }

    return layerData.embedding;
  } catch (error) {
    throw new Error(
      `Failed to parse ESM-2 response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Calculate statistical properties of embedding
 */
export function calculateEmbeddingStats(embedding: number[]) {
  const mean = embedding.reduce((a, b) => a + b, 0) / embedding.length;
  const variance =
    embedding.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) /
    embedding.length;
  const std = Math.sqrt(variance);
  const min = Math.min(...embedding);
  const max = Math.max(...embedding);

  return { mean, std, min, max };
}

/**
 * Extract sequence features from ESM-2 embedding
 * Uses statistical properties for functional classification
 */
export function extractEmbeddingFeatures(embedding: number[]) {
  const stats = calculateEmbeddingStats(embedding);

  // Divide embedding into regions for feature extraction
  const regionSize = Math.floor(embedding.length / 10);
  const regions = [];

  for (let i = 0; i < 10; i++) {
    const start = i * regionSize;
    const end = i === 9 ? embedding.length : (i + 1) * regionSize;
    const region = embedding.slice(start, end);
    const regionMean = region.reduce((a, b) => a + b, 0) / region.length;
    regions.push(regionMean);
  }

  return {
    embeddingStats: stats,
    regions,
    // Calculate feature metrics for classification
    overallMagnitude: Math.sqrt(embedding.reduce((sq, n) => sq + n * n, 0)),
    dynamicRange: stats.max - stats.min,
    complexity: stats.std, // Higher std = more complex pattern
  };
}

/**
 * Compare two embeddings (e.g., for clustering similar proteins)
 * Uses cosine similarity
 */
export function cosineSimilarity(
  embedding1: number[],
  embedding2: number[]
): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error("Embeddings must have same length");
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Generate mock ESM-2 response for development/testing
 * Matches the official API response format
 */
export function generateMockESM2Response(sequence: string): ESM2Response {
  // Generate a deterministic 1280-dim embedding from sequence
  const embedding = new Array(1280).fill(0);

  for (let i = 0; i < sequence.length; i++) {
    const charCode = sequence.charCodeAt(i);
    for (let j = 0; j < 1280; j++) {
      embedding[j] += Math.sin((charCode + j) * 0.01) * 0.05;
    }
  }

  // Normalize embedding
  const stats = calculateEmbeddingStats(embedding);
  const normalized = embedding.map(
    (x) => (x - stats.mean) / (stats.std + 1e-8)
  );

  return {
    results: [
      {
        sequence_index: 0,
        embeddings: [
          {
            layer: 12,
            embedding: normalized,
          },
        ],
      },
    ],
  };
}

export async function generateESM2Response(
  sequence: string
): Promise<ESM2Response> {
  // Generate a deterministic 1280-dim embedding from sequence
  const response = await fetch("https://biolm.ai/api/v3/esm2-35m/encode/", {
    method: "POST",
    body: JSON.stringify({
      items: [
        {
          sequence,
        },
      ],
      params: {},
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.LM_API_KEY}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to generate embeddings from sequence"
    );
  }

  return data;
}
