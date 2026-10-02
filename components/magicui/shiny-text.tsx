import { cn } from "@/lib/utils";

export function AnimatedShinyText({
  children,
  className,
  speed = 2,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <span
      className={cn(
        "group relative inline-flex items-center gap-1 rounded-full bg-clip-text",
        className
      )}
    >
      <span
        className="animate-shimmer bg-gradient-to-r from-[#b8860b] via-[#f9d976] to-[#b8860b] bg-[200%_auto] bg-clip-text text-transparent"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </span>
    </span>
  );
}

export function ShineBorder({
  className,
  borderWidth = 2,
  color = ["#f5b942", "#dc2626", "#f5b942"],
}: {
  className?: string;
  borderWidth?: number;
  color?: string[];
}) {
  return (
    <div
      style={{
        ...( {
          "--border-width": `${borderWidth}px`,
        } as React.CSSProperties),
        backgroundImage: `linear-gradient(to bottom, transparent, transparent), radial-gradient(transparent, transparent), conic-gradient(from 0deg, ${color.join(", ")})`,
        maskImage:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
      }}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 size-full rounded-[inherit] animate-spin-slow",
        className
      )}
    />
  );
}
