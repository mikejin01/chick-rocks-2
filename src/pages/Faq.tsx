import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd } from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const faqItems = [
  {
    q: "Is everything at Chick Rocks halal?",
    a: "Yes. All of our chicken and meat products are 100% halal-certified. We hand-bread and fry every order fresh, so the whole menu — from the crispy chicken sandwiches and wings to the rice bowls, spaghetti combos and burgers — is halal-friendly.",
  },
  {
    q: "Where are your locations and what are your hours?",
    a: "We have two locations in Queens, New York: Chick Rocks Astoria at 30-02 Steinway St, Astoria, NY 11103, and Chick Rocks Flushing at 136-20 Roosevelt Ave #25, Flushing, NY 11354. Both stores serve halal fried chicken for dine-in, takeout and delivery. Please check our Google Business Profile for up-to-date daily hours.",
  },
  {
    q: "Do you offer delivery and online ordering?",
    a: "Yes. You can order online for pickup or delivery directly through our partner at chowbus, and we are also available on major delivery apps. Pickup is available at both the Astoria and Flushing Chick Rocks locations.",
  },
  {
    q: "Where does your halal chicken come from?",
    a: "We source our chicken from trusted halal-certified suppliers and hand-bread each piece in-house. Every batch is fried fresh to order so you get that signature crispy coating and juicy bite every time.",
  },
  {
    q: "Do you offer halal catering in Queens and NYC?",
    a: "Yes — halal catering is one of our specialties. We cater office lunches, meetings, parties, weddings and community events across Queens and New York City with family combos, sandwich platters, wing buckets, rice bowl bars and drinks. See our catering page for packages, or email us to get a custom quote.",
  },
  {
    q: "What is the minimum for catering and how much notice do you need?",
    a: "Catering orders typically serve groups of 10 to 200+ guests. We recommend at least 48 hours of advance notice so we can prep everything fresh. For larger events or weekend peak times, please reach out as early as possible.",
  },
  {
    q: "Do you have vegetarian, gluten-free or allergen-friendly options?",
    a: "Our menu focuses on fried chicken, so most items contain wheat, egg and dairy. We offer a few non-chicken sides and drinks, and our team is happy to flag ingredients or common allergens when you order. If you have a serious allergy, please mention it before ordering.",
  },
  {
    q: "Are your prices the same for dine-in, takeout and delivery?",
    a: "Dine-in and pickup prices are the same. Third-party delivery apps (DoorDash, Uber Eats, Grubhub, etc.) may add their own service fees and markups, so prices there can be slightly higher than ordering directly through our online ordering link.",
  },
];

const Faq = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  const faqPageLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const crumbsLd = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Halal Fried Chicken FAQ — Astoria & Flushing | Chick Rocks"
        description="Answers to common questions about Chick Rocks: halal certification, locations, hours, delivery, catering minimums, allergens and more."
        path="/faq"
        keywords="halal fried chicken faq, chick rocks halal, halal catering queens faq, halal chicken astoria"
        jsonLd={[faqPageLd, crumbsLd]}
      />
      <Navbar />

      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-4">
          <MediaEdit
            id="faq_page_hero_logo"
            isEditing={isEditing}
            value={getDraftValue("faq_page_hero_logo", `${base}logo.webp`)}
            onChange={(v) => updateDraft("faq_page_hero_logo", v)}
          >
            <img
              src={getDraftValue("faq_page_hero_logo", `${base}logo.webp`)}
              alt="Chick Rocks halal fried chicken logo"
              className="h-20 md:h-24 w-auto brightness-0 invert"
            />
          </MediaEdit>
          <InlineEdit
            id="faq_page_title"
            as="h1"
            className="text-4xl md:text-5xl font-heading tracking-wider uppercase block"
            isEditing={isEditing}
            value={getDraftValue("faq_page_title", "Halal Fried Chicken FAQ")}
            onChange={(v) => updateDraft("faq_page_title", v)}
          />
          <InlineEdit
            id="faq_page_hero_subtext"
            as="p"
            className="text-base md:text-lg opacity-90 max-w-2xl mx-auto block"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "faq_page_hero_subtext",
              "Everything you need to know about our halal fried chicken, sandwiches, catering, locations in Astoria and Flushing, and ordering."
            )}
            onChange={(v) => updateDraft("faq_page_hero_subtext", v)}
          />
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-10">
          {faqItems.map((item, index) => (
            <article key={item.q} className="border-b border-border pb-8 last:border-b-0">
              <InlineEdit
                id={`faq_q_${index + 1}`}
                as="h2"
                className="text-2xl md:text-3xl font-heading uppercase text-foreground mb-4 block"
                isEditing={isEditing}
                value={getDraftValue(`faq_q_${index + 1}`, item.q)}
                onChange={(v) => updateDraft(`faq_q_${index + 1}`, v)}
              />
              <InlineEdit
                id={`faq_a_${index + 1}`}
                as="p"
                className="text-base leading-relaxed text-muted-foreground block"
                isEditing={isEditing}
                multiline
                value={getDraftValue(`faq_a_${index + 1}`, item.a)}
                onChange={(v) => updateDraft(`faq_a_${index + 1}`, v)}
              />
            </article>
          ))}
        </div>

        <section className="mt-16 bg-cream rounded-2xl p-8 text-center space-y-4">
          <InlineEdit
            id="faq_bottom_heading"
            as="h2"
            className="text-2xl md:text-3xl font-heading uppercase text-foreground block"
            isEditing={isEditing}
            value={getDraftValue("faq_bottom_heading", "Still have a question?")}
            onChange={(v) => updateDraft("faq_bottom_heading", v)}
          />
          <InlineEdit
            id="faq_bottom_body"
            as="p"
            className="text-muted-foreground leading-relaxed block"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "faq_bottom_body",
              "Reach out about halal catering in Queens, allergens, large orders, or anything else — we're happy to help."
            )}
            onChange={(v) => updateDraft("faq_bottom_body", v)}
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="mailto:catering@chickrocks.com"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              <InlineEdit
                id="faq_bottom_cta_primary"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("faq_bottom_cta_primary", "Email Us")}
                onChange={(v) => updateDraft("faq_bottom_cta_primary", v)}
              />
            </a>
            <a
              href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-card border border-border text-foreground px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:border-primary hover:text-primary transition-colors"
            >
              <InlineEdit
                id="faq_bottom_cta_secondary"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("faq_bottom_cta_secondary", "Order Online")}
                onChange={(v) => updateDraft("faq_bottom_cta_secondary", v)}
              />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Faq;
