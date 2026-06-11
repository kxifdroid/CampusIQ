'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, CalendarDays, Clock, AlertCircle, Bell } from 'lucide-react';
import ChatPanel from '@/components/chat/ChatPanel';

interface Deadline { title: string; course: string; dueDate: string; type: string; marks: number; submissionMode: string; }
interface Notice { id: number; title: string; content: string; date: string; department: string; important: boolean; }
interface Holiday { name: string; date: string; type: string; duration?: string; }
interface ClassSlot { time: string; course: string; code: string; room: string; professor: string; }

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function AcademicsPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [schedule, setSchedule] = useState<Record<string, ClassSlot[]>>({});
  const [activeTab, setActiveTab] = useState('deadlines');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [dRes, nRes, hRes, sRes] = await Promise.all([
          fetch('/api/proxy/academics/deadlines'),
          fetch('/api/proxy/academics/notices'),
          fetch('/api/proxy/academics/holidays'),
          fetch('/api/proxy/academics/schedule'),
        ]);
        if (dRes.ok) setDeadlines(await dRes.json());
        if (nRes.ok) setNotices(await nRes.json());
        if (hRes.ok) setHolidays(await hRes.json());
        if (sRes.ok) { const d = await sRes.json(); setSchedule(d.schedule || {}); }
      } catch { /* ignore */ }
      setLoading(false);
    }
    init();
  }, []);

  const getDaysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    if (diff <= 0) return 'Due Today';
    if (diff === 1) return 'Due Tomorrow';
    return `${diff} days left`;
  };

  const tabs = [
    { id: 'deadlines', label: 'Deadlines', icon: Clock },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'holidays', label: 'Holidays', icon: CalendarDays },
    { id: 'notices', label: 'Notices', icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <GraduationCap size={20} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Academics</h1>
          <p className="text-xs text-white/40">Schedule, deadlines, holidays & notices</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === id
                ? 'bg-[#7C3AED] text-white'
                : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-6 space-y-6 lg:space-y-0">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
          ) : (
            <>
              {activeTab === 'deadlines' && (
                <div className="space-y-3">
                  {deadlines.map((d, i) => {
                    const label = getDaysUntil(d.dueDate);
                    const urgent = label.includes('Today') || label.includes('Tomorrow');
                    return (
                      <div key={i} className="glass-card p-4 flex items-center gap-4">
                        <div className={`w-1.5 h-16 rounded-full flex-shrink-0 ${urgent ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{d.title}</p>
                          <p className="text-xs text-white/40 mt-0.5">{d.course} · {d.marks} marks · {d.submissionMode}</p>
                          <p className="text-[11px] text-white/30 mt-1">📅 {d.dueDate}</p>
                        </div>
                        <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${urgent ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  {DAYS.filter(d => schedule[d]?.length > 0).map(day => (
                    <div key={day} className="glass-card p-4">
                      <h3 className="font-semibold text-sm capitalize mb-3 text-[#7C3AED]">{day}</h3>
                      <div className="space-y-2">
                        {schedule[day].map((cls, i) => (
                          <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/[0.04] last:border-0">
                            <span className="text-[11px] font-mono text-[#06B6D4] w-24 flex-shrink-0">{cls.time}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{cls.course}</p>
                              <p className="text-[10px] text-white/40">{cls.code} · {cls.room}</p>
                            </div>
                            <p className="text-[10px] text-white/40 text-right hidden sm:block">{cls.professor.split(' ').slice(0, 2).join(' ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'holidays' && (
                <div className="space-y-2">
                  {holidays.map((h, i) => (
                    <div key={i} className="glass-card p-4 flex items-center gap-4">
                      <span className="text-lg flex-shrink-0">
                        {h.type === 'national' ? '🇮🇳' : h.type === 'festival' ? '🎉' : h.type === 'exam' ? '📝' : '🏖️'}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{h.name}</p>
                        {h.duration && <p className="text-[10px] text-white/40">Duration: {h.duration}</p>}
                      </div>
                      <span className="text-xs text-white/50 flex-shrink-0">{h.date}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notices' && (
                <div className="space-y-3">
                  {notices.map(n => (
                    <div key={n.id} className={`glass-card p-4 border ${n.important ? 'border-red-500/20' : 'border-white/[0.06]'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        {n.important && <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />}
                        <p className="font-semibold text-sm">{n.title}</p>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{n.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-white/30">{n.department}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-[10px] text-white/30">{n.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div>
          <ChatPanel compact />
        </div>
      </div>
    </div>
  );
}
