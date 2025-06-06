import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { personalProjects } from '@/data/personalPrjData';
import React from 'react';

const statusColors = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  planned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
};

const categoryIcons = {
  web: '🌐',
  mobile: '📱',
  cli: '⌨️',
  library: '📚',
};

const PersonalProjects = () => {
  return (
    <section id="personal" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Personal <span className="text-gradient font-japanese">Projects プロジェクト</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Open-source projects and personal experiments exploring new technologies and ideas
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {personalProjects.map((project, index) => (
            <Card
              key={project.id}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group animate-fade-in hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryIcons[project.category]}</span>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge
                    className={`w-28 flex items-center justify-center text-xs px-2 py-1 ${
                      statusColors[project.status]
                    } border-0`}
                  >
                    {project.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {project.description}
                </CardDescription>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex-1"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      GitHub
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button
                      size="sm"
                      className="text-xs flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => window.open(project.liveUrl, '_blank')}
                    >
                      Live Demo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Japanese Quote */}
        <div className="text-center bg-gradient-to-r from-vermilion-50 to-sakura-50 dark:from-vermilion-950/10 dark:to-sakura-950/10 rounded-lg p-8">
          <blockquote className="text-xl font-japanese text-primary mb-4">
            千里の道も一歩から
          </blockquote>
          <p className="text-sm text-muted-foreground">
            "A journey of a thousand miles begins with a single step"
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Every project starts with curiosity and a willingness to learn
          </p>
        </div>
      </div>
    </section>
  );
};

export default PersonalProjects;
