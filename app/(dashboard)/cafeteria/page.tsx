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
        <div className="w-10 h-10 rounded-xl bg-[#E8E6FF] flex items-center justify-center">
          <UtensilsCrossed size={20} className="text-[#7C6FF7]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A2E]">Cafeteria</h1>
          <p className="text-xs text-[#6B6B8A]">Campus Dining — Weekly Menu</p>
        </div>
      </div>

      {/* Meal timings */}
      {timings?.meals && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(timings.meals).map(([meal, time]) => (
            <div key={meal} className="glass-card p-3 text-center">
              <p className="text-[10px] text-[#6B6B8A] capitalize mb-1">{meal}</p>
              <p className="text-xs font-semibold text-[#1A1A2E]">{time}</p>
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
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDay === day
                    ? 'bg-[#7C6FF7] text-white'
                    : 'bg-white border border-[#E4E2F0] text-[#6B6B8A] hover:bg-[#F0EEFF] hover:text-[#7C6FF7]'
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
                    <h3 className="font-semibold text-sm capitalize mb-3 text-[#7C6FF7]">{meal}</h3>
                    <div className="space-y-2">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#E4E2F0] last:border-0">
                          <div className="flex items-center gap-2.5">
                            <span className={item.veg ? 'badge-veg' : 'badge-nonveg'} />
                            <span className="text-sm text-[#1A1A2E] font-medium">{item.item}</span>
                            <span className="text-[11px] text-[#6B6B8A]">{item.calories} kcal</span>
                          </div>
                          <span className="text-sm font-semibold text-[#6BCB8B]">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[#6B6B8A] text-sm">Menu not available for {DAY_LABELS[selectedDay]}</p>
          )}
        </div>

        <div className="space-y-4">
          {/* Specials */}
          {specials.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold text-sm mb-3 text-[#7C6FF7]">⭐ Weekly Specials</h3>
              <div className="space-y-3">
                {specials.map((s, i) => (
                  <div key={i} className="py-2 border-b border-[#E4E2F0] last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={s.veg ? 'badge-veg' : 'badge-nonveg'} />
                      <p className="text-xs font-medium text-[#1A1A2E]">{s.name}</p>
                      {s.price && <span className="ml-auto text-xs text-[#6BCB8B]">₹{s.price}</span>}
                    </div>
                    <p className="text-[11px] text-[#6B6B8A] leading-snug">{s.description}</p>
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
