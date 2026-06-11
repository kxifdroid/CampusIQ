'use client';

import { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import ChatPanel from '@/components/chat/ChatPanel';

interface MenuItem { item: string; veg: boolean; price: number; calories: number; }
type DayMenu = { breakfast: MenuItem[]; lunch: MenuItem[]; snacks: MenuItem[]; dinner: MenuItem[] };
type WeekMenu = Record<string, DayMenu>;

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};
const MEAL_ORDER = ['breakfast', 'lunch', 'snacks', 'dinner'];

export default function CafeteriaPage() {
  const [weekMenu, setWeekMenu] = useState<WeekMenu>({});
  const [specials, setSpecials] = useState<Array<{ name: string; description: string; price: number; veg: boolean }>>([]);
  const [timings, setTimings] = useState<{ meals: Record<string, string> } | null>(null);
  const [selectedDay, setSelectedDay] = useState(() => DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [specialsRes, timingsRes, ...dayResults] = await Promise.all([
          fetch('/api/proxy/cafeteria/specials'),
          fetch('/api/proxy/cafeteria/timings'),
          ...DAYS.map(d => fetch(`/api/proxy/cafeteria/menu/${d}`)),
        ]);
        if (specialsRes.ok) setSpecials(await specialsRes.json());
        if (timingsRes.ok) setTimings(await timingsRes.json());
        const menus: WeekMenu = {};
        for (let i = 0; i < DAYS.length; i++) {
          if (dayResults[i].ok) {
            const data = await dayResults[i].json();
            menus[DAYS[i]] = data.menu;
          }
        }
        setWeekMenu(menus);
      } catch { /* ignore */ }
      setLoading(false);
    }
    init();
  }, []);

  const currentMenu = weekMenu[selectedDay];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/20 flex items-center justify-center">
          <UtensilsCrossed size={20} className="text-[#06B6D4]" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Cafeteria</h1>
          <p className="text-xs text-white/40">Campus Dining — Weekly Menu</p>
        </div>
      </div>

      {/* Meal timings */}
      {timings?.meals && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(timings.meals).map(([meal, time]) => (
            <div key={meal} className="glass-card p-3 text-center">
              <p className="text-[10px] text-white/40 capitalize mb-1">{meal}</p>
              <p className="text-xs font-semibold text-white/80">{time}</p>
            </div>
          ))}
        </div>
      )}

      <div className="lg:grid lg:grid-cols-3 gap-6 space-y-6 lg:space-y-0">
        <div className="lg:col-span-2 space-y-4">
          {/* Day picker */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDay === day
                    ? 'bg-[#06B6D4] text-[#0D0D12]'
                    : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {DAY_LABELS[day].slice(0, 3)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
          ) : currentMenu ? (
            <div className="space-y-4">
              {MEAL_ORDER.map(meal => {
                const items = currentMenu[meal as keyof DayMenu];
                if (!items || items.length === 0) return null;
                return (
                  <div key={meal} className="glass-card p-4">
                    <h3 className="font-semibold text-sm capitalize mb-3 text-[#06B6D4]">{meal}</h3>
                    <div className="space-y-2">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                          <div className="flex items-center gap-2.5">
                            <span className={item.veg ? 'badge-veg' : 'badge-nonveg'} />
                            <span className="text-sm text-white/85">{item.item}</span>
                            <span className="text-[11px] text-white/30">{item.calories} kcal</span>
                          </div>
                          <span className="text-sm font-semibold text-emerald-400">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/40 text-sm">Menu not available for {DAY_LABELS[selectedDay]}</p>
          )}
        </div>

        <div className="space-y-4">
          {/* Specials */}
          {specials.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold text-sm mb-3 text-amber-400">⭐ Weekly Specials</h3>
              <div className="space-y-3">
                {specials.map((s, i) => (
                  <div key={i} className="py-2 border-b border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={s.veg ? 'badge-veg' : 'badge-nonveg'} />
                      <p className="text-xs font-medium">{s.name}</p>
                      {s.price && <span className="ml-auto text-xs text-emerald-400">₹{s.price}</span>}
                    </div>
                    <p className="text-[11px] text-white/40 leading-snug">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <ChatPanel compact />
        </div>
      </div>
    </div>
  );
}
