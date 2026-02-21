import { promises as fs } from 'node:fs';
import path from 'node:path';
import { SourceDocument } from '../types/chat.js';

const SUPPORTED_EXTENSIONS = new Set(['.md', '.markdown', '.txt', '.json', '.ts', '.tsx']);

type SourceConfig = {
  type: SourceDocument['sourceType'];
  path: string;
};

const readDirRecursive = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readDirRecursive(fullPath)));
      continue;
    }

    if (entry.isFile() && SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
};

const readSourcePath = async (source: SourceConfig): Promise<SourceDocument[]> => {
  try {
    const stat = await fs.stat(source.path);

    if (stat.isFile()) {
      const content = await fs.readFile(source.path, 'utf8');
      return [
        {
          id: source.path,
          title: path.basename(source.path),
          path: source.path,
          content,
          sourceType: source.type,
        },
      ];
    }

    if (stat.isDirectory()) {
      const files = await readDirRecursive(source.path);
      const docs: SourceDocument[] = [];

      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        docs.push({
          id: file,
          title: path.basename(file),
          path: file,
          content,
          sourceType: source.type,
        });
      }

      return docs;
    }
  } catch (error) {
    console.error(`Failed to read source path "${source.path}":`, error);
    return [];
  }

  return [];
};

export const loadPortfolioDocuments = async (): Promise<SourceDocument[]> => {
  const backendRoot = process.cwd();
  const projectRoot = path.resolve(backendRoot, '..');

  const sources: SourceConfig[] = [
    { type: 'site', path: path.join(projectRoot, 'public', 'llm.txt') },
    { type: 'site', path: path.join(projectRoot, 'src', 'data') },
    { type: 'cv', path: path.join(backendRoot, 'knowledge', 'cv') },
    { type: 'about', path: path.join(backendRoot, 'knowledge', 'about') },
  ];

  const all = await Promise.all(sources.map((source) => readSourcePath(source)));
  return all.flat().filter((doc) => doc.content.trim().length > 0);
};
