import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const AboutSection = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  const rewardsImg = `${base}Chick-Rocks-Rewards.png`;
  const rewardsAlt =
    "Chick Rocks Rewards program — earn points on every halal chicken order";

  return (
    <section id="about" className="relative py-24 bg-card overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.07)_0%,transparent_65%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grain-overlay" />

      <div className="container relative mx-auto px-4">
        <InlineEdit
          id="about_heading"
          as="h2"
          className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground text-center mb-4 block"
          isEditing={isEditing}
          value={getDraftValue("about_heading", "Chick Rocks Rewards")}
          onChange={(v) => updateDraft("about_heading", v)}
        />

        <InlineEdit
          id="about_subheading"
          as="p"
          className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16 block"
          isEditing={isEditing}
          value={getDraftValue(
            "about_subheading",
            "Earn rewards on your favorite halal chicken meals, sandwiches, and combos every time you order."
          )}
          onChange={(v) => updateDraft("about_subheading", v)}
        />

        <div className="relative mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg">
          <div
            aria-hidden
            className="absolute -inset-20 sm:-inset-28 rewards-sunburst animate-spin-slow"
          />

          <svg
            aria-hidden
            viewBox="0 0 100 100"
            fill="currentColor"
            className="absolute -top-8 -left-6 sm:-top-10 sm:-left-10 w-12 h-12 sm:w-16 sm:h-16 text-accent drop-shadow-md animate-spin-slow z-20"
          >
            <path d="M50 0 L58 38 L96 42 L66 62 L78 98 L50 76 L22 98 L34 62 L4 42 L42 38 Z" />
          </svg>

          <div className="absolute -top-10 -right-6 sm:-top-14 sm:-right-12 w-28 h-28 sm:w-36 sm:h-36 z-20 animate-spin-reverse">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
              <defs>
                <path
                  id="rewards-badge-arc"
                  d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
                />
              </defs>
              <circle cx="100" cy="100" r="92" fill="hsl(var(--accent))" />
              <circle cx="100" cy="100" r="64" fill="hsl(var(--primary))" />
              <text
                fontFamily="Anton, sans-serif"
                fontSize="20"
                letterSpacing="3"
                fill="hsl(var(--accent-foreground))"
              >
                <textPath href="#rewards-badge-arc" startOffset="0">
                  EARN • EAT • REPEAT • CHICK ROCKS •
                </textPath>
              </text>
              <text
                x="100"
                y="112"
                textAnchor="middle"
                fontFamily="Anton, sans-serif"
                fontSize="36"
                fill="hsl(var(--primary-foreground))"
              >
                JOIN
              </text>
            </svg>
          </div>

          {(() => {
            const poster = (
              <MediaEdit
                id="rewards_poster"
                isEditing={isEditing}
                value={getDraftValue("rewards_poster", rewardsImg)}
                onChange={(v) => updateDraft("rewards_poster", v)}
                className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-primary/40 ring-1 ring-black/5 transition-transform duration-500 ease-out hover:-translate-y-1 hover:rotate-[0.5deg]"
              >
                <img
                  src={getDraftValue("rewards_poster", rewardsImg)}
                  alt={rewardsAlt}
                  loading="lazy"
                  className="block w-full h-auto"
                />
              </MediaEdit>
            );

            if (isEditing) return poster;

            return (
              <a
                href="https://loyalty.chowbus.com/v2/83CG47U/landing"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join Chick Rocks Rewards on Chowbus"
                className="block relative z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
              >
                {poster}
              </a>
            );
          })()}

          <div className="absolute -bottom-5 -right-3 sm:-bottom-7 sm:-right-8 z-20 -rotate-[8deg]">
            <div className="bg-foreground text-background font-heading uppercase tracking-widest text-sm sm:text-base px-4 py-2 rounded-md shadow-xl ring-2 ring-background">
              <span className="text-primary mr-1.5">★</span>
              Tap to Join
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
