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
        <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-[#7C6FF7] text-white text-sm leading-relaxed shadow-none">
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
          <span className="text-[10px] text-[#6B6B8A]/70">queried:</span>
          {servers.map((s, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8E6FF] border border-[#E4E2F0] text-[#7C6FF7] font-medium"
            >
              {s.emoji} {s.label}
            </span>
          ))}
        </div>
      )}

      {/* Message */}
      <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#F0EEFF] border border-[#E4E2F0] text-[#1A1A2E] text-sm leading-relaxed prose-dark">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
