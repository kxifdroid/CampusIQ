'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  UtensilsCrossed,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Brain,
  X
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/library', label: 'Library', icon: BookOpen },
  { href: '/cafeteria', label: 'Cafeteria', icon: UtensilsCrossed },
  { href: '/events', label: 'Events', icon: CalendarDays },
  { href: '/academics', label: 'Academics', icon: GraduationCap },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col h-full bg-[#16161E] border-r border-white/[0.06] ${
        mobile ? 'w-full' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <span className="text-base font-bold gradient-text">CampusIQ</span>
        </div>
        {mobile && onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <p className="text-[11px] text-white/30">IIT Roorkee Campus Intelligence</p>
        <p className="text-[11px] text-white/20 mt-0.5">Powered by Google Gemini + MCP</p>
      </div>
    </aside>
  );
}
