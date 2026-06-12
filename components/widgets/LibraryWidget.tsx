'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Users, Clock } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
  location: string;
  dueDate: string | null;
}

interface LibraryStatus {
  hours: string;
  availableSeats: number;
  totalSeats: number;
  availableBooks: number;
  totalBooks: number;
}

export default function LibraryWidget() {
  const [status, setStatus] = useState<LibraryStatus | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statusRes, booksRes] = await Promise.all([
          fetch(`/api/proxy/library/status`),
          fetch(`/api/proxy/library/search?q=`),
        ]);
        if (statusRes.ok) setStatus(await statusRes.json());
        if (booksRes.ok) {
          const allBooks = await booksRes.json();
          setBooks(allBooks.filter((b: Book) => b.available).slice(0, 3));
        }
      } catch (e) {
        console.error('Library widget error:', e);
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

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
            <BookOpen size={15} className="text-[#7C3AED]" />
          </div>
          <h3 className="font-semibold text-sm">Library</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">Open</span>
      </div>

      {status && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/[0.04] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Users size={12} className="text-[#06B6D4]" />
              <span className="text-[10px] text-white/50 uppercase tracking-wide">Seats</span>
            </div>
            <p className="text-lg font-bold text-[#06B6D4]">{status.availableSeats}</p>
            <p className="text-[10px] text-white/40">of {status.totalSeats} free</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={12} className="text-[#7C3AED]" />
              <span className="text-[10px] text-white/50 uppercase tracking-wide">Hours</span>
            </div>
            <p className="text-[11px] font-medium text-white/70 leading-tight">8AM–11PM</p>
            <p className="text-[10px] text-white/40">Mon–Sat</p>
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Available Books</p>
        <div className="space-y-1.5">
          {books.map(book => (
            <div key={book.id} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0">
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/90 truncate">{book.title}</p>
                <p className="text-[10px] text-white/40">{book.author}</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium ml-2 flex-shrink-0">✓ Free</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
