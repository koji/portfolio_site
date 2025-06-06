import { Card, CardContent } from '@/components/ui/card';
import { frontendTechStack, otherTechStack } from '@/data/techStackData';
import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            About <span className="text-gradient font-japanese">私について</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Developer, creator, and lifelong learner passionate about building meaningful digital
            experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Content */}
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-primary">Developer Journey</h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  My passion for development started with curiosity about how things work behind the
                  scenes. I specialize in modern web technologies, creating applications that are
                  both functional and beautiful.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  I believe in writing clean, maintainable code and contributing to open-source
                  projects that make a difference in the developer community.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-primary font-japanese">
                  Philosophy 哲学
                </h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Inspired by Japanese design principles of simplicity and attention to detail, I
                  focus on creating experiences that are intuitive and meaningful.
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="font-japanese">間 (Ma) - Space</span>
                  <span>•</span>
                  <span className="font-japanese">侘寂 (Wabi-sabi) - Beauty in imperfection</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills & Technologies */}
          <div
            className="space-y-6 animate-fade-in"
            style={{
              animationDelay: '0.3s',
            }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-primary">Tech Stack</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      {frontendTechStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Backend & Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {otherTechStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Touch */}
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
