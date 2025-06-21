
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const ResponsiveHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-sm sm:text-base font-medium text-white/90">
              from the productions of
            </div>
            <div className="text-lg sm:text-xl font-bold text-white">
              The House Of Traders
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => window.location.href = '/auth'}
              className="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Login
            </button>
            <button 
              onClick={() => window.location.href = '/auth'}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => {
                  window.location.href = '/auth';
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200 text-left"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  window.location.href = '/auth';
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg text-left"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ResponsiveHeader;
