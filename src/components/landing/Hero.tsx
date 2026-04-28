import Logo from "@/components/common/Logo";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-spot-dark via-spot-dark to-transparent" />

      <div className="relative z-10 max-w-3xl">
        <Logo className="text-6xl md:text-8xl mb-6" />

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto font-body">
          A crowdsourced map for tracking Monster Energy flavor sightings
          &mdash; see what&apos;s stocked nearby in real time, log new spots from
          your phone, and never miss a limited release again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#download"
            className="bg-spot-green text-spot-dark font-heading font-bold text-lg px-8 py-3 rounded-full hover:brightness-110 transition-all"
          >
            Download the App
          </a>
          <a
            href="#map"
            className="border border-spot-green text-spot-green font-heading font-bold text-lg px-8 py-3 rounded-full hover:bg-spot-green/10 transition-all"
          >
            Explore the Map
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00FF41"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
