import { sendChat, type ChatTurn } from "@/lib/chat-api";
import { FormEvent, memo, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: ChatTurn["role"];
  content: string;
  sources?: Array<{ title: string; sourceType: string }>;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: `You can ask questions about the portfolio. For example: 'What are your core technical skills?' or 'What are your recent projects?'`,
};

const REMARK_PLUGINS = [remarkGfm];

const ChatMessage = memo(({ message }: { message: Message }) => (
  <div
    className={`rounded-lg px-3 py-2 text-sm ${
      message.role === "assistant"
        ? "bg-muted text-foreground"
        : "bg-primary text-primary-foreground"
    }`}
  >
    <ReactMarkdown
      className="prose prose-sm max-w-none whitespace-pre-wrap break-words prose-p:my-2 prose-table:my-2 prose-th:border prose-th:px-2 prose-th:py-1 prose-td:border prose-td:px-2 prose-td:py-1 prose-ul:my-2 prose-ol:my-2 prose-li:my-1"
      remarkPlugins={REMARK_PLUGINS}
    >
      {message.content}
    </ReactMarkdown>
    {message.sources && message.sources.length > 0 ? (
      <p className="mt-2 text-[11px] opacity-80">
        Sources:{" "}
        {message.sources
          .slice(0, 3)
          .map((source) => `${source.title} (${source.sourceType})`)
          .join(", ")}
      </p>
    ) : null}
  </div>
));

ChatMessage.displayName = "ChatMessage";

const ChatMessages = memo(
  ({
    messages,
    isLoading,
    error,
  }: {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
  }) => (
    <div className="max-h-[48vh] space-y-3 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatMessage key={`${message.role}-${index}`} message={message} />
      ))}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">回答を生成中...</p>
      ) : null}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  ),
);

ChatMessages.displayName = "ChatMessages";

const PortfolioChat = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [error, setError] = useState<string | null>(null);

  const history = useMemo<ChatTurn[]>(
    () =>
      messages
        .filter((m) => m !== INITIAL_MESSAGE)
        .map((m) => ({ role: m.role, content: m.content })),
    [messages],
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextMessage = input.trim();
    if (!nextMessage || isLoading) return;

    setIsLoading(true);
    setError(null);
    setInput("");

    const userMessage: Message = { role: "user", content: nextMessage };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendChat({
        message: nextMessage,
        history: [...history, { role: "user", content: nextMessage }],
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
          sources: response.sources.map((source) => ({
            title: source.title,
            sourceType: source.sourceType,
          })),
        },
      ]);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "An unknown error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24" id="chat">
      <div className="mx-auto w-[min(100%-2rem,960px)]">
        <div className="mb-5">
          <h2 className="font-bold text-2xl md:text-3xl">Portfolio Chat</h2>
          <p className="mt-2 text-muted-foreground text-sm md:text-base">
            I answer your questions based on site information, CV, and
            self-introduction data.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/90 shadow-lg backdrop-blur-sm">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            error={error}
          />

          <form className="border-t border-border p-4" onSubmit={onSubmit}>
            <textarea
              className="mb-3 min-h-[96px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Enter your question..."
              value={input}
            />
            <button
              className="w-full rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground text-sm disabled:opacity-50"
              disabled={isLoading || input.trim().length === 0}
              type="submit"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PortfolioChat;
