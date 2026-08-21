import { TechCategory, ProjectStatus, TECH_MAP, STATUS_MAP } from '../types/hero';
import type { ReactNode } from 'react';

// 技術タグバッジ
export const TechBadge = ({ category }: { category: TechCategory }): ReactNode => {
  const tech = TECH_MAP[category];
  if (!tech) return null;
  return (
    <span className={`px-2 py-0.5 text-xs rounded-[4px] ${tech.style}`}>
      {tech.label}
    </span>
  );
};

// ステータスバッジ
export const StatusBadge = ({ status, label }: { status: ProjectStatus; label: string }): ReactNode => {
  const config = STATUS_MAP[status];
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-[4px] whitespace-nowrap ${config.style}`}
    >
      {label}
    </span>
  );
};
