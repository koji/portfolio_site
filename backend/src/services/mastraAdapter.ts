import { Chunk } from '../types/chat.js';

// Temporary seam for future Mastra migration.
// Replace this adapter implementation with Mastra's RAG pipeline.
export const formatContextForPrompt = (chunks: Chunk[]): string =>
  chunks
    .map((chunk, index) => `Source ${index + 1} (${chunk.sourceType} | ${chunk.title}): ${chunk.text}`)
    .join('\n\n');
