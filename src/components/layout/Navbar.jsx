import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Mic2, Globe, BookMarked, BarChart2,
  Search, Menu, X, Plane, Heart
} from 'lucide-react';
import SearchModal from '../shared/SearchModal';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/interview-prep', label: 'Interview Prep', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Mic2 },
  { to: '/aviation-english', label: 'Aviation English', icon: Globe },
  { to: '/scenarios', label: 'Scenarios', icon: BookMarked },
  { to: '/progress', label: 'My Progress', icon: BarChart2 },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-aerora-bg/95 backdrop-blur-md border-b border-aerora-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8.5 h-8.5 bg-aerora-blue rounded-xl flex items-center justify-center shadow-sm group-hover:bg-aerora-ink transition-colors">
                <Plane className="w-4.5 h-4.5 text-white -rotate-45" />
              </div>
              <span className="font-extrabold text-aerora-ink tracking-[0.16em] text-base uppercase font-heading">
                AERORA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative px-3.5 py-2 text-[13px] font-bold transition-colors ${
                      isActive
                        ? 'text-aerora-blue'
                        : 'text-aerora-muted hover:text-aerora-ink'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-aerora-blue"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions with Nishtha Badge */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl text-aerora-muted hover:text-aerora-ink hover:bg-aerora-border/50 transition-colors flex items-center gap-2 text-xs font-semibold"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-aerora-blue" />
                <span className="hidden sm:inline-block text-aerora-muted">Search</span>
              </button>

              {/* Personalized Badge for Nishtha */}
              <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-full shadow-2xs">
                <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span className="text-xs font-extrabold text-amber-900">Nishtha's Prep</span>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-aerora-muted hover:text-aerora-ink hover:bg-aerora-border/50 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-aerora-border overflow-hidden bg-white"
            >
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                        isActive
                          ? 'bg-aerora-blueLight text-aerora-blue'
                          : 'text-aerora-muted hover:text-aerora-ink hover:bg-aerora-bg'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
