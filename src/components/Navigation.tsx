import { Button } from '@/components/ui/button';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';

const Navigation = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false);

 const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
   return;
  }

  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
   window.history.pushState(null, '', `#${sectionId}`);
   element.scrollIntoView({ behavior: 'smooth' });
  }
  setIsMenuOpen(false);
 };

 return (
 <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E9E9E7]">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-16">
 {/* Logo */}
 <a
 href="#home"
 onClick={(e) => handleNavClick(e, 'home')}
 className="text-lg font-semibold text-[#37352F] font-japanese tracking-tight"
 >
 Koji · こうじ
 </a>

 {/* Desktop Navigation */}
 <div className="hidden md:flex items-center space-x-6">
 <a
 href="#home"
 onClick={(e) => handleNavClick(e, 'home')}
 className="text-sm text-[#787774] hover:text-[#37352F] transition-colors"
 >
 Home
 </a>
 <a
 href="#about"
 onClick={(e) => handleNavClick(e, 'about')}
 className="text-sm text-[#787774] hover:text-[#37352F] transition-colors"
 >
 About
 </a>

 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <button
 type="button"
 className="text-sm text-[#787774] hover:text-[#37352F] transition-colors"
 >
 Projects
 </button>
 </DropdownMenuTrigger>
 <DropdownMenuContent className="bg-white border border-[#E9E9E7] shadow-notion-card rounded-[8px]">
 <DropdownMenuItem
 onClick={() => {
 const el = document.getElementById('work');
 if (el) el.scrollIntoView({ behavior: 'smooth' });
 setIsMenuOpen(false);
 }}
 className="cursor-pointer text-sm text-[#37352F] hover:bg-[#F7F6F3]"
 >
 Work
 </DropdownMenuItem>
 <DropdownMenuItem
 onClick={() => {
 const el = document.getElementById('personal');
 if (el) el.scrollIntoView({ behavior: 'smooth' });
 setIsMenuOpen(false);
 }}
 className="cursor-pointer text-sm text-[#37352F] hover:bg-[#F7F6F3]"
 >
 Personal Projects
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>

 <a
 href="https://baxin.pages.dev/"
 target="_blank"
 rel="noopener noreferrer"
 className="text-sm text-[#787774] hover:text-[#37352F] transition-colors"
 >
 Blog
 </a>

 <a
 href="#contact"
 onClick={(e) => handleNavClick(e, 'contact')}
 className="bg-[#7766E4] text-white rounded-[8px] px-[18px] py-[9px] text-sm font-medium hover:bg-[#6655D8] transition-colors"
 >
 Get In Touch
 </a>
 </div>

 {/* Mobile Menu Button */}
 <div className="md:hidden">
 <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
 {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
 </Button>
 </div>
 </div>

 {/* Mobile Navigation */}
 {isMenuOpen && (
 <div className="md:hidden border-t border-[#E9E9E7]">
 <div className="py-3 space-y-1">
 <a
 href="#home"
 onClick={(e) => handleNavClick(e, 'home')}
 className="block px-4 py-2.5 text-sm text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] rounded-[8px]"
 >
 Home
 </a>
 <a
 href="#about"
 onClick={(e) => handleNavClick(e, 'about')}
 className="block px-4 py-2.5 text-sm text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] rounded-[8px]"
 >
 About
 </a>
 <a
 href="#work"
 onClick={(e) => handleNavClick(e, 'work')}
 className="block px-4 py-2.5 text-sm text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] rounded-[8px]"
 >
 Work
 </a>
 <a
 href="#personal"
 onClick={(e) => handleNavClick(e, 'personal')}
 className="block px-4 py-2.5 text-sm text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] rounded-[8px]"
 >
 Personal Projects
 </a>
 <a
 href="https://baxin.pages.dev/"
 target="_blank"
 rel="noopener noreferrer"
 className="block px-4 py-2.5 text-sm text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] rounded-[8px]"
 >
 Blog
 </a>
 <a
 href="#contact"
 onClick={(e) => handleNavClick(e, 'contact')}
 className="block px-4 py-2.5 text-sm text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] rounded-[8px]"
 >
 Contact
 </a>
 </div>
 </div>
 )}
 </div>
 </nav>
 );
};

export default Navigation;
