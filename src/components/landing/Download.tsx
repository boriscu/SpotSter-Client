import Logo from "@/components/common/Logo";

export default function Download() {
  return (
    <section id="download" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <Logo className="text-5xl md:text-6xl mb-6" />

        <p className="text-lg text-gray-300 mb-10 font-body max-w-lg mx-auto">
          Start spotting Monster Energy flavors in the wild. Download the app and
          join the community of hunters.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="flex items-center gap-3 bg-white text-black rounded-xl px-6 py-3 hover:bg-gray-100 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <div className="text-left">
              <div className="text-xs opacity-60">Download on the</div>
              <div className="font-semibold text-lg leading-tight">
                App Store
              </div>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 bg-white text-black rounded-xl px-6 py-3 hover:bg-gray-100 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199 2.302 2.302a1 1 0 0 1 0 1.38l-1.698 1.698L15.5 12l2.198-2.492zM5.864 2.658 16.8 8.99l-2.302 2.302-8.634-8.634z" />
            </svg>
            <div className="text-left">
              <div className="text-xs opacity-60">Get it on</div>
              <div className="font-semibold text-lg leading-tight">
                Google Play
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
