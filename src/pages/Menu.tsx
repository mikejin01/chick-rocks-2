import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { cn } from "@/lib/utils";
import menuData from "@/lib/data/uber-eats-astoria/20260421-menu.json";

type MenuItem = {
  uuid: string;
  name: string;
  category: string;
  description: string;
  priceCents: number;
  priceText: string;
  imageUrl: string;
};

type CategoryRowProps = {
  category: string;
  items: MenuItem[];
};

const Sparkle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={cn("animate-pulse [animation-duration:3s]", className)}
    style={style}
  >
    <path d="M12 0c.6 4.4 1.6 7 3.4 8.6C17.2 10.2 19.8 11.2 24 12c-4.4.6-7 1.6-8.6 3.4C13.8 17.2 12.8 19.8 12 24c-.6-4.4-1.6-7-3.4-8.6C6.8 13.8 4.2 12.8 0 12c4.4-.6 7-1.6 8.6-3.4C10.2 6.8 11.2 4.2 12 0z" />
  </svg>
);

const CategoryRow = ({ category, items }: CategoryRowProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 1;
    setHasOverflow(overflow);
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useLayoutEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [items.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 24;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-heading uppercase text-foreground">
          {stripCJK(category)}
        </h2>
        {hasOverflow && (
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              aria-label={`Previous ${stripCJK(category)} items`}
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground transition-opacity hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={`Next ${stripCJK(category)} items`}
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground transition-opacity hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {items.map((item) => {
          const en = stripCJK(item.name) || item.name;
          return (
            <div
              key={item.uuid}
              data-card
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow flex flex-col shrink-0 snap-start w-[78%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <div className="h-48 overflow-hidden bg-cream">
                <img
                  src={item.imageUrl}
                  alt={en}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-1 border-t border-border">
                <h3 className="font-heading text-lg uppercase text-foreground">
                  {en}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const NAV_OFFSET = 136;

const CJK_GLOBAL = /[一-鿿　-〿＀-￯]/g;

const stripCJK = (s: string) => s.replace(CJK_GLOBAL, "").replace(/\s+/g, " ").trim();

const slugify = (s: string) =>
  stripCJK(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const Menu = () => {
  const base = import.meta.env.BASE_URL;
  const sections = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    (menuData as MenuItem[]).forEach((item) => {
      const bucket = map.get(item.category) ?? [];
      bucket.push(item);
      map.set(item.category, bucket);
    });
    const usedSlugs = new Set<string>();
    return Array.from(map.entries()).map(([category, items]) => {
      let slug = slugify(category);
      let i = 2;
      while (usedSlugs.has(slug)) slug = `${slugify(category)}-${i++}`;
      usedSlugs.add(slug);
      return { category, slug, items };
    });
  }, []);

  const menuLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Menu",
      name: "Chick Rocks Halal Menu",
      inLanguage: "en",
      hasMenuSection: sections.map((section) => ({
        "@type": "MenuSection",
        name: stripCJK(section.category),
        hasMenuItem: section.items.map((item) => {
          const en = stripCJK(item.name);
          const priceValue = item.priceCents ? (item.priceCents / 100).toFixed(2) : undefined;
          return {
            "@type": "MenuItem",
            name: en || item.name,
            description: item.description || undefined,
            image: item.imageUrl || undefined,
            suitableForDiet: "https://schema.org/HalalDiet",
            ...(priceValue
              ? {
                  offers: {
                    "@type": "Offer",
                    price: priceValue,
                    priceCurrency: "USD",
                  },
                }
              : {}),
          };
        }),
      })),
    }),
    [sections]
  );

  const menuCrumbsLd = useMemo(
    () =>
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Menu", path: "/menu" },
      ]),
    []
  );

  const [activeSlug, setActiveSlug] = useState(sections[0]?.slug ?? "");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const slug = hash.replace(/^#/, "");
    if (!sections.some((s) => s.slug === slug)) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(slug);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSlug(slug);
    });
  }, [hash, sections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSlug(visible[0].target.id);
      },
      { rootMargin: `-${NAV_OFFSET + 20}px 0px -60% 0px`, threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const el = tabRefs.current[activeSlug];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSlug]);

  const onTabClick = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Halal Fried Chicken Menu — Sandwiches, Wings & Rice Bowls | Chick Rocks"
        description="The full Chick Rocks halal menu — crispy fried chicken, signature sandwiches, wings, rice bowls, spaghetti combos, sides and drinks. Fresh, halal, made to order in Astoria & Flushing, NY."
        path="/menu"
        keywords="halal fried chicken menu, halal chicken sandwich astoria, halal wings queens, halal rice bowl nyc, chick rocks menu"
        image={`${SITE.URL}/Fried_Chicken_Nyc.png`}
        jsonLd={[menuLd, menuCrumbsLd]}
      />
      <Navbar />

      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-4">
          <img
            src={`${base}logo.webp`}
            alt="Chick Rocks halal fried chicken logo"
            className="h-20 md:h-24 w-auto brightness-0 invert"
          />
          <h1 className="text-4xl md:text-5xl font-heading tracking-wider uppercase">
            Halal Fried Chicken Menu
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            Explore crispy halal fried chicken, sandwiches, wings, rice bowls, spaghetti, desserts, and combo meals in Flushing and Astoria.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <a
              href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary-foreground text-primary px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Order Now (Flushing)
            </a>
            <a
              href="https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary-foreground text-primary px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Order Now (Astoria)
            </a>
          </div>
        </div>
      </section>

      <div className="sticky top-[72px] z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
            {sections.map((s) => (
              <button
                key={s.slug}
                ref={(el) => (tabRefs.current[s.slug] = el)}
                onClick={() => onTabClick(s.slug)}
                className={cn(
                  "shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors",
                  activeSlug === s.slug
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:text-primary"
                )}
              >
                {stripCJK(s.category)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 space-y-16">
        {sections.map((section) => (
          <section key={section.slug} id={section.slug} className="scroll-mt-36">
            <CategoryRow category={section.category} items={section.items} />
          </section>
        ))}
      </main>

      <section className="relative bg-cream text-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none [background-image:radial-gradient(theme(colors.primary.DEFAULT)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative order-1">
              <div className="absolute -inset-2 md:-inset-4 rounded-[3rem] bg-primary/10 -rotate-3" aria-hidden />
              <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[2.5rem] overflow-hidden ring-2 ring-primary/20 shadow-2xl">
                <img
                  src={`${base}hero-1.webp`}
                  alt="Chick Rocks halal fried chicken plate"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <Sparkle className="absolute -top-2 -left-2 md:-top-4 md:-left-6 w-10 md:w-14 text-primary rotate-12" style={{ animationDelay: "0s" }} />
              <Sparkle className="absolute top-1/3 -right-3 md:-right-6 w-7 md:w-10 text-accent -rotate-12" style={{ animationDelay: "0.7s" }} />
              <Sparkle className="absolute -bottom-3 left-10 md:left-16 w-9 md:w-12 text-primary rotate-45" style={{ animationDelay: "1.4s" }} />
              <Sparkle className="absolute bottom-1/4 -left-4 md:-left-8 w-6 md:w-8 text-accent/80" style={{ animationDelay: "2.1s" }} />
            </div>

            <div className="order-2 space-y-5 md:space-y-6">
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-primary">
                Dig In
              </p>
              <h2 className="font-heading uppercase text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-wide text-foreground">
                Hungry Yet? Order Chick Rocks Now
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-md">
                Crispy halal chicken, sandwiches, bowls, and more are just a few clicks away.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <a
                  href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-bold uppercase tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200"
                >
                  Order Flushing Location
                </a>
                <a
                  href="https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-primary text-primary px-7 py-3.5 rounded-full font-bold uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  Order Astoria Location
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
