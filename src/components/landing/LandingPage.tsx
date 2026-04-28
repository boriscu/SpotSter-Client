import { useState, useCallback } from "react";
import Splash from "./Splash";
import Hero from "./Hero";
import Features from "./Features";
import MapSection from "./MapSection";
import Download from "./Download";
import Footer from "./Footer";

export default function LandingPage() {
  const [ready, setReady] = useState(false);
  const onSplashDone = useCallback(() => setReady(true), []);

  return (
    <>
      {!ready && <Splash onDone={onSplashDone} />}
      <div
        className={`min-h-screen bg-spot-dark transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <Hero />
        <Features />
        <MapSection />
        <Download />
        <Footer />
      </div>
    </>
  );
}
