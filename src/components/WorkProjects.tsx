import { ProjectLink } from '@/components/ProjectLink';
import { workProjects } from '@/data/workPrjData';
import React from 'react';

const companyTints: Record<string, { bg: string; text: string }> = {
  Opentrons: { bg: '#FEF0E4', text: '#C25A1C' },
  'Ubiquiti Networks': { bg: '#FDEEF0', text: '#C53B5A' },
};

export const WorkProjects = () => {
  return (
    <section id="work" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F6F3]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-[48px] font-semibold text-[#37352F] tracking-[-0.5px] leading-[1.15] mb-4">
            Work Experience <span className="font-japanese">· 仕事</span>
          </h2>
          <p className="text-[16px] text-[#787774] leading-[1.55] max-w-2xl">
            Enterprise projects and professional experience building scalable applications
          </p>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          {workProjects.map((project) => {
            const tint = companyTints[project.company] ?? {
              bg: '#F5F5F4',
              text: '#787774',
            };
            return (
              <div
                key={project.id}
                className="bg-white rounded-[12px] border border-[#E9E9E7] shadow-notion-card p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-[22px] font-semibold text-[#37352F] leading-[1.3] mb-2">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2.5 py-1 text-xs font-medium rounded-[6px]"
                        style={{ backgroundColor: tint.bg, color: tint.text }}
                      >
                        {project.company}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-medium bg-[#F5F5F4] text-[#9B9A97] rounded-[6px]">
                        {project.period}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:max-w-[360px]">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs text-[#45413C] bg-[#F7F6F3] border border-[#E9E9E7] rounded-[6px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[15px] text-[#45413C] leading-[1.6] mb-5">
                  {project.description}
                </p>

                <div className="mb-5">
                  <h4 className="text-[13px] font-semibold text-[#787774] uppercase tracking-wide mb-3">
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight, idx) => (
                      <li
                        key={`${project.id}-highlight-${idx}`}
                        className="flex items-start gap-3 text-sm text-[#45413C] leading-[1.55]"
                      >
                        <span className="text-[#7766E4] mt-0.5 flex-shrink-0">—</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.link && <ProjectLink link={project.link} />}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-[#787774] text-sm mb-4">Interested in working together?</p>
          <button
            type="button"
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#7766E4] text-white rounded-[8px] px-[24px] py-[11px] text-sm font-medium hover:bg-[#6655D8] transition-colors"
          >
            Let's Connect
          </button>
        </div>
      </div>
    </section>
  );
};
