import { TrendingUp, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Page } from '@/App';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Learner', page: 'learner' },
  { label: 'Demo', page: 'demo' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
];

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[#0a0e1a]/95 backdrop-blur-md border-b border-[#2d3748]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105"
          >
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Study Stock</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onPageChange(item.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === item.page
                    ? 'text-[#22c55e] bg-[#22c55e]/10'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              className="border-[#2d3748] text-white hover:bg-white/5 hover:border-[#4a5568]"
            >
              Log in
            </Button>
            <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-white">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-[#2d3748]">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onPageChange(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === item.page
                    ? 'text-[#22c55e] bg-[#22c55e]/10'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-[#2d3748] space-y-2">
              <Button
                variant="outline"
                className="w-full border-[#2d3748] text-white hover:bg-white/5"
              >
                Log in
              </Button>
              <Button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white">
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
