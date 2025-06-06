import { Button } from '@/components/ui/button';
import React from 'react';
const Hero = () => {
  const scrollToProjects = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      <div className="absolute top-20 right-10 w-32 h-32 bg-vermilion-200/30 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 left-10 w-48 h-48 bg-sakura-200/30 rounded-full blur-3xl animate-float"
        style={{
          animationDelay: '1s',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-[16px]">
        {/* Japanese Greeting */}
        <div className="mb-8 animate-fade-in">
          <p className="text-lg sm:text-xl text-muted-foreground font-japanese mb-2">こんにちは</p>
          <p className="text-sm sm:text-base text-muted-foreground">Welcome to my digital space</p>
        </div>

        {/* Main Heading */}
        <h1
          className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 animate-fade-in"
          style={{
            animationDelay: '0.2s',
          }}
        >
          I'm <span className="text-gradient font-japanese japanese-shadow">Koji</span>
        </h1>

        {/* Subtitle */}
        <div
          className="mb-8 animate-fade-in"
          style={{
            animationDelay: '0.4s',
          }}
        >
          <p className="text-xl sm:text-2xl lg:text-3xl text-foreground/80 mb-4">
            Developer & Creator
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Building digital experiences with modern web technologies, open-source contributions,
            and a passion for clean, accessible design.
          </p>
        </div>

        {/* Japanese Character Art */}
        <div
          className="mb-12 animate-fade-in"
          style={{
            animationDelay: '0.6s',
          }}
        >
          <div className="text-6xl sm:text-8xl lg:text-9xl font-japanese text-primary/20 select-none">
            創造
          </div>
          <p className="text-sm text-muted-foreground font-japanese mt-2">(sōzō - creation)</p>
        </div>

        {/* Scroll Indicator */}
        <div
          className="mb-12 animate-fade-in"
          style={{
            animationDelay: '0.7s',
          }}
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center py-0 mx-auto animate-bounce">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
          <p className="text-muted-foreground mt-2 font-japanese text-xs font-normal text-center">
            スクロール
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
          style={{
            animationDelay: '0.8s',
          }}
        >
          <Button
            onClick={scrollToProjects}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            View My Work
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const element = document.getElementById('contact');
              if (element)
                element.scrollIntoView({
                  behavior: 'smooth',
                });
            }}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Get In Touch
          </Button>
        </div>
      </div>
    </section>
  );
};
export default Hero;
