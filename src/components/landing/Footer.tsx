import Logo from "@/components/common/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-spot-border py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo className="text-2xl" />

        <p className="text-spot-muted text-sm font-body">
          &copy; {new Date().getFullYear()} SpotSter. All rights reserved.
        </p>

        <div className="flex gap-6 text-spot-muted text-sm font-body">
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
