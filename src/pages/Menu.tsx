import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
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

const NAV_OFFSET = 136;

const CJK = /[一-鿿　-〿＀-￯]/;

const slugify = (s: string) =>
  s
    .replace(/[一-鿿]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const splitName = (name: string): { en: string; zh: string } => {
  const first = name.search(CJK);
  if (first === -1) return { en: name.trim(), zh: "" };
  let last = first;
  for (let i = name.length - 1; i >= first; i--) {
    if (CJK.test(name[i])) {
      last = i;
      break;
    }
  }
  return {
    en: name.slice(0, first).trim(),
    zh: name.slice(first, last + 1).trim(),
  };
};

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
        name: section.category,
        hasMenuItem: section.items.map((item) => {
          const { en } = splitName(item.name);
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
            Hand-breaded halal fried chicken, signature sandwiches, wings, rice bowls,
            <br className="hidden sm:block" /> spaghetti combos and sides — crafted fresh every
            day in Astoria & Flushing, NY.
          </p>
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
                {s.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 space-y-16">
        {sections.map((section) => (
          <section key={section.slug} id={section.slug} className="scroll-mt-36">
            <h2 className="text-2xl md:text-3xl font-heading uppercase text-foreground mb-6">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.items.map((item) => {
                const { en, zh } = splitName(item.name);
                return (
                  <div
                    key={item.uuid}
                    className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <div className="h-48 overflow-hidden bg-cream">
                      <img
                        src={item.imageUrl}
                        alt={en || item.name}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 border-t border-border">
                      <h3 className="font-heading text-lg uppercase text-foreground mb-2">
                        {en || item.name}
                      </h3>
                      {zh && (
                        <span className="text-muted-foreground text-sm mt-auto pt-2">{zh}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
