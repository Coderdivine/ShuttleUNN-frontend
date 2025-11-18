export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center gap-2`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
        <rect width="40" height="40" rx="8" fill="currentColor"/>
        <path d="M12 20 L20 12 L28 20 L20 28 Z" fill="white" stroke="white" strokeWidth="2"/>
        <circle cx="20" cy="20" r="3" fill="white"/>
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-lg tracking-tight">ShuttleUNN</span>
        <span className="text-[10px] text-gray-600 -mt-1">Campus Transit</span>
      </div>
    </div>
  );
}
