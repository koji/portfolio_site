import React from 'react';
import { TechCategory, ProjectStatus, TECH_MAP, STATUS_MAP } from '../types/hero';

// 技術タグバッジ
export const TechBadge: React.FC<{ category: TechCategory }> = ({ category }) => {
  const tech = TECH_MAP[category];
  if (!tech) return null;
  return (
    <span className={`px-2 py-0.5 text-xs rounded-[4px] ${tech.style}`}>
      {tech.label}
    </span>
  );
};

// ステータスバッジ
export const StatusBadge: React.FC<{ status: ProjectStatus; label: string }> = ({
  status,
  label,
}) => {
  const config = STATUS_MAP[status];
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-[4px] whitespace-nowrap ${config.style}`}
    >
      {label}
    </span>
  );
};
