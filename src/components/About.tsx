import { frontendTechStack, otherTechStack } from '@/data/techStackData';
import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-[48px] font-semibold text-[#37352F] tracking-[-0.5px] leading-[1.15] mb-4">
            About <span className="font-japanese">· 私について</span>
          </h2>
          <p className="text-[16px] text-[#787774] leading-[1.55] max-w-2xl">
            Developer, creator, and lifelong learner passionate about building meaningful digital
            experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <div className="bg-[#EAF4FE] rounded-[12px] border border-[#E9E9E7] p-8">
              <h3 className="text-[22px] font-semibold text-[#37352F] mb-4 leading-[1.3]">
                Developer Journey
              </h3>
              <p className="text-[15px] text-[#45413C] leading-[1.6] mb-4">
                My passion for development started with curiosity about how things work behind the
                scenes. I specialize in modern web technologies, creating applications that are
                both functional and beautiful.
              </p>
              <p className="text-[15px] text-[#45413C] leading-[1.6]">
                I believe in writing clean, maintainable code and contributing to open-source
                projects that make a difference in the developer community.
              </p>
            </div>

            <div className="bg-[#F1EFFE] rounded-[12px] border border-[#E9E9E7] p-8">
              <h3 className="text-[22px] font-semibold text-[#37352F] mb-4 leading-[1.3] font-japanese">
                Philosophy · 哲学
              </h3>
              <p className="text-[15px] text-[#45413C] leading-[1.6] mb-4">
                Inspired by Japanese design principles of simplicity and attention to detail, I
                focus on creating experiences that are intuitive and meaningful.
              </p>
              <div className="flex items-center gap-4 text-sm text-[#787774]">
                <span className="font-japanese">間 (Ma) — Space</span>
                <span>·</span>
                <span className="font-japanese">侘寂 (Wabi-sabi) — Beauty in imperfection</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="bg-[#EDFAF4] rounded-[12px] border border-[#E9E9E7] p-8">
              <h3 className="text-[22px] font-semibold text-[#37352F] mb-6 leading-[1.3]">
                Tech Stack
              </h3>

              <div className="space-y-5">
                <div>
                  <h4 className="text-[13px] font-semibold text-[#787774] uppercase tracking-wide mb-3">
                    Frontend
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {frontendTechStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-white text-[#37352F] border border-[#E9E9E7] rounded-[6px] text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[13px] font-semibold text-[#787774] uppercase tracking-wide mb-3">
                    Backend & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {otherTechStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-white text-[#37352F] border border-[#E9E9E7] rounded-[6px] text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
