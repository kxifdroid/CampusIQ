'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  venue: string;
  club: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  tech: 'bg-violet-500/15 text-violet-400',
  cultural: 'bg-pink-500/15 text-pink-400',
  sports: 'bg-emerald-500/15 text-emerald-400',
  workshop: 'bg-cyan-500/15 text-cyan-400',
  seminar: 'bg-amber-500/15 text-amber-400',
};

export default function EventsWidget() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/proxy/events/events`);
        if (res.ok) {
          setEvents((await res.json()).slice(0, 3));
        }
      } catch (e) {
        console.error('Events widget error:', e);
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
          {[1,2,3].map(i => <div key={i} className="skeleton h-12 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <CalendarDays size={15} className="text-pink-400" />
          </div>
          <h3 className="font-semibold text-sm">Events</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-pink-500/10 text-pink-400 font-medium">Upcoming</span>
      </div>
      <div className="space-y-2.5">
        {events.map(event => (
          <div key={event.id} className="py-2 border-b border-white/[0.04] last:border-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-white/90 leading-snug line-clamp-1">{event.name}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${categoryColors[event.category] || 'bg-white/10 text-white/60'}`}>
                {event.category}
              </span>
            </div>
            <p className="text-[10px] text-white/40 mt-1">
              📅 {event.date} · ⏰ {event.time} · 📍 {event.venue.split('—')[0].trim()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
