import React from 'react';
import { PROJECTS, FEATURED_SKILLS } from '../types/hero';
import { TechBadge, StatusBadge } from './TechBadge';

export const WorkspaceMockup: React.FC = () => (
  <div className="bg-white rounded-[12px] border border-[#E9E9E7] shadow-notion-mockup overflow-hidden text-left">
    {/* Header */}
    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E9E9E7]">
      <span className="text-base" role="img" aria-label="clipboard">
        📋
      </span>
      <span className="text-sm font-semibold text-[#37352F]">
        Project Dashboard
      </span>
    </div>

    {/* Table / Grid Content */}
    <div role="table" aria-label="Project list">
      {/* Table Header */}
      <div
        role="rowgroup"
        className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 bg-[#F7F6F3] border-b border-[#E9E9E7]"
      >
        <div role="columnheader" className="text-xs font-medium text-[#9B9A97] uppercase tracking-wide">
          Project
        </div>
        <div role="columnheader" className="text-xs font-medium text-[#9B9A97] uppercase tracking-wide">
          Status
        </div>
        <div role="columnheader" className="text-xs font-medium text-[#9B9A97] uppercase tracking-wide hidden sm:block">
          Stack
        </div>
      </div>

      {/* Table Body Rows */}
      <div role="rowgroup" className="divide-y divide-[#E9E9E7]">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            role="row"
            className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3"
          >
            {/* Column 1: Title */}
            <div role="cell" className="text-sm text-[#37352F] font-medium">
              {project.name}
            </div>

            {/* Column 2: Status */}
            <div role="cell">
              <StatusBadge status={project.status} label={project.statusLabel} />
            </div>

            {/* Column 3: Stack Badges */}
            <div role="cell" className="hidden sm:flex gap-1.5 flex-wrap">
              {project.stack.map((techKey) => (
                <TechBadge key={techKey} category={techKey} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Footer row */}
    <div className="px-5 py-3 border-t border-[#E9E9E7] flex flex-wrap gap-2">
      {FEATURED_SKILLS.map((tech) => (
        <span
          key={tech}
          className="px-2 py-0.5 text-xs text-[#787774] border border-[#E9E9E7] rounded-[4px] bg-white"
        >
          {tech}
        </span>
      ))}
    </div>
  </div>
);
