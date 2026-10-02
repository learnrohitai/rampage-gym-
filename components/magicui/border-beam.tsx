import { cn } from "@/lib/utils";

export default function BorderBeam({
  className,
  size = 60,
  duration = 6,
  delay = 0,
  colorFrom = "#f5b942",
  colorTo = "#dc2626",
}: {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
      style={{ boxShadow: "inset 0 0 0 1px rgba(245,185,66,0.12)" }}
    >
      <div
        className={cn(
          "absolute aspect-square animate-border-beam bg-gradient-to-l from-transparent via-40% to-transparent",
          className
        )}
        style={{
          ...( {
            "--duration": `${duration}s`,
            "--delay": `-${delay}s`,
          } as React.CSSProperties),
          width: size,
          offsetDistance: "0%",
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          animationDelay: `-${delay}s`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
        }}
      />
    </div>
  );
}
