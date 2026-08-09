export type TechCategory =
  | 'react'
  | 'ts'
  | 'redux'
  | 'zustand'
  | 'electron'
  | 'vite'
  | 'webpack'
  | 'three'
  | 'python'
  | 'styled'
  | 'css-modules'
  | 'node';

export type ProjectStatus = 'active' | 'archived_2020';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  statusLabel: string;
  stack: TechCategory[];
}

// テックタグのスタイル・ラベル マッピング
export const TECH_MAP: Record<TechCategory, { label: string; style: string }> = {
  react: { label: 'React', style: 'bg-[#EAF4FE] text-[#1A6FAD]' },
  ts: { label: 'TS', style: 'bg-[#F1EFFE] text-[#5B46D9]' },
  redux: { label: 'Redux', style: 'bg-[#F1EFFE] text-[#5B46D9]' },
  zustand: { label: 'Zustand', style: 'bg-[#EDFAF4] text-[#2D7D52]' },
  electron: { label: 'Electron', style: 'bg-[#EDFAF4] text-[#2D7D52]' },
  vite: { label: 'Vite', style: 'bg-[#FDEEF0] text-[#C53B5A]' },
  webpack: { label: 'Webpack', style: 'bg-[#FDEEF0] text-[#C53B5A]' },
  three: { label: 'Three.js', style: 'bg-[#F1EFFE] text-[#5B46D9]' },
  python: { label: 'Python', style: 'bg-[#FDEEF0] text-[#C53B5A]' },
  styled: { label: 'styled-components', style: 'bg-[#FDEEF0] text-[#C53B5A]' },
  'css-modules': { label: 'CSS Modules', style: 'bg-[#F1EFFE] text-[#5B46D9]' },
  node: { label: 'Node.js', style: 'bg-[#EAF4FE] text-[#1A6FAD]' },
};

// ステータスのスタイル マッピング
export const STATUS_MAP: Record<ProjectStatus, { style: string }> = {
  active: { style: 'bg-[#EDFAF4] text-[#2D7D52]' },
  archived_2020: { style: 'bg-[#FEF0E4] text-[#C25A1C]' },
};

// プロジェクト一覧データ
export const PROJECTS: Project[] = [
  {
    id: 'opentrons-app',
    name: 'Opentrons App',
    status: 'active',
    statusLabel: '● Active',
    stack: ['react', 'ts', 'redux', 'electron', 'node', 'vite', 'css-modules'],
  },
  {
    id: 'opentrons-ai',
    name: 'Opentrons AI',
    status: 'active',
    statusLabel: '● Active',
    stack: ['ts', 'react', 'zustand', 'vite', 'css-modules'],
  },
  {
    id: 'iot-hub',
    name: 'IoT Hub System',
    status: 'archived_2020',
    statusLabel: '● 2020',
    stack: ['webpack', 'ts', 'react', 'redux', 'three', 'python', 'styled', 'node'],
  },
];

// フッターバッジ用サマリー一覧
export const FEATURED_SKILLS = [
  'React',
  'TypeScript',
  'Redux',
  'Node.js',
  'Python',
  'Three.js',
  'styled-components',
  'CSS Modules',
];

// 装飾用背景ドット設定
export const DECORATIVE_DOTS = [
  { className: 'top-24 left-12 w-3 h-3 bg-[#FEF0E4] opacity-80' },
  { className: 'top-40 left-32 w-2 h-2 bg-[#FAED6A] opacity-70' },
  { className: 'top-20 right-16 w-4 h-4 bg-[#EDFAF4] opacity-70' },
  { className: 'top-48 right-32 w-2.5 h-2.5 bg-[#F1EFFE] opacity-80' },
  { className: 'top-36 right-64 w-2 h-2 bg-[#FEF0E4] opacity-60' },
  { className: 'top-60 left-1/4 w-2 h-2 bg-[#EAF4FE] opacity-70' },
];
