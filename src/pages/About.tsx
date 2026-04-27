import { MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Chick Rocks — Halal Fried Chicken in Astoria & Flushing",
  url: `${SITE.URL}/about`,
  about: {
    "@type": "Restaurant",
    name: SITE.NAME,
    servesCuisine: ["Halal", "Fried Chicken", "Chinese American"],
  },
};

const aboutCrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
]);

const About = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;
  const defaultStory = `${base}store-front-1.avif`;
  const defaultMenu = `${base}promo-1.png`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="About Chick Rocks — Astoria's Halal Fried Chicken Spot"
        description="Chick Rocks brings bold halal fried chicken, sandwiches, rice bowls and spaghetti combos to Astoria and Flushing, Queens. 100% halal, hand-breaded and fried fresh to order."
        path="/about"
        keywords="chick rocks story, halal fried chicken astoria, halal restaurant queens, chinese american halal"
        image={`${SITE.URL}/store-front-1.avif`}
        imageAlt="Chick Rocks Astoria storefront — halal fried chicken"
        jsonLd={[aboutLd, aboutCrumbsLd]}
      />
      <Navbar />

      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-4">
          <MediaEdit
            id="about_page_hero_logo"
            isEditing={isEditing}
            value={getDraftValue("about_page_hero_logo", `${base}logo.webp`)}
            onChange={(v) => updateDraft("about_page_hero_logo", v)}
          >
            <img
              src={getDraftValue("about_page_hero_logo", `${base}logo.webp`)}
              alt="Chick Rocks halal fried chicken logo"
              className="h-20 md:h-24 w-auto brightness-0 invert"
            />
          </MediaEdit>
          <InlineEdit
            id="about_page_title"
            as="h1"
            className="text-4xl md:text-5xl font-heading tracking-wider uppercase block"
            isEditing={isEditing}
            value={getDraftValue(
              "about_page_title",
              "Astoria's Halal Fried Chicken Spot"
            )}
            onChange={(v) => updateDraft("about_page_title", v)}
          />
          <InlineEdit
            id="about_page_hero_subtext"
            as="p"
            className="text-base md:text-lg opacity-90 max-w-2xl mx-auto block"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "about_page_hero_subtext",
              "Where East meets West — bold flavor, real comfort."
            )}
            onChange={(v) => updateDraft("about_page_hero_subtext", v)}
          />
        </div>
      </section>

      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[520px]">
            <MediaEdit
              id="about_page_img_1"
              isEditing={isEditing}
              value={getDraftValue("about_page_img_1", defaultStory)}
              onChange={(v) => updateDraft("about_page_img_1", v)}
              className="flex justify-center md:justify-start"
            >
              <img
                src={getDraftValue("about_page_img_1", defaultStory)}
                alt="Chick Rocks storefront and signature meals"
                loading="lazy"
                className="w-full max-w-[600px] h-auto max-h-[560px] object-contain rounded-3xl"
              />
            </MediaEdit>

            <div className="max-w-2xl space-y-6 md:justify-self-start md:pl-4">
              <InlineEdit
                id="about_page_section_1_eyebrow"
                as="p"
                className="text-accent font-bold uppercase tracking-wide text-sm block"
                isEditing={isEditing}
                value={getDraftValue("about_page_section_1_eyebrow", "Where East Meets West")}
                onChange={(v) => updateDraft("about_page_section_1_eyebrow", v)}
              />
              <InlineEdit
                id="about_page_section_1_heading"
                as="h2"
                className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block"
                isEditing={isEditing}
                value={getDraftValue("about_page_section_1_heading", "Bold Flavor. Real Comfort.")}
                onChange={(v) => updateDraft("about_page_section_1_heading", v)}
              />
              <InlineEdit
                id="about_page_section_1_body"
                as="p"
                className="text-muted-foreground leading-relaxed block"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "about_page_section_1_body",
                  "Chick Rocks was created to bring bold flavor and real comfort food to NYC. Located on Astoria and Flushing, we serve a unique mix of Halal Chinese American fusion, where East meets West in every bite. Our food is made fresh in house using quality ingredients, thoughtful seasoning, and recipes built to satisfy."
                )}
                onChange={(v) => updateDraft("about_page_section_1_body", v)}
              />
              <div className="flex flex-wrap gap-4 pt-2 text-sm font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <InlineEdit
                    id="about_page_loc_1"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("about_page_loc_1", "Flushing, NY")}
                    onChange={(v) => updateDraft("about_page_loc_1", v)}
                  />
                </div>
                <span className="text-border">|</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <InlineEdit
                    id="about_page_loc_2"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("about_page_loc_2", "Astoria, NY")}
                    onChange={(v) => updateDraft("about_page_loc_2", v)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[520px]">
            <div className="max-w-2xl space-y-6 order-2 md:order-1 md:justify-self-end md:pr-4">
              <InlineEdit
                id="about_page_section_2_eyebrow"
                as="p"
                className="text-accent font-bold uppercase tracking-wide text-sm block"
                isEditing={isEditing}
                value={getDraftValue("about_page_section_2_eyebrow", "Built for Everyday Cravings")}
                onChange={(v) => updateDraft("about_page_section_2_eyebrow", v)}
              />
              <InlineEdit
                id="about_page_section_2_heading"
                as="h2"
                className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block"
                isEditing={isEditing}
                value={getDraftValue("about_page_section_2_heading", "A Menu Made To Satisfy")}
                onChange={(v) => updateDraft("about_page_section_2_heading", v)}
              />
              <InlineEdit
                id="about_page_section_2_body"
                as="p"
                className="text-muted-foreground leading-relaxed block"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "about_page_section_2_body",
                  "From crispy halal fried chicken and handcrafted chicken sandwiches to rice bowls, spaghetti combos, burgers, and refreshing drinks, our menu is designed for everyday cravings and budget friendly meals without cutting corners on taste. Whether you're dining in, ordering takeout, or getting delivery, we focus on great service, welcoming vibes, and food that keeps you coming back."
                )}
                onChange={(v) => updateDraft("about_page_section_2_body", v)}
              />
            </div>

            <MediaEdit
              id="about_page_img_2"
              isEditing={isEditing}
              value={getDraftValue("about_page_img_2", defaultMenu)}
              onChange={(v) => updateDraft("about_page_img_2", v)}
              className="flex justify-center md:justify-end order-1 md:order-2"
            >
              <img
                src={getDraftValue("about_page_img_2", defaultMenu)}
                alt="Chick Rocks menu favorites including sandwiches, rice bowls, and sides"
                loading="lazy"
                className="w-full max-w-[600px] h-auto max-h-[560px] object-contain rounded-3xl"
              />
            </MediaEdit>
          </div>
        </div>
      </section>

      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <InlineEdit
              id="about_page_belief_eyebrow"
              as="p"
              className="text-accent font-bold uppercase tracking-wide text-sm block"
              isEditing={isEditing}
              value={getDraftValue("about_page_belief_eyebrow", "What We Believe")}
              onChange={(v) => updateDraft("about_page_belief_eyebrow", v)}
            />
            <InlineEdit
              id="about_page_belief_heading"
              as="h2"
              className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block"
              isEditing={isEditing}
              value={getDraftValue("about_page_belief_heading", "Honest. Filling. Fun.")}
              onChange={(v) => updateDraft("about_page_belief_heading", v)}
            />
            <InlineEdit
              id="about_page_belief_body"
              as="p"
              className="text-muted-foreground leading-relaxed text-lg block"
              isEditing={isEditing}
              multiline
              value={getDraftValue(
                "about_page_belief_body",
                "At Chick Rocks, we believe good food should be honest, filling, and fun."
              )}
              onChange={(v) => updateDraft("about_page_belief_body", v)}
            />
            <InlineEdit
              id="about_page_belief_tagline"
              as="p"
              className="text-2xl md:text-3xl font-heading uppercase text-primary tracking-wide block"
              isEditing={isEditing}
              value={getDraftValue("about_page_belief_tagline", "Let Us Rock Your Taste.")}
              onChange={(v) => updateDraft("about_page_belief_tagline", v)}
            />
            <div className="pt-4">
              <a
                href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                <InlineEdit
                  id="about_page_cta"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue("about_page_cta", "Order Online")}
                  onChange={(v) => updateDraft("about_page_cta", v)}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
