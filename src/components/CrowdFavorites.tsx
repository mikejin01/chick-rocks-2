import { Plus } from "lucide-react";

const favorites = [
  { name: "Halal Fried Chicken", desc: "Crispy double smash patties with melted cheddar, caramelized onions and signature sauce.", price: "EGP 180", img: "/Halal Fried Chicken.avif" },
  { name: "Rice Bowls", desc: "Crispy double smash patties with melted cheddar, caramelized onions and signature sauce.", price: "EGP 150", img: "/Rice Bowls.avif" },
  { name: "Crawfish Sandwich", desc: "Thick local steak patty topped with Sriracha mayo, fresh jalapeños, and crisp pickles.", price: "EGP 165", img: "/Crawfish Sandwich.avif" },
  { name: "Chicken Burger", desc: "Fried chicken slider topped with hot honey sriracha and creamy slaw on a toasted bun.", price: "EGP 150", img: "/Chicken Burger.avif" },
];

const CrowdFavorites = () => {
  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-foreground">Crowd Favorites</h2>
          <a href="#" className="text-primary font-semibold text-sm hover:underline">View Menu →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div key={item.name} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img src={item.img} alt={item.name} loading="lazy" width={512} height={512} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-heading text-lg uppercase text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-primary font-bold">{item.price}</span>
                  <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CrowdFavorites;
