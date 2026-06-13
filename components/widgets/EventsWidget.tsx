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
  tech: 'bg-[#E8E6FF] text-[#7C6FF7]',
  cultural: 'bg-[#F28B82]/15 text-[#F28B82]',
  sports: 'bg-[#6BCB8B]/15 text-[#6BCB8B]',
  workshop: 'bg-[#E8E6FF] text-[#7C6FF7]',
  seminar: 'bg-[#F5C97A]/15 text-[#F5C97A]',
};

export default function EventsWidget() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/proxy/events/events`);
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
          <div className="w-8 h-8 rounded-lg bg-[#E8E6FF] flex items-center justify-center">
            <CalendarDays size={15} className="text-[#7C6FF7]" />
          </div>
          <h3 className="text-sm font-medium text-[#1A1A2E]">Events</h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8E6FF] text-[#7C6FF7] font-medium">Upcoming</span>
      </div>
      <div className="space-y-2.5">
        {events.map(event => (
          <div key={event.id} className="py-2 border-b border-[#E4E2F0] last:border-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-[#1A1A2E] leading-snug line-clamp-1">{event.name}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${categoryColors[event.category] || 'bg-[#E8E6FF] text-[#7C6FF7]'}`}>
                {event.category}
              </span>
            </div>
            <p className="text-[10px] text-[#6B6B8A] mt-1">
              📅 {event.date} · ⏰ {event.time} · 📍 {event.venue.split('—')[0].trim()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
