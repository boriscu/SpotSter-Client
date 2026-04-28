import { useEffect, useState } from "react";

export default function Splash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 100);
    const t2 = setTimeout(() => setPhase("out"), 1800);
    const t3 = setTimeout(onDone, 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-spot-dark flex items-center justify-center transition-opacity duration-500 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Pulse ring */}
        <div
          className={`absolute w-40 h-40 rounded-full border-2 border-spot-green/30 transition-all duration-1000 ease-out ${
            phase === "in"
              ? "scale-50 opacity-0"
              : "scale-100 opacity-100"
          }`}
        />
        <div
          className={`absolute w-56 h-56 rounded-full border border-spot-green/10 transition-all duration-[1.4s] ease-out ${
            phase === "in"
              ? "scale-50 opacity-0"
              : "scale-100 opacity-100"
          }`}
        />

        {/* Marker icon */}
        <svg
          width="48"
          height="68"
          viewBox="0 0 28 40"
          className={`mb-8 drop-shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all duration-700 ease-out ${
            phase === "in"
              ? "opacity-0 scale-50 translate-y-4"
              : "opacity-100 scale-100 translate-y-0"
          }`}
        >
          <path
            d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z"
            fill="#00FF41"
          />
          <circle cx="14" cy="14" r="7" fill="#0a0a0a" />
          <circle cx="14" cy="14" r="3" fill="#00FF41" className="animate-ping" />
        </svg>

        {/* Logo */}
        <h1
          className={`font-heading font-bold text-5xl md:text-7xl tracking-wider select-none transition-all duration-700 ease-out delay-300 ${
            phase === "in"
              ? "opacity-0 translate-y-6"
              : "opacity-100 translate-y-0"
          }`}
        >
          SPOT<span className="text-spot-green">STER</span>
        </h1>

        {/* Tagline */}
        <p
          className={`font-body text-spot-muted text-sm mt-3 tracking-widest uppercase transition-all duration-700 ease-out delay-500 ${
            phase === "in"
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          Spot the monster
        </p>

        {/* Loading bar */}
        <div className="mt-8 w-48 h-0.5 bg-spot-border rounded-full overflow-hidden">
          <div
            className={`h-full bg-spot-green rounded-full transition-all ease-out ${
              phase === "in"
                ? "w-0 duration-100"
                : phase === "hold"
                  ? "w-full duration-[1.5s]"
                  : "w-full duration-100"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
