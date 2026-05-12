export type ChatRole = 'user' | 'assistant';

export type ChatTurn = {
  role: ChatRole;
  content: string;
};

export type ChatSource = {
  title: string;
  sourceType: 'site' | 'cv' | 'about';
  path: string;
};

export type ChatResponse = {
  answer: string;
  sources: ChatSource[];
};

const API_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL ?? '';

export const sendChat = async (params: {
  message: string;
  history: ChatTurn[];
}): Promise<ChatResponse> => {
  const endpoint = `${API_BASE_URL}/api/chat`;
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Network error';
    throw new Error(
      `API接続に失敗しました。backend が起動中か、VITE_CHAT_API_BASE_URL が正しいか確認してください。(${reason})`,
    );
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Chat request failed: ${response.status} ${text}`);
  }

  return (await response.json()) as ChatResponse;
};
