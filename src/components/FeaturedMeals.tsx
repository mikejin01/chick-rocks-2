import { Plus } from "lucide-react";
import foodPlate from "@/assets/food-plate.jpg";
import foodExtras from "@/assets/food-extras.jpg";
import foodFamily from "@/assets/food-family.jpg";

const meals = [
  { name: "3 Pieces Meal", desc: "Three pieces of fried chicken, bread, french fries, and sauce.", price: "EGP 180", badge: "Individual", img: foodPlate },
  { name: "6 Pieces Box", desc: "Six pieces of fried chicken, bread, french fries, and sauce.", price: "EGP 280", badge: "Sharing Meal", img: foodExtras },
  { name: "9 Pieces Box", desc: "Nine pieces of fried chicken, french fries, sauce and rice.", price: "EGP 380", badge: "Family Meal", img: foodFamily },
];

const FeaturedMeals = () => {
  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-foreground">Featured Meals</h2>
          <a href="#" className="text-primary font-semibold text-sm hover:underline">View Menu →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div key={meal.name} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
              <div className="relative h-52 overflow-hidden">
                <img src={meal.img} alt={meal.name} loading="lazy" width={512} height={512} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {meal.badge}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-heading text-lg uppercase text-foreground">{meal.name}</h3>
                <p className="text-sm text-muted-foreground">{meal.desc}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-primary font-bold">{meal.price}</span>
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

export default FeaturedMeals;
