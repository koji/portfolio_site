import { Chunk, SourceDocument } from '../types/chat.js';

const chunkText = (content: string, chunkSize = 900, overlap = 120): string[] => {
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let index = 0;

  while (index < normalized.length) {
    const end = Math.min(index + chunkSize, normalized.length);
    chunks.push(normalized.slice(index, end));

    if (end >= normalized.length) break;
    index = Math.max(0, end - overlap);
  }

  return chunks;
};

const tokenize = (input: string): string[] =>
  input
    .toLowerCase()
    .split(/[^\p{L}\p{N}_]+/u)
    .filter((token) => token.length > 1);

const scoreChunk = (queryTokens: string[], chunk: Chunk): number => {
  const haystack = `${chunk.title} ${chunk.text}`.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      score += 1;
    }
  }

  return score;
};

export class LocalRetriever {
  private chunks: Chunk[] = [];

  upsertDocuments(documents: SourceDocument[]) {
    const next: Chunk[] = [];

    for (const doc of documents) {
      const chunks = chunkText(doc.content);
      for (const [index, text] of chunks.entries()) {
        next.push({
          id: `${doc.id}::${index}`,
          documentId: doc.id,
          text,
          title: doc.title,
          path: doc.path,
          sourceType: doc.sourceType,
        });
      }
    }

    this.chunks = next;
  }

  chunkCount(): number {
    return this.chunks.length;
  }

  private fallback(limit: number): Chunk[] {
    const preferredTypes: Array<Chunk['sourceType']> = ['about', 'cv', 'site'];
    const ordered: Chunk[] = [];

    for (const sourceType of preferredTypes) {
      for (const chunk of this.chunks) {
        if (chunk.sourceType === sourceType) {
          ordered.push(chunk);
        }
      }
    }

    return ordered.slice(0, limit);
  }

  query(question: string, limit = 6): Chunk[] {
    const tokens = tokenize(question);

    const ranked = this.chunks
      .map((chunk) => ({ chunk, score: scoreChunk(tokens, chunk) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.chunk);

    if (ranked.length > 0) {
      return ranked;
    }

    return this.fallback(limit);
  }
}
