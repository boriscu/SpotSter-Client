const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />
      </svg>
    ),
    title: "Live Map",
    description:
      "Browse an interactive map showing every store with Monster Energy drinks spotted nearby. Filter by flavor, type, or recency.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
    title: "Snap & Spot",
    description:
      "Take a photo of any Monster can you find in the wild. Our AI identifies the flavor and logs it to the map instantly.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Verified Sightings",
    description:
      "Every spotting is verified by our vision model. Only confirmed Monster drinks make it onto the map, so you can trust what you see.",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-16">
          How It <span className="text-spot-green">Works</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-spot-card border border-spot-border rounded-2xl p-8 hover:border-spot-green/30 transition-colors"
            >
              <div className="text-spot-green mb-4">{f.icon}</div>
              <h3 className="font-heading text-xl font-bold mb-3">
                {f.title}
              </h3>
              <p className="text-gray-400 font-body leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
