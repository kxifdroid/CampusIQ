'use client';

import { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface MenuItem {
  item: string;
  veg: boolean;
  price: number;
  calories: number;
}

interface DayMenu {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  snacks: MenuItem[];
  dinner: MenuItem[];
}

export default function CafeteriaWidget() {
  const [menu, setMenu] = useState<DayMenu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/proxy/cafeteria/menu`);
        if (res.ok) {
          const data = await res.json();
          setMenu(data.menu);
        }
      } catch (e) {
        console.error('Cafeteria widget error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-5 h-56">
        <div className="skeleton h-5 w-32 mb-4" />
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="skeleton h-4 w-full" />)}
        </div>
      </div>
    );
  }

  const lunchItems = menu?.lunch?.slice(0, 4) || [];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8E6FF] flex items-center justify-center">
            <UtensilsCrossed size={15} className="text-[#7C6FF7]" />
          </div>
          <h3 className="text-sm font-medium text-[#1A1A2E]">Cafeteria</h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8E6FF] text-[#7C6FF7] font-medium">Today's Lunch</span>
      </div>

      {lunchItems.length > 0 ? (
        <div className="space-y-2">
          {lunchItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#E4E2F0] last:border-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className={item.veg ? 'badge-veg' : 'badge-nonveg'} />
                <span className="text-xs font-medium text-[#1A1A2E] truncate">{item.item}</span>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <span className="text-[10px] text-[#6B6B8A]">{item.calories} kcal</span>
                <span className="text-xs text-[#6BCB8B] font-semibold">₹{item.price}</span>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-[#6B6B8A] mt-2">Lunch: 12:00 PM – 2:30 PM</p>
        </div>
      ) : (
        <p className="text-sm text-[#6B6B8A]">Menu not available</p>
      )}
    </div>
  );
}
