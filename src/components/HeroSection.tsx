import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShoppingBag, Bike, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const base = import.meta.env.BASE_URL;
const slides = [`${base}hero-new-1.jpg`, `${base}hero-new-2.jpg`];

const COPIES = 5;
const rendered = Array.from({ length: slides.length * COPIES }, (_, i) => slides[i % slides.length]);
const MIDDLE = slides.length * Math.floor(COPIES / 2);

const MOBILE_MAX = 639;
const SLIDE_W_VW_MOBILE = 92;
const SLIDE_W_VW_DESKTOP = 70;
const GAP_PX_MOBILE = 8;
const GAP_PX_DESKTOP = 16;
const DURATION_MS = 700;
const AUTOPLAY_MS = 5000;

const HeroSection = () => {
  const [vIndex, setVIndex] = useState(MIDDLE);
  const [playing, setPlaying] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= MOBILE_MAX
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slideW = isMobile ? SLIDE_W_VW_MOBILE : SLIDE_W_VW_DESKTOP;
  const gapPx = isMobile ? GAP_PX_MOBILE : GAP_PX_DESKTOP;

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const armSafetyRelease = () => {
    if (safetyRef.current) clearTimeout(safetyRef.current);
    safetyRef.current = setTimeout(() => {
      isTransitioning.current = false;
    }, DURATION_MS + 100);
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!playing) return;
    autoplayRef.current = setInterval(() => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      armSafetyRelease();
      setAnimate(true);
      setVIndex((v) => v + 1);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
      if (safetyRef.current) clearTimeout(safetyRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useLayoutEffect(() => {
    if (animate || !trackRef.current) return;
    void trackRef.current.getBoundingClientRect();
    const id = requestAnimationFrame(() => {
      setAnimate(true);
      isTransitioning.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [animate, vIndex]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (vIndex >= slides.length * (COPIES - 1)) {
      setAnimate(false);
      setVIndex((v) => v - slides.length * (COPIES - 2));
      return;
    }
    if (vIndex < slides.length) {
      setAnimate(false);
      setVIndex((v) => v + slides.length * (COPIES - 2));
      return;
    }
    isTransitioning.current = false;
  };

  const nav = (dir: 1 | -1) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    armSafetyRelease();
    setAnimate(true);
    setVIndex((v) => v + dir);
    startAutoplay();
  };

  const jumpToDot = (i: number) => {
    if (isTransitioning.current) return;
    const target = MIDDLE + i;
    if (target === vIndex) return;
    isTransitioning.current = true;
    armSafetyRelease();
    setAnimate(true);
    setVIndex(target);
    startAutoplay();
  };

  const activeDot = ((vIndex % slides.length) + slides.length) % slides.length;

  const slideTransitionClass = animate ? "transition-[transform,opacity] duration-700 ease-out" : "";

  return (
    <section className="bg-cream pb-10 pt-4">
      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className={`flex ${animate ? "transition-transform duration-700 ease-out" : ""}`}
          style={{
            gap: `${gapPx}px`,
            transform: `translateX(calc(${50 - slideW / 2 - vIndex * slideW}vw - ${vIndex * gapPx}px))`,
            willChange: "transform",
          }}
        >
          {rendered.map((src, i) => {
            const isCenter = i === vIndex;
            return (
              <div
                key={i}
                className={`shrink-0 overflow-hidden rounded-2xl sm:rounded-[2.5rem] ${slideTransitionClass} ${
                  isCenter ? "scale-100 opacity-100" : "scale-[0.88] opacity-70"
                }`}
                style={{ width: `${slideW}vw` }}
              >
                <img
                  src={src}
                  alt="Chick Rocks featured promotion"
                  loading="lazy"
                  className="block w-full h-auto sm:h-[500px] md:h-[640px] sm:object-contain bg-cream"
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={() => nav(-1)}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-[calc(15vw-20px)] top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow-md transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => nav(1)}
          aria-label="Next slide"
          className="absolute right-2 sm:right-[calc(15vw-20px)] top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow-md transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          className="w-6 h-6 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground flex items-center justify-center transition-colors"
        >
          {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpToDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === activeDot ? "bg-primary" : "bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 flex flex-row items-center justify-center gap-3 sm:gap-4">
        <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-primary text-primary-foreground px-4 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:opacity-90 transition-opacity sm:min-w-[220px]">
          <ShoppingBag className="w-5 h-5" />
          Order Pickup
        </button>
        <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-primary text-primary-foreground px-4 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:opacity-90 transition-opacity sm:min-w-[220px]">
          <Bike className="w-5 h-5" />
          Order Delivery
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
