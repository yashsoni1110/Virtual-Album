import { useState } from 'react';
import { Image, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ setView, currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e, target) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close menu on click
    
    if (target === 'home') {
      setView('home');
    } else if (target === 'galleries') {
      setView('galleries');
    } else if (target === 'contact') {
      setView('contact');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = ['Home', 'Galleries', 'Contact'];

  return (
    <header className="glass-nav fixed top-0 w-full z-40">
      <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-[1920px] mx-auto">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={(e) => handleNavClick(e, 'home')}
        >
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Image className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Web <span className="text-gray-400">Album</span></span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const id = item.toLowerCase();
            const isActive = currentView === id;
            return (
              <a 
                key={item}
                href={`#${id}`} 
                className={`text-sm font-bold transition-all duration-300 relative py-1 ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={(e) => handleNavClick(e, id)}
              >
                {item}
                {isActive && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navItems.map((item) => {
                const id = item.toLowerCase();
                const isActive = currentView === id;
                return (
                  <a 
                    key={item}
                    href={`#${id}`} 
                    className={`text-lg font-bold py-2 px-4 rounded-xl transition-all ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    onClick={(e) => handleNavClick(e, id)}
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
