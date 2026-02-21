import { loadPortfolioDocuments } from '../ingest/loadDocuments.js';
import { ChatTurn } from '../types/chat.js';
import { CerebrasClient } from './cerebras.js';
import { LocalRetriever } from './retrieval.js';

export class ChatService {
  private retriever = new LocalRetriever();
  private isReady = false;

  constructor(private readonly cerebras: CerebrasClient) {}

  async bootstrap() {
    const docs = await loadPortfolioDocuments();
    this.retriever.upsertDocuments(docs);
    this.isReady = true;
    console.log(
      `[chat] bootstrap completed: docs=${docs.length}, chunks=${this.retriever.chunkCount()}`,
    );

    if (docs.length === 0) {
      console.warn('[chat] no documents were loaded. Please add knowledge files.');
    }
  }

  async ask(message: string, history: ChatTurn[]) {
    if (!this.isReady) {
      await this.bootstrap();
    }

    const contextChunks = this.retriever.query(message, 6);
    console.log(
      `[chat] query received: message="${message.slice(0, 80)}", history=${history.length}, contextChunks=${contextChunks.length}`,
    );
    const answer = await this.cerebras.chat({ message, history, contextChunks });
    console.log(
      `[chat] answer generated: chars=${answer.length}, sources=${contextChunks
        .map((chunk) => chunk.title)
        .join(', ')}`,
    );

    const sources = contextChunks.map((chunk) => ({
      title: chunk.title,
      sourceType: chunk.sourceType,
      path: chunk.path,
    }));

    return { answer, sources };
  }
}
