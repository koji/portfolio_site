import { ProjectLink } from '@/components/ProjectLink';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { workProjects } from '@/data/workPrjData';
import React from 'react';

export const WorkProjects = () => {
  return (
    <section
      id="work"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Professional <span className="text-gradient font-japanese">Work 仕事</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise projects and professional experience building scalable applications
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {workProjects.map((project, index) => (
            <Card
              key={project.id}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl lg:text-2xl mb-2">{project.title}</CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {project.company} • {project.period}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-foreground/80 leading-relaxed">{project.description}</p>

                <div>
                  <h4 className="font-semibold mb-3 text-primary">Key Achievements</h4>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight, idx) => (
                      <li
                        key={`${project.id}-highlight-${idx}`}
                        className="flex items-start gap-3 text-sm text-foreground/80"
                      >
                        <span className="text-primary font-japanese mt-1">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.link && <ProjectLink link={project.link} />}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">Interested in working together?</p>
          <Button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Let's Connect
          </Button>
        </div>
      </div>
    </section>
  );
};
