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
You may share contact information (such as email address, phone number, or physical address) only if it is explicitly provided in the context; do not invent or infer any contact details.
If the user asks for contact information that is not present in the provided context, politely explain that you can only share details that appear in the portfolio content and, if appropriate, suggest they check the Contact section of the portfolio.
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
      const errorText = await response.text();
      console.error("Cerebras API error response:", {
        status: response.status,
        body: errorText,
      });
      throw new Error("Cerebras API request failed. Please try again later.");
    }

    const body = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return (
      body.choices?.[0]?.message?.content?.trim() ?? "No response generated."
    );
  }
}
