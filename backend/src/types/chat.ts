export type ChatRole = 'user' | 'assistant';

export type ChatTurn = {
  role: ChatRole;
  content: string;
};

export type SourceDocument = {
  id: string;
  title: string;
  path: string;
  content: string;
  sourceType: 'site' | 'cv' | 'about';
};

export type Chunk = {
  id: string;
  documentId: string;
  text: string;
  title: string;
  path: string;
  sourceType: SourceDocument['sourceType'];
};
