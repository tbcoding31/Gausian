import React, { useEffect, useState } from 'react';
import { Home, Palmtree, MapPin } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'why-tanjung-lesung', label: 'Why Tanjung Lesung', icon: Palmtree },
  { id: 'direction-maps', label: 'Direction Maps', icon: MapPin },
];

export const LandingNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <aside className="fixed z-40 top-8 left-8">
      <nav
        aria-label="Section Navigation"
        className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-black/[0.04] p-1.5 flex flex-col gap-0.5 w-[146px] select-none"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? 'bg-[#F2F3F5] text-[#111318] font-semibold'
                  : 'text-[#8A909A] hover:text-[#111318] hover:bg-black/[0.02]'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  isActive ? 'text-[#111318]' : 'text-[#9CA3AF]'
                }`}
              />
              <span className="truncate leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
