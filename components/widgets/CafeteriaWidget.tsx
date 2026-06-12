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
          <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/20 flex items-center justify-center">
            <UtensilsCrossed size={15} className="text-[#06B6D4]" />
          </div>
          <h3 className="font-semibold text-sm">Cafeteria</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">Today's Lunch</span>
      </div>

      {lunchItems.length > 0 ? (
        <div className="space-y-2">
          {lunchItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className={item.veg ? 'badge-veg' : 'badge-nonveg'} />
                <span className="text-xs font-medium text-white/85 truncate">{item.item}</span>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <span className="text-[10px] text-white/35">{item.calories} kcal</span>
                <span className="text-xs text-emerald-400 font-semibold">₹{item.price}</span>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-white/30 mt-2">Lunch: 12:00 PM – 2:30 PM</p>
        </div>
      ) : (
        <p className="text-sm text-white/40">Menu not available</p>
      )}
    </div>
  );
}
