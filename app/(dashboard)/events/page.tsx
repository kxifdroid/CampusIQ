'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import ChatPanel from '@/components/chat/ChatPanel';

interface Event {
  id: number; name: string; date: string; time: string;
  venue: string; club: string; category: string; description: string;
}

const CATEGORIES = ['all', 'tech', 'cultural', 'sports', 'workshop', 'seminar'];
const categoryColors: Record<string, string> = {
  tech: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  cultural: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  sports: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  workshop: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  seminar: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const url = category === 'all'
          ? '/api/proxy/events/events'
          : `/api/proxy/events/events?category=${category}`;
        const res = await fetch(url);
        if (res.ok) setEvents(await res.json());
      } catch { /* ignore */ }
      setLoading(false);
    }
    fetchEvents();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
          <CalendarDays size={20} className="text-pink-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Campus Events</h1>
          <p className="text-xs text-white/40">Workshops, fests, sports & more</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${
              category === cat
                ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                : 'bg-white/[0.04] text-white/50 border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-6 space-y-6 lg:space-y-0">
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            [{},{},{},{}].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)
          ) : events.length > 0 ? events.map(event => (
            <div key={event.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-sm leading-snug">{event.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 capitalize ${categoryColors[event.category]}`}>
                  {event.category}
                </span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-3">{event.description}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '📅', label: event.date },
                  { icon: '⏰', label: event.time },
                  { icon: '📍', label: event.venue.split('—')[0].trim() },
                ].map((meta, i) => (
                  <div key={i} className="bg-white/[0.03] rounded-lg px-2.5 py-1.5">
                    <p className="text-[10px] text-white/30 mb-0.5">{meta.icon}</p>
                    <p className="text-[11px] text-white/70 font-medium leading-tight">{meta.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/30 mt-2">Organized by {event.club}</p>
            </div>
          )) : (
            <div className="text-center py-12 text-white/30">No events found for category "{category}"</div>
          )}
        </div>
        <div>
          <ChatPanel compact />
        </div>
      </div>
    </div>
  );
}
