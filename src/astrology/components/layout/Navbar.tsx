import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, X, Sparkles, BookOpen, Crown } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/astrology/birth-chart', label: 'Birth Chart' },
  { to: '/astrology/yoga-lab', label: 'Yoga Lab' },
  { to: '/astrology/divisional-charts', label: 'Divisional Charts' },
  { to: '/astrology/remedies', label: 'Remedies', icon: Sparkles },
  { to: '/astrology/stotras', label: 'Stotras', icon: BookOpen },
  { to: '/astrology/astrologer', label: 'AI Astrologer' },
  { to: '/astrology/nadi', label: 'Nadi Shastra' },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/astrology" className="flex items-center gap-2 font-serif text-xl font-bold">
            <Crown className="w-6 h-6 text-cyan-400" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
              KarmAnk
            </span>
            <span className="text-white/40 text-sm font-normal ml-1">Jyotish</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${
                  isActive(to)
                    ? 'text-cyan-300 bg-white/10'
                    : 'text-white/60 hover:text-cyan-300 hover:bg-white/5'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white/60 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    isActive(to)
                      ? 'text-cyan-300 bg-white/10'
                      : 'text-white/60 hover:text-cyan-300 hover:bg-white/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
