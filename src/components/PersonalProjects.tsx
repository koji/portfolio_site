import { personalProjects } from '@/data/personalPrjData';
import React from 'react';

const CARD_TINTS = [
  '#FEF0E4', // peach
  '#FDEEF0', // rose
  '#EDFAF4', // mint
  '#F1EFFE', // lavender
  '#EAF4FE', // sky
  '#FFFCE5', // yellow
  '#FFFDF8', // cream
  '#F5F5F4', // gray
  '#FEF0E4', // peach again
];

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: '#EDFAF4', text: '#2D7D52', label: 'Completed' },
  'in-progress': { bg: '#FEF0E4', text: '#C25A1C', label: 'In Progress' },
  planned: { bg: '#F1EFFE', text: '#5B46D9', label: 'Planned' },
};

const categoryIcons: Record<string, string> = {
  web: '🌐',
  mobile: '📱',
  cli: '⌨️',
  library: '📚',
};

const PersonalProjects = () => {
  const reversedProjects = [...personalProjects].reverse();

  return (
    <section id="personal" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-[48px] font-semibold text-[#37352F] tracking-[-0.5px] leading-[1.15] mb-4">
            Personal Projects <span className="font-japanese">· プロジェクト</span>
          </h2>
          <p className="text-[16px] text-[#787774] leading-[1.55] max-w-2xl">
            Open-source projects and personal experiments exploring new technologies and ideas
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {reversedProjects.map((project, index) => {
            const tintBg = CARD_TINTS[index % CARD_TINTS.length];
            const status = statusStyles[project.status];

            return (
              <div
                key={project.id}
                className="rounded-[12px] border border-[#E9E9E7] p-6 flex flex-col"
                style={{ backgroundColor: tintBg }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{categoryIcons[project.category]}</span>
                    <h3 className="text-[16px] font-semibold text-[#37352F] leading-[1.3]">
                      {project.title}
                    </h3>
                  </div>
                  <span
                    className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-[6px] whitespace-nowrap"
                    style={{ backgroundColor: status.bg, color: status.text }}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#45413C] leading-[1.55] mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs text-[#787774] bg-white border border-[#E9E9E7] rounded-[4px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <button
                      type="button"
                      className="flex-1 py-1.5 text-xs font-medium text-[#37352F] bg-white border border-[#E9E9E7] rounded-[8px] hover:bg-[#F7F6F3] transition-colors"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      GitHub
                    </button>
                  )}
                  {project.liveUrl && (
                    <button
                      type="button"
                      className="flex-1 py-1.5 text-xs font-medium text-white bg-[#7766E4] rounded-[8px] hover:bg-[#6655D8] transition-colors"
                      onClick={() => window.open(project.liveUrl, '_blank')}
                    >
                      Live Demo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Japanese Quote */}
        <div className="text-center bg-[#F7F6F3] rounded-[12px] border border-[#E9E9E7] p-10">
          <blockquote className="text-[20px] font-japanese text-[#37352F] mb-3">
            千里の道も一歩から
          </blockquote>
          <p className="text-sm text-[#787774]">
            "A journey of a thousand miles begins with a single step"
          </p>
          <p className="text-xs text-[#9B9A97] mt-2">
            Every project starts with curiosity and a willingness to learn
          </p>
        </div>
      </div>
    </section>
  );
};

export default PersonalProjects;
