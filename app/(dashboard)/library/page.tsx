'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Search, Users, Clock } from 'lucide-react';
import ChatPanel from '@/components/chat/ChatPanel';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { GridComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-grids';

interface Book {
  id: number; title: string; author: string; subject: string;
  available: boolean; location: string; dueDate: string | null; isbn: string;
}
interface LibraryStatus {
  name: string; hours: string; availableSeats: number; totalSeats: number;
  availableBooks: number; totalBooks: number; sections: string[];
}

export default function LibraryPage() {
  const [status, setStatus] = useState<LibraryStatus | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = async (q = '') => {
    try {
      const res = await fetch(`/api/proxy/library/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setBooks(await res.json());
    } catch { /* ignore */ }
  };

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/proxy/library/status');
        if (res.ok) setStatus(await res.json());
      } catch { /* ignore */ }
      await fetchBooks();
      setLoading(false);
    }
    init();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(search);
  };

  const availabilityTemplate = (props: Book) => {
    return (
      <span className={`text-xs font-semibold ${props.available ? 'text-emerald-500' : 'text-red-500'}`}>
        {props.available ? '✓ Available' : 'Checked Out'}
      </span>
    );
  };

  const dueDateTemplate = (props: Book) => {
    return (
      <span className="text-xs text-amber-500 font-medium">
        {props.dueDate ? props.dueDate : '—'}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
          <BookOpen size={20} className="text-[#7C3AED]" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Library</h1>
          <p className="text-xs text-slate-500 dark:text-white/40">IIT Roorkee Central Library</p>
        </div>
      </div>

      {status && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Available Seats', value: status.availableSeats, of: status.totalSeats, icon: Users, color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10' },
            { label: 'Available Books', value: status.availableBooks, of: status.totalBooks, icon: BookOpen, color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/10' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4">
              <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                <stat.icon size={14} className={stat.color} />
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-white/40">{stat.label} / {stat.of} total</p>
            </div>
          ))}
          <div className="glass-card p-4 col-span-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={13} className="text-amber-400" />
              <span className="text-[10px] text-slate-500 dark:text-white/50">Hours</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-white/80">{status.hours}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {status.sections.map((s, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-white/[0.05] rounded-full text-slate-500 dark:text-white/50">{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-3 gap-6 space-y-6 lg:space-y-0">
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 z-10 pointer-events-none" />
              <TextBoxComponent
                placeholder="Search books by title, author, or subject..."
                value={search}
                change={e => setSearch(e.value || '')}
                cssClass="e-outline w-full rounded-xl pl-9 bg-white dark:bg-[#16161E] text-slate-800 dark:text-white"
              />
            </div>
            <ButtonComponent type="submit" cssClass="e-primary px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl text-sm font-medium transition-colors text-white">
              Search
            </ButtonComponent>
          </form>

          {loading ? (
            <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : (
            <div className="glass-card overflow-hidden p-1 bg-white dark:bg-[#16161E]">
              <GridComponent dataSource={books} gridLines="None" width="100%" locale="en-US">
                <ColumnsDirective>
                  <ColumnDirective field="title" headerText="Title" width="220" clipMode="EllipsisWithTooltip" />
                  <ColumnDirective field="author" headerText="Author" width="150" />
                  <ColumnDirective field="subject" headerText="Subject" width="120" />
                  <ColumnDirective field="location" headerText="Location" width="120" />
                  <ColumnDirective headerText="Status" width="120" template={availabilityTemplate} />
                  <ColumnDirective headerText="Due Date" width="120" template={dueDateTemplate} />
                </ColumnsDirective>
              </GridComponent>
              {books.length === 0 && (
                <div className="text-center py-12 text-slate-400 dark:text-white/30 text-sm">No books found for &quot;{search}&quot;</div>
              )}
            </div>
          )}
        </div>
        <div>
          <ChatPanel compact />
        </div>
      </div>
    </div>
  );
}
