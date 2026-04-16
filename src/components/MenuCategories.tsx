const foodSandwich = `${import.meta.env.BASE_URL}sandwich-1.jpg`;
const foodPlate = `${import.meta.env.BASE_URL}Rice Bowls.avif`;
const foodDrinks = `${import.meta.env.BASE_URL}drink-2.jpg`;
const foodBurger = `${import.meta.env.BASE_URL}hero-3.png`;
const foodExtras = `${import.meta.env.BASE_URL}spaghetti.jpg`;
const foodSides = `${import.meta.env.BASE_URL}snack-1.jpg`;

const categories = [
  { name: "Sandwiches", img: foodSandwich },
  { name: "Chicken", img: foodBurger },
  { name: "Rice Bowl", img: foodPlate },
  { name: "Spaghetti", img: foodExtras },
  { name: "Drinks", img: foodDrinks },
  { name: "Sides", img: foodSides },
];

const MenuCategories = () => {
  return (
    <section id="menu" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading text-center uppercase mb-12 text-foreground">
          What's on the menu?
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <button key={cat.name} className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-cream border-2 border-border group-hover:border-primary transition-colors">
                <img src={cat.img} alt={cat.name} loading="lazy" width={96} height={96} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium text-foreground">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuCategories;
