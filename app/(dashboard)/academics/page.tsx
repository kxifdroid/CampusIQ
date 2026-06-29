'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, AlertCircle } from 'lucide-react';
import ChatPanel from '@/components/chat/ChatPanel';
import { TabComponent, TabItemsDirective, TabItemDirective } from '@syncfusion/ej2-react-navigations';

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

  const renderDeadlines = () => (
    <div className="p-4 space-y-3">
      {deadlines.map((d, i) => {
        const label = getDaysUntil(d.dueDate);
        const urgent = label.includes('Today') || label.includes('Tomorrow');
        return (
          <div key={i} className="glass-card p-4 flex items-center gap-4 bg-white dark:bg-[#16161E]">
            <div className={`w-1.5 h-16 rounded-full flex-shrink-0 ${urgent ? 'bg-[#F28B82]' : 'bg-[#F5C97A]'}`} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-slate-800 dark:text-white">{d.title}</p>
              <p className="text-xs text-slate-500 dark:text-[#6B6B8A] mt-0.5">{d.course} · {d.marks} marks · {d.submissionMode}</p>
              <p className="text-[11px] text-slate-400 dark:text-[#6B6B8A]/80 mt-1">📅 {d.dueDate}</p>
            </div>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${urgent ? 'bg-[#F28B82]/15 text-[#F28B82]' : 'bg-[#F5C97A]/15 text-[#F5C97A]'}`}>
              {label}
            </span>
          </div>
        );
      })}
      {deadlines.length === 0 && <p className="text-sm text-slate-500 dark:text-white/40 py-6 text-center">No deadlines pending.</p>}
    </div>
  );

  const renderSchedule = () => (
    <div className="p-4 space-y-4">
      {DAYS.filter(d => schedule[d]?.length > 0).map(day => (
        <div key={day} className="glass-card p-4 bg-white dark:bg-[#16161E]">
          <h3 className="font-semibold text-sm capitalize mb-3 text-[#7C6FF7]">{day}</h3>
          <div className="space-y-2">
            {schedule[day].map((cls, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-[#E4E2F0] dark:border-white/[0.08] last:border-0">
                <span className="text-[11px] font-mono text-[#7C6FF7] w-24 flex-shrink-0">{cls.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-white truncate">{cls.course}</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#6B6B8A]">{cls.code} · {cls.room}</p>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-[#6B6B8A] text-right hidden sm:block">{cls.professor.split(' ').slice(0, 2).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {DAYS.filter(d => schedule[d]?.length > 0).length === 0 && <p className="text-sm text-slate-500 dark:text-white/40 py-6 text-center">No classes scheduled.</p>}
    </div>
  );

  const renderHolidays = () => (
    <div className="p-4 space-y-2">
      {holidays.map((h, i) => (
        <div key={i} className="glass-card p-4 flex items-center gap-4 bg-white dark:bg-[#16161E]">
          <span className="text-lg flex-shrink-0">
            {h.type === 'national' ? '🇮🇳' : h.type === 'festival' ? '🎉' : h.type === 'exam' ? '📝' : '🏖️'}
          </span>
          <div className="flex-1">
            <p className="font-medium text-sm text-slate-800 dark:text-white">{h.name}</p>
            {h.duration && <p className="text-[10px] text-slate-500 dark:text-[#6B6B8A]">Duration: {h.duration}</p>}
          </div>
          <span className="text-xs text-slate-500 dark:text-[#6B6B8A] flex-shrink-0">{h.date}</span>
        </div>
      ))}
      {holidays.length === 0 && <p className="text-sm text-slate-500 dark:text-white/40 py-6 text-center">No holidays scheduled.</p>}
    </div>
  );

  const renderNotices = () => (
    <div className="p-4 space-y-3">
      {notices.map(n => (
        <div key={n.id} className={`glass-card p-4 border bg-white dark:bg-[#16161E] ${n.important ? 'border-[#F28B82]/30' : 'border-[#E4E2F0] dark:border-white/[0.08]'}`}>
          <div className="flex items-start gap-2 mb-2">
            {n.important && <AlertCircle size={14} className="text-[#F28B82] flex-shrink-0 mt-0.5" />}
            <p className="font-semibold text-sm text-slate-800 dark:text-white">{n.title}</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#6B6B8A] leading-relaxed">{n.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-slate-400 dark:text-[#6B6B8A]/80">{n.department}</span>
            <span className="text-[#6B6B8A]/40">·</span>
            <span className="text-[10px] text-slate-400 dark:text-[#6B6B8A]/80">{n.date}</span>
          </div>
        </div>
      ))}
      {notices.length === 0 && <p className="text-sm text-slate-500 dark:text-white/40 py-6 text-center">No notices available.</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E8E6FF] flex items-center justify-center">
          <GraduationCap size={20} className="text-[#7C6FF7]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A2E]">Academics</h1>
          <p className="text-xs text-slate-500 dark:text-[#6B6B8A]">Schedule, deadlines, holidays & notices</p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-6 space-y-6 lg:space-y-0">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
          ) : (
            <div className="bg-white dark:bg-[#16161E] rounded-xl border border-[#E4E2F0] dark:border-white/[0.08] overflow-hidden p-1">
              <TabComponent id="academicsTabs" animation={{ next: { effect: 'FadeIn' }, previous: { effect: 'FadeIn' } }}>
                <TabItemsDirective>
                  <TabItemDirective header={{ text: 'Deadlines' }} content={renderDeadlines} />
                  <TabItemDirective header={{ text: 'Schedule' }} content={renderSchedule} />
                  <TabItemDirective header={{ text: 'Holidays' }} content={renderHolidays} />
                  <TabItemDirective header={{ text: 'Notices' }} content={renderNotices} />
                </TabItemsDirective>
              </TabComponent>
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
