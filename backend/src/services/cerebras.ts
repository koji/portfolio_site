import { ChatTurn, Chunk } from "../types/chat.js";
import { formatContextForPrompt } from "./mastraAdapter.js";

type CerebrasOptions = {
  apiKey: string;
  model: string;
};

const SYSTEM_PROMPT = `You are the portfolio assistant for Koji.
Answer only using provided context.
If context is insufficient, say you do not know.
Keep answers concise and practical.
Reply in the same language as the user when possible.
If the user asks a question that is not related to the portfolio such as email address, phone number, address, politely decline and suggest a different topic.
`;

const BASE_URL = "https://api.cerebras.ai/v1/chat/completions";

export class CerebrasClient {
  constructor(private readonly options: CerebrasOptions) {}

  async chat(params: {
    message: string;
    history: ChatTurn[];
    contextChunks: Chunk[];
  }): Promise<string> {
    const contextText = formatContextForPrompt(params.contextChunks);

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.options.apiKey}`,
      },
      body: JSON.stringify({
        model: this.options.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...params.history.map((turn) => ({
            role: turn.role,
            content: turn.content,
          })),
          {
            role: "user",
            content: `Question:\n${params.message}\n\nContext:\n${contextText}`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cerebras API error: ${response.status} ${text}`);
    }

    const body = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return (
      body.choices?.[0]?.message?.content?.trim() ?? "No response generated."
    );
  }
}
