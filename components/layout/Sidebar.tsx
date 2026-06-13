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
      className={`flex flex-col h-full bg-white border-r border-[#E4E2F0] ${
        mobile ? 'w-full' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#E4E2F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#7C6FF7] flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <span className="text-base font-bold gradient-text">CampusIQ</span>
        </div>
        {mobile && onClose && (
          <button onClick={onClose} className="text-[#6B6B8A] hover:text-[#7C6FF7] transition-colors">
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
      <div className="px-5 py-4 border-t border-[#E4E2F0]">
        <p className="text-[11px] text-[#6B6B8A]">IIT Roorkee Campus Intelligence</p>
        <p className="text-[11px] text-[#6B6B8A]/70 mt-0.5">Powered by Google Gemini + MCP</p>
      </div>
    </aside>
  );
}
