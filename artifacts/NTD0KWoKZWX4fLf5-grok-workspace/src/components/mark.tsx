import { cn } from "@/lib/utils";

export function GarudaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("text-primary", className)} aria-hidden>
      <polygon
        points="16,2 28,8 28,20 16,30 4,20 4,8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 14 L16 9 L24 14 L16 12 Z"
        fill="currentColor"
      />
      <path
        d="M9 19 L16 14.5 L23 19 L16 17 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <circle cx="16" cy="22.5" r="1.4" fill="#C45C5C" />
    </svg>
  );
}
