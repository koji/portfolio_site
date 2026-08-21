import { PROJECTS, FEATURED_SKILLS } from '../types/hero';
import { TechBadge, StatusBadge } from './TechBadge';

import type { ReactNode } from 'react';

export const WorkspaceMockup = (): ReactNode => (
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

    {/* Table Content */}
    <table className="w-full border-collapse" aria-label="Project list">
      {/* Table Header */}
      <thead>
        <tr className="bg-[#F7F6F3] border-b border-[#E9E9E7]">
          <th
            scope="col"
            className="px-5 py-2.5 text-left text-xs font-medium text-[#9B9A97] uppercase tracking-wide"
          >
            Project
          </th>
          <th
            scope="col"
            className="px-5 py-2.5 text-left text-xs font-medium text-[#9B9A97] uppercase tracking-wide"
          >
            Status
          </th>
          <th
            scope="col"
            className="px-5 py-2.5 text-left text-xs font-medium text-[#9B9A97] uppercase tracking-wide hidden sm:table-cell"
          >
            Stack
          </th>
        </tr>
      </thead>

      {/* Table Body Rows */}
      <tbody className="divide-y divide-[#E9E9E7]">
        {PROJECTS.map((project) => (
          <tr key={project.id} className="hover:bg-[#FBFBFA] transition-colors">
            {/* Column 1: Title */}
            <td className="px-5 py-3 text-sm text-[#37352F] font-medium align-middle">
              {project.name}
            </td>

            {/* Column 2: Status */}
            <td className="px-5 py-3 align-middle">
              <StatusBadge status={project.status} label={project.statusLabel} />
            </td>

            {/* Column 3: Stack Badges */}
            <td className="px-5 py-3 align-middle hidden sm:table-cell">
              <div className="flex gap-1.5 flex-wrap">
                {project.stack.map((techKey) => (
                  <TechBadge key={techKey} category={techKey} />
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

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

export default WorkspaceMockup;
