import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createChatRouter } from "./routes/chat.js";
import { CerebrasClient } from "./services/cerebras.js";
import { ChatService } from "./services/chatService.js";

dotenv.config();
const BASE_MODEL = "llama-3.3-70b";
const port = Number(process.env.PORT ?? 8787);
const cerebrasApiKey = process.env.CEREBRAS_API_KEY;
const cerebrasModel = process.env.CEREBRAS_MODEL ?? BASE_MODEL;
const frontendOrigins = (
  process.env.FRONTEND_ORIGIN ?? "http://localhost:8080,http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!cerebrasApiKey) {
  throw new Error("CEREBRAS_API_KEY is required. Add it to backend/.env");
}

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || frontendOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

const chatService = new ChatService(
  new CerebrasClient({
    apiKey: cerebrasApiKey,
    model: cerebrasModel,
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api", createChatRouter(chatService));

app.listen(port, () => {
  console.log(`Portfolio chat backend listening on http://localhost:${port}`);
});
