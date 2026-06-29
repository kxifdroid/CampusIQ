'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import ChatPanel from '@/components/chat/ChatPanel';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

interface Event {
  id: number; name: string; date: string; time: string;
  venue: string; club: string; category: string; description: string;
}

const CATEGORIES = ['all', 'tech', 'cultural', 'sports', 'workshop', 'seminar'];
const categoryColors: Record<string, string> = {
  tech: 'bg-[#E8E6FF] text-[#7C6FF7] border-[#E4E2F0]',
  cultural: 'bg-[#F28B82]/15 text-[#F28B82] border-[#F28B82]/20',
  sports: 'bg-[#6BCB8B]/15 text-[#6BCB8B] border-[#6BCB8B]/20',
  workshop: 'bg-[#E8E6FF] text-[#7C6FF7] border-[#E4E2F0]',
  seminar: 'bg-[#F5C97A]/15 text-[#F5C97A] border-[#F5C97A]/20',
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

  const categoriesList = CATEGORIES.map(cat => ({
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: cat
  }));
  const filterFields = { text: 'label', value: 'value' };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E8E6FF] flex items-center justify-center">
          <CalendarDays size={20} className="text-[#7C6FF7]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A2E]">Campus Events</h1>
          <p className="text-xs text-slate-500 dark:text-[#6B6B8A]">Workshops, fests, sports & more</p>
        </div>
      </div>

      {/* Filters (Dropdown on Mobile, Buttons on Desktop) */}
      <div className="sm:hidden w-full">
        <DropDownListComponent
          dataSource={categoriesList}
          fields={filterFields}
          value={category}
          change={e => setCategory(e.value as string)}
          placeholder="Filter by Category"
          cssClass="e-outline w-full bg-white dark:bg-[#16161E] text-slate-800 dark:text-white"
        />
      </div>
      <div className="hidden sm:flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <ButtonComponent
            key={cat}
            onClick={() => setCategory(cat)}
            cssClass={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${
              category === cat
                ? 'e-primary bg-[#7C6FF7] text-white border-[#7C6FF7]'
                : 'e-outline bg-white dark:bg-[#16161E] text-slate-600 dark:text-[#6B6B8A] border-[#E4E2F0] dark:border-white/[0.08]'
            }`}
          >
            {cat}
          </ButtonComponent>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-6 space-y-6 lg:space-y-0">
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)
          ) : events.length > 0 ? events.map(event => (
            <div key={event.id} className="glass-card p-4 bg-white dark:bg-[#16161E]">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-sm leading-snug text-slate-800 dark:text-white">{event.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 capitalize ${categoryColors[event.category]}`}>
                  {event.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#6B6B8A] leading-relaxed mb-3">{event.description}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '📅', label: event.date },
                  { icon: '⏰', label: event.time },
                  { icon: '📍', label: event.venue.split('—')[0].trim() },
                ].map((meta, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-[#F9F8FF] border border-[#E4E2F0] dark:border-white/[0.08] rounded-lg px-2.5 py-1.5">
                    <p className="text-[10px] text-slate-400 dark:text-[#6B6B8A]/70 mb-0.5">{meta.icon}</p>
                    <p className="text-[11px] text-slate-800 dark:text-white font-medium leading-tight">{meta.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-[#6B6B8A]/70 mt-2">Organized by {event.club}</p>
            </div>
          )) : (
            <div className="text-center py-12 text-slate-400 dark:text-[#6B6B8A]">No events found for category &quot;{category}&quot;</div>
          )}
        </div>
        <div>
          <ChatPanel compact />
        </div>
      </div>
    </div>
  );
}
