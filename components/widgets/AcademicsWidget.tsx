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
          <div className="w-8 h-8 rounded-lg bg-[#E8E6FF] flex items-center justify-center">
            <GraduationCap size={15} className="text-[#7C6FF7]" />
          </div>
          <h3 className="text-sm font-medium text-[#1A1A2E]">Academics</h3>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <p className="text-[10px] text-[#6B6B8A] uppercase tracking-wider">Upcoming Deadlines</p>
        {deadlines.map((d, i) => (
          <div key={i} className="flex items-start justify-between gap-2 py-1.5 border-b border-[#E4E2F0] last:border-0">
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#1A1A2E] line-clamp-1">{d.title}</p>
              <p className="text-[10px] text-[#6B6B8A]">{d.course} · {d.marks} marks</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
              getDaysUntil(d.dueDate) === 'Today' || getDaysUntil(d.dueDate) === 'Tomorrow'
                ? 'bg-[#F28B82]/15 text-[#F28B82]'
                : 'bg-[#F5C97A]/15 text-[#F5C97A]'
            }`}>
              {getDaysUntil(d.dueDate)}
            </span>
          </div>
        ))}
      </div>

      {notices.length > 0 && (
        <div>
          <p className="text-[10px] text-[#6B6B8A] uppercase tracking-wider mb-2">Important Notices</p>
          {notices.slice(0, 1).map(n => (
            <div key={n.id} className="flex items-center gap-2 py-1.5">
              <AlertCircle size={12} className="text-[#F28B82] flex-shrink-0" />
              <p className="text-[11px] text-[#1A1A2E] line-clamp-2">{n.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
