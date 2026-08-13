import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Mic2, Globe, BarChart2, BookMarked } from 'lucide-react';

const mobileNav = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/practice', label: 'Practice', icon: Mic2 },
  { to: '/aviation-english', label: 'Learn', icon: Globe },
  { to: '/scenarios', label: 'Scenarios', icon: BookMarked },
  { to: '/progress', label: 'Progress', icon: BarChart2 },
];

export default function MobileNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-aerora-bg border-t border-aerora-border">
      <div className="flex items-center justify-around px-2 py-2 safe-b">
        {mobileNav.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg min-w-[56px] transition-colors ${
                isActive ? 'text-aerora-blue' : 'text-aerora-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
