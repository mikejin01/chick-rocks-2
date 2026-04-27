import { Link } from "react-router-dom";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const MenuCategories = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  const categories = [
    { key: "menu_cat_1", name: "Sandwiches", img: `${base}sandwich-1.webp`, slug: "burger-sandwich-combo" },
    { key: "menu_cat_2", name: "Chicken", img: `${base}hero-3.webp`, slug: "mix-chicken-combo" },
    { key: "menu_cat_3", name: "Rice Bowl", img: `${base}rice-bowls-cat.webp`, slug: "rice-bowl" },
    { key: "menu_cat_4", name: "Spaghetti", img: `${base}spaghetti.webp`, slug: "rocks-spaghetti-combo" },
    { key: "menu_cat_5", name: "Drinks", img: `${base}drink-2.webp`, slug: "beverages" },
    { key: "menu_cat_6", name: "Snacks", img: `${base}snack-1.webp`, slug: "snack" },
  ];

  return (
    <section id="menu" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <InlineEdit
          id="menu_heading"
          as="h2"
          className="text-3xl md:text-4xl font-heading text-center uppercase mb-4 text-foreground block"
          isEditing={isEditing}
          value={getDraftValue("menu_heading", "What's on the menu?")}
          onChange={(v) => updateDraft("menu_heading", v)}
        />
        <InlineEdit
          id="menu_subtext"
          as="p"
          className="text-base md:text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-12 block"
          isEditing={isEditing}
          value={getDraftValue(
            "menu_subtext",
            "Explore Chick Rocks favorites, from halal fried chicken and crispy sandwiches to rice bowls, spaghetti, drinks, and snacks."
          )}
          onChange={(v) => updateDraft("menu_subtext", v)}
        />
        <div className="flex md:grid md:grid-cols-6 gap-6 overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
          {categories.map((cat) => {
            const imgKey = `${cat.key}_img`;
            const nameKey = `${cat.key}_name`;
            return (
              <Link key={cat.key} to={`/menu#${cat.slug}`} className="flex flex-col items-center gap-3 group shrink-0 basis-1/3 snap-start md:basis-auto md:shrink">
                <MediaEdit
                  id={imgKey}
                  isEditing={isEditing}
                  value={getDraftValue(imgKey, cat.img)}
                  onChange={(v) => updateDraft(imgKey, v)}
                  className="w-[88px] h-[88px] md:w-[106px] md:h-[106px] rounded-full overflow-hidden bg-cream border-2 border-border group-hover:border-primary transition-colors"
                >
                  <img
                    src={getDraftValue(imgKey, cat.img)}
                    alt={cat.name}
                    loading="lazy"
                    width={106}
                    height={106}
                    className="w-full h-full object-cover"
                  />
                </MediaEdit>
                <InlineEdit
                  id={nameKey}
                  as="span"
                  className="text-sm font-medium text-foreground"
                  isEditing={isEditing}
                  value={getDraftValue(nameKey, cat.name)}
                  onChange={(v) => updateDraft(nameKey, v)}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MenuCategories;
