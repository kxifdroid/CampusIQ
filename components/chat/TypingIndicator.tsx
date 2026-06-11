export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-[#16161E] border border-white/[0.06] rounded-2xl rounded-tl-sm w-fit">
      <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full dot-bounce" />
      <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full dot-bounce" />
      <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full dot-bounce" />
    </div>
  );
}
