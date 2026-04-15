import foodLifestyle from "@/assets/food-lifestyle.jpg";
import foodChickenClose from "@/assets/food-chicken-close.jpg";
import foodDelivery from "@/assets/food-delivery.jpg";

const cards = [
  { title: "Eat with focus (or friends)", desc: "Dine in private by yourself. Or share a family box in real-time. The choice is always yours.", img: foodLifestyle },
  { title: "Every bite perfect", desc: "Enjoy from starters to crispy chicken with a flavor like no other.", img: foodChickenClose, highlight: true },
  { title: "Zero to done", desc: "Faster food with optimized delivery, local branches and easy ordering.", img: foodDelivery },
];

const FlavorSection = () => {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading uppercase mb-3 text-foreground">Flavor without distractions</h2>
        <p className="text-muted-foreground max-w-xl mb-10">
          Focused ingredients, a simple menu, and infinite crunch. Zero shortcuts.
          We made burgers for you and your cravings. Not for the freezer, microwaves, or bean counters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl overflow-hidden relative group ${card.highlight ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="h-64 overflow-hidden">
                <img src={card.img} alt={card.title} loading="lazy" width={640} height={512} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-heading text-lg uppercase text-card">{card.title}</h3>
                <p className="text-sm text-card/80 mt-1">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlavorSection;
