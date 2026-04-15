import foodAbout from "@/assets/food-about.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading uppercase leading-tight text-foreground">
              We don't do fast food.<br />
              We do good food, cooked fast.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every single morning, we hand-grind premium local steak beef. We smash it thin on a screaming hot griddle to create those iconic, crispy, caramelized edges.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our chicken? Hand-breaded in house and fried to an aggressive crunch. No shortcuts. No compromises.
            </p>
            <button className="border border-foreground text-foreground px-6 py-3 rounded-full font-semibold hover:bg-foreground hover:text-background transition-colors">
              About Us →
            </button>
          </div>
          <div className="relative">
            <img
              src={foodAbout}
              alt="Stacked Chick Rocks burger"
              loading="lazy"
              width={640}
              height={512}
              className="w-full h-auto rounded-2xl object-cover"
            />
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center text-center">
              <span className="text-xs font-bold leading-tight">100%<br />LOCAL<br />BEEF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
