import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";

const sections = [
  {
    key: "use_site",
    heading: "Use of the Site",
    body: "You agree to use this site for lawful purposes only and in a way that does not infringe the rights of others or restrict their use of the site. You may not interfere with the site's normal operation or attempt to gain unauthorized access to any part of it.",
  },
  {
    key: "orders_pricing",
    heading: "Orders and Pricing",
    body: "Menu items, pricing, and availability are subject to change without notice. We make every effort to display accurate information, but errors may occur. We reserve the right to refuse or cancel any order at our discretion.",
  },
  {
    key: "ip",
    heading: "Intellectual Property",
    body: "All content on this site, including text, images, logos, and branding, is the property of Chick Rocks or its licensors and is protected by applicable intellectual property laws. You may not reproduce or use our content without permission.",
  },
  {
    key: "disclaimers",
    heading: "Disclaimers",
    body: "This site is provided \"as is\" without warranties of any kind. We do not guarantee that the site will be uninterrupted, error-free, or secure. Your use of the site is at your own risk.",
  },
  {
    key: "liability",
    heading: "Limitation of Liability",
    body: "To the fullest extent permitted by law, Chick Rocks is not liable for any indirect, incidental, or consequential damages arising from your use of the site or any products purchased through it.",
  },
  {
    key: "changes",
    heading: "Changes",
    body: "We may update these Terms of Use from time to time. Continued use of the site after changes are posted means you accept the updated terms.",
  },
  {
    key: "contact",
    heading: "Contact",
    body: "For questions about these Terms of Use, please contact us through the information provided on our website.",
  },
];

const TermsOfUse = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Terms of Use | Chick Rocks"
        description="Terms governing use of chickrocksusa.com and Chick Rocks online ordering."
        path="/terms"
      />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <InlineEdit
          id="terms_title"
          as="h1"
          className="text-4xl font-heading text-primary mb-2 block"
          isEditing={isEditing}
          value={getDraftValue("terms_title", "Terms of Use")}
          onChange={(v) => updateDraft("terms_title", v)}
        />
        <InlineEdit
          id="terms_updated"
          as="p"
          className="text-sm text-muted-foreground mb-8 block"
          isEditing={isEditing}
          value={getDraftValue("terms_updated", "Last updated: January 1, 2026")}
          onChange={(v) => updateDraft("terms_updated", v)}
        />

        <div className="space-y-6 text-foreground text-base leading-relaxed">
          <InlineEdit
            id="terms_intro"
            as="p"
            className="block"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "terms_intro",
              "Welcome to Chick Rocks. By accessing or using our website, you agree to these Terms of Use. If you do not agree, please do not use the site."
            )}
            onChange={(v) => updateDraft("terms_intro", v)}
          />

          {sections.map((section) => {
            const headingKey = `terms_${section.key}_heading`;
            const bodyKey = `terms_${section.key}_body`;
            return (
              <section key={section.key}>
                <InlineEdit
                  id={headingKey}
                  as="h2"
                  className="text-2xl font-semibold mb-2 block"
                  isEditing={isEditing}
                  value={getDraftValue(headingKey, section.heading)}
                  onChange={(v) => updateDraft(headingKey, v)}
                />
                <InlineEdit
                  id={bodyKey}
                  as="p"
                  className="block"
                  isEditing={isEditing}
                  multiline
                  value={getDraftValue(bodyKey, section.body)}
                  onChange={(v) => updateDraft(bodyKey, v)}
                />
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
