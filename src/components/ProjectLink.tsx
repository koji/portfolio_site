import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ProjectLinkProps {
  link: string;
}

export const ProjectLink = ({ link }: ProjectLinkProps) => (
  <div className="pt-2">
    <Button
      variant="outline"
      size="sm"
      className="text-primary hover:text-primary/80 border-primary"
      onClick={() => window.open(link, '_blank')}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      View Project
    </Button>
  </div>
);
