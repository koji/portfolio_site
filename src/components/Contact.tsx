
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Let's{' '}
            <span className="text-gradient font-japanese">
              Connect 連絡
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you have a project in mind, want to collaborate, or just say hello - I'd love to hear from you.
          </p>
        </div>

        {/* Contact Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-vermilion-500 to-sakura-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl font-japanese text-white">
                こ
              </span>
            </div>
            <CardTitle className="text-2xl lg:text-3xl">
              Ready to Start Something Amazing?
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Email Section */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-primary">
                Get In Touch
              </h3>
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-muted-foreground mb-4">
                  Drop me a line and let's discuss your next project
                </p>
                <a
                  href="mailto:baxin1919@gmail.com"
                  className="text-2xl font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  baxin1919(at-mark)gmail.com
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-20 flex-col gap-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => window.open('https://baxin.pages.dev/', '_blank')}
              >
                <span className="text-lg">📖</span>
                <span>Read My Blog</span>
              </Button>

              <Button
                size="lg"
                className="h-20 flex-col gap-2 bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = 'mailto:baxin1919@gmail.com?subject=Hello%20Koji!'}
              >
                <span className="text-lg">✉️</span>
                <span>Send Email</span>
              </Button>
            </div>

            {/* Japanese Closing */}
            <div className="text-center pt-8 border-t border-border/50">
              <p className="text-lg font-japanese text-primary mb-2">
                ありがとうございます
              </p>
              <p className="text-sm text-muted-foreground">
                Thank you for visiting my portfolio
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ and lots of ☕
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-japanese">
            © 2024 Koji • こうじ
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
