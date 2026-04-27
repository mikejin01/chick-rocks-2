import { Users, Clock, Utensils } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const cateringLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Chick Rocks Halal Catering",
  serviceType: "Halal Catering",
  areaServed: [
    { "@type": "City", name: "Queens" },
    { "@type": "City", name: "New York" },
  ],
  provider: {
    "@type": "Restaurant",
    name: SITE.NAME,
    url: SITE.URL,
  },
  url: `${SITE.URL}/catering`,
  description:
    "Halal catering for offices, parties, weddings and events across Queens and NYC. Family combos, sandwich platters, wing buckets, rice bowl bars and drinks.",
};

const cateringCrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Catering", path: "/catering" },
]);

const Catering = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;
  const defaultSection1 = `${base}catering-2.webp`;
  const defaultSection2 = `${base}catering-2.avif`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Halal Catering in Queens & NYC | Chick Rocks Catering"
        description="Halal catering for offices, parties, weddings and events across Queens and NYC. Family combos, sandwich platters, wing buckets, rice bowl bars — Chick Rocks delivers fresh, crispy halal fried chicken to your next event."
        path="/catering"
        keywords="halal catering queens, halal catering nyc, halal office catering, halal event catering astoria, chick rocks catering"
        image={`${SITE.URL}/catering-1.avif`}
        imageAlt="Chick Rocks halal catering spread with chicken platters and sides"
        jsonLd={[cateringLd, cateringCrumbsLd]}
      />
      <Navbar />

      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-4">
          <MediaEdit
            id="catering_page_hero_logo"
            isEditing={isEditing}
            value={getDraftValue("catering_page_hero_logo", `${base}logo.webp`)}
            onChange={(v) => updateDraft("catering_page_hero_logo", v)}
          >
            <img
              src={getDraftValue("catering_page_hero_logo", `${base}logo.webp`)}
              alt="Chick Rocks halal fried chicken logo"
              className="h-20 md:h-24 w-auto brightness-0 invert"
            />
          </MediaEdit>
          <InlineEdit
            id="catering_page_title"
            as="h1"
            className="text-4xl md:text-5xl font-heading tracking-wider uppercase block"
            isEditing={isEditing}
            value={getDraftValue("catering_page_title", "Halal Catering in Queens & NYC")}
            onChange={(v) => updateDraft("catering_page_title", v)}
          />
          <InlineEdit
            id="catering_page_hero_subtext"
            as="p"
            className="text-base md:text-lg opacity-90 max-w-2xl mx-auto block"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "catering_page_hero_subtext",
              "Crowd-pleasing platters for offices, parties, and every event in between."
            )}
            onChange={(v) => updateDraft("catering_page_hero_subtext", v)}
          />
        </div>
      </section>

      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[520px]">
            <MediaEdit
              id="catering_page_img_1"
              isEditing={isEditing}
              value={getDraftValue("catering_page_img_1", defaultSection1)}
              onChange={(v) => updateDraft("catering_page_img_1", v)}
              className="flex justify-center md:justify-start"
            >
              <img
                src={getDraftValue("catering_page_img_1", defaultSection1)}
                alt="Chick Rocks catering spread with chicken platters and sides"
                loading="lazy"
                className="w-full max-w-[600px] h-auto max-h-[560px] object-contain rounded-3xl"
              />
            </MediaEdit>

            <div className="max-w-2xl space-y-6 md:justify-self-start md:pl-4">
              <InlineEdit
                id="catering_page_section_1_eyebrow"
                as="p"
                className="text-accent font-bold uppercase tracking-wide text-sm block"
                isEditing={isEditing}
                value={getDraftValue("catering_page_section_1_eyebrow", "Feed The Whole Crew")}
                onChange={(v) => updateDraft("catering_page_section_1_eyebrow", v)}
              />
              <InlineEdit
                id="catering_page_section_1_heading"
                as="h2"
                className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block"
                isEditing={isEditing}
                value={getDraftValue("catering_page_section_1_heading", "Big Flavor For Every Event")}
                onChange={(v) => updateDraft("catering_page_section_1_heading", v)}
              />
              <InlineEdit
                id="catering_page_section_1_body"
                as="p"
                className="text-muted-foreground leading-relaxed block"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "catering_page_section_1_body",
                  "From office lunches and team meetings to birthdays, weddings, and holiday gatherings, Chick Rocks brings bold, satisfying food to every occasion. We serve our signature halal fried chicken, sandwiches, rice bowls, spaghetti combos, and sides — freshly made and packaged to keep everything hot, crisp, and ready to share."
                )}
                onChange={(v) => updateDraft("catering_page_section_1_body", v)}
              />
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="flex flex-col items-start gap-2 text-sm">
                  <Users className="w-5 h-5 text-primary" />
                  <InlineEdit
                    id="catering_page_feature_1"
                    as="span"
                    className="font-semibold text-foreground block"
                    isEditing={isEditing}
                    value={getDraftValue("catering_page_feature_1", "Groups of 10–200+")}
                    onChange={(v) => updateDraft("catering_page_feature_1", v)}
                  />
                </div>
                <div className="flex flex-col items-start gap-2 text-sm">
                  <Utensils className="w-5 h-5 text-primary" />
                  <InlineEdit
                    id="catering_page_feature_2"
                    as="span"
                    className="font-semibold text-foreground block"
                    isEditing={isEditing}
                    value={getDraftValue("catering_page_feature_2", "Custom menus")}
                    onChange={(v) => updateDraft("catering_page_feature_2", v)}
                  />
                </div>
                <div className="flex flex-col items-start gap-2 text-sm">
                  <Clock className="w-5 h-5 text-primary" />
                  <InlineEdit
                    id="catering_page_feature_3"
                    as="span"
                    className="font-semibold text-foreground block"
                    isEditing={isEditing}
                    value={getDraftValue("catering_page_feature_3", "48h advance notice")}
                    onChange={(v) => updateDraft("catering_page_feature_3", v)}
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
                id="catering_page_section_2_eyebrow"
                as="p"
                className="text-accent font-bold uppercase tracking-wide text-sm block"
                isEditing={isEditing}
                value={getDraftValue("catering_page_section_2_eyebrow", "Packages Made Simple")}
                onChange={(v) => updateDraft("catering_page_section_2_eyebrow", v)}
              />
              <InlineEdit
                id="catering_page_section_2_heading"
                as="h2"
                className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block"
                isEditing={isEditing}
                value={getDraftValue("catering_page_section_2_heading", "Built Around Your Event")}
                onChange={(v) => updateDraft("catering_page_section_2_heading", v)}
              />
              <InlineEdit
                id="catering_page_section_2_body"
                as="p"
                className="text-muted-foreground leading-relaxed block"
                isEditing={isEditing}
                multiline
                value={getDraftValue(
                  "catering_page_section_2_body",
                  "Choose from family combos, sandwich platters, wing buckets, rice bowl bars, and beverage trays — or let us help you design a custom package. Every order is portioned generously, labeled clearly, and delivered on time. Pickup and delivery options are available from both our Flushing and Astoria locations."
                )}
                onChange={(v) => updateDraft("catering_page_section_2_body", v)}
              />
            </div>

            <MediaEdit
              id="catering_page_img_2"
              isEditing={isEditing}
              value={getDraftValue("catering_page_img_2", defaultSection2)}
              onChange={(v) => updateDraft("catering_page_img_2", v)}
              className="flex justify-center md:justify-end order-1 md:order-2"
            >
              <img
                src={getDraftValue("catering_page_img_2", defaultSection2)}
                alt="Chick Rocks catering packages and shareable platters"
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
              id="catering_page_cta_eyebrow"
              as="p"
              className="text-accent font-bold uppercase tracking-wide text-sm block"
              isEditing={isEditing}
              value={getDraftValue("catering_page_cta_eyebrow", "Ready To Order")}
              onChange={(v) => updateDraft("catering_page_cta_eyebrow", v)}
            />
            <InlineEdit
              id="catering_page_cta_heading"
              as="h2"
              className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block"
              isEditing={isEditing}
              value={getDraftValue("catering_page_cta_heading", "Let Us Rock Your Event.")}
              onChange={(v) => updateDraft("catering_page_cta_heading", v)}
            />
            <InlineEdit
              id="catering_page_cta_body"
              as="p"
              className="text-muted-foreground leading-relaxed text-lg block"
              isEditing={isEditing}
              multiline
              value={getDraftValue(
                "catering_page_cta_body",
                "Tell us your headcount, event date, and any dietary preferences — we'll put together a menu that fits. For the fastest response, call or email us directly."
              )}
              onChange={(v) => updateDraft("catering_page_cta_body", v)}
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <a
                href="mailto:catering@chickrocks.com"
                className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                <InlineEdit
                  id="catering_page_cta_primary"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue("catering_page_cta_primary", "Email Us")}
                  onChange={(v) => updateDraft("catering_page_cta_primary", v)}
                />
              </a>
              <a
                href="tel:+10000000000"
                className="inline-block bg-card border border-border text-foreground px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:border-primary hover:text-primary transition-colors"
              >
                <InlineEdit
                  id="catering_page_cta_secondary"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue("catering_page_cta_secondary", "Call Us")}
                  onChange={(v) => updateDraft("catering_page_cta_secondary", v)}
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

export default Catering;
