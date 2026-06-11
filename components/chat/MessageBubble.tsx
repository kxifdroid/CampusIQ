import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ServerTag {
  label: string;
  emoji: string;
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  servers?: ServerTag[];
}

export default function MessageBubble({ role, content, servers }: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white text-sm leading-relaxed shadow-lg shadow-violet-900/30">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 animate-slide-up">
      {/* Server tags */}
      {servers && servers.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-white/30">queried:</span>
          {servers.map((s, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 font-medium"
            >
              {s.emoji} {s.label}
            </span>
          ))}
        </div>
      )}

      {/* Message */}
      <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#16161E] border border-white/[0.06] text-white/90 text-sm leading-relaxed prose-dark">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
