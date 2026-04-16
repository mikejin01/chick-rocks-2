import foodChickenClose from "@/assets/food-chicken-close.jpg";
import foodBurger from "@/assets/food-burger.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[600px]">
          <div className="max-w-lg space-y-6 order-2 md:order-1">
            <p className="text-accent font-bold uppercase tracking-wide text-sm">
              Earn With Chick Rocks
            </p>
            <h2 className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground">
              Chick Rocks Rewards
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you love Chick Rocks, sign up to become a Chick Rocks Rewards member. Every dollar you spend earns you points toward free Chick Rocks food. You can also login online or on the Chick Rocks App to score offers on crunchy deals.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Get <span className="font-bold text-foreground">100 bonus points</span> when you join with code{" "}
              <span className="font-bold text-foreground">HATCH100</span>.
            </p>
            <div>
              <a
                href="#"
                className="inline-block text-accent font-bold uppercase tracking-wide text-sm border-b-2 border-accent pb-1 hover:opacity-80 transition-opacity"
              >
                Learn More
              </a>
            </div>
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity">
              Sign Up
            </button>
          </div>

          <div className="relative flex justify-center order-1 md:order-2">
            <div className="relative w-[280px] h-[580px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-2xl z-10" />
              <div className="w-full h-full bg-background rounded-[2.3rem] overflow-hidden flex flex-col">
                <div className="bg-primary text-primary-foreground px-5 pt-8 pb-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-3">
                    <span>2:50</span>
                    <span>•••</span>
                  </div>
                  <p className="font-heading text-2xl uppercase tracking-wide">Rewards</p>
                </div>

                <div className="px-4 pt-4">
                  <div className="flex bg-muted rounded-full p-1 text-xs font-bold">
                    <div className="flex-1 text-center py-2 bg-background text-foreground rounded-full shadow-sm">
                      Offers
                    </div>
                    <div className="flex-1 text-center py-2 text-muted-foreground">
                      Rewards
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4">
                  <div className="bg-card border border-border rounded-xl p-2 flex flex-col items-center">
                    <div className="w-full h-20 rounded-lg overflow-hidden mb-2">
                      <img src={foodChickenClose} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-bold text-foreground text-center leading-tight">
                      Free 3pc Tenders
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-3 h-3 bg-primary rounded-full text-[7px] text-primary-foreground flex items-center justify-center font-bold">
                        C
                      </span>
                      <span className="text-[9px] font-semibold text-foreground">250 PTS</span>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-2 flex flex-col items-center">
                    <div className="w-full h-20 rounded-lg overflow-hidden mb-2">
                      <img src={foodBurger} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-bold text-foreground text-center leading-tight">
                      Smash Burger
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-3 h-3 bg-primary rounded-full text-[7px] text-primary-foreground flex items-center justify-center font-bold">
                        C
                      </span>
                      <span className="text-[9px] font-semibold text-foreground">500 PTS</span>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-2 flex flex-col items-center col-span-2">
                    <p className="text-[10px] font-bold text-foreground text-center">
                      $5 off $25 Order
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-3 h-3 bg-primary rounded-full text-[7px] text-primary-foreground flex items-center justify-center font-bold">
                        C
                      </span>
                      <span className="text-[9px] font-semibold text-foreground">750 PTS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
