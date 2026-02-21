import { Router } from 'express';
import { z } from 'zod';
import { ChatService } from '../services/chatService.js';

const schema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1),
      }),
    )
    .default([]),
});

export const createChatRouter = (chatService: ChatService) => {
  const router = Router();

  router.post('/chat', async (req, res) => {
    console.log('[api] POST /api/chat');
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      console.warn('[api] invalid request body');
      return res.status(400).json({
        error: 'Invalid request body',
        details: parsed.error.flatten(),
      });
    }

    try {
      const result = await chatService.ask(parsed.data.message, parsed.data.history);
      return res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected server error';
      console.error(`[api] chat failed: ${message}`);
      return res.status(500).json({ error: message });
    }
  });

  return router;
};
