export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-heading font-bold tracking-wider select-none ${className}`}
    >
      SPOT<span className="text-spot-green">STER</span>
    </span>
  );
}
