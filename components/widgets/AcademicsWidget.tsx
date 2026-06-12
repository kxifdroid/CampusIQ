'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, AlertCircle } from 'lucide-react';

interface Deadline {
  title: string;
  course: string;
  dueDate: string;
  type: string;
  marks: number;
}

interface Notice {
  id: number;
  title: string;
  date: string;
  important: boolean;
}

export default function AcademicsWidget() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [deadRes, notRes] = await Promise.all([
          fetch(`/api/proxy/academics/deadlines`),
          fetch(`/api/proxy/academics/notices`),
        ]);
        if (deadRes.ok) setDeadlines((await deadRes.json()).slice(0, 2));
        if (notRes.ok) setNotices((await notRes.json()).filter((n: Notice) => n.important).slice(0, 2));
      } catch (e) {
        console.error('Academics widget error:', e);
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
          {[1,2,3].map(i => <div key={i} className="skeleton h-10 w-full" />)}
        </div>
      </div>
    );
  }

  const getDaysUntil = (dateStr: string) => {
    const due = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `${diff}d left`;
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <GraduationCap size={15} className="text-amber-400" />
          </div>
          <h3 className="font-semibold text-sm">Academics</h3>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <p className="text-[10px] text-white/40 uppercase tracking-wider">Upcoming Deadlines</p>
        {deadlines.map((d, i) => (
          <div key={i} className="flex items-start justify-between gap-2 py-1.5 border-b border-white/[0.04] last:border-0">
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/90 line-clamp-1">{d.title}</p>
              <p className="text-[10px] text-white/40">{d.course} · {d.marks} marks</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
              getDaysUntil(d.dueDate) === 'Today' || getDaysUntil(d.dueDate) === 'Tomorrow'
                ? 'bg-red-500/15 text-red-400'
                : 'bg-amber-500/10 text-amber-400'
            }`}>
              {getDaysUntil(d.dueDate)}
            </span>
          </div>
        ))}
      </div>

      {notices.length > 0 && (
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Important Notices</p>
          {notices.slice(0, 1).map(n => (
            <div key={n.id} className="flex items-center gap-2 py-1.5">
              <AlertCircle size={12} className="text-red-400 flex-shrink-0" />
              <p className="text-[11px] text-white/70 line-clamp-2">{n.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
