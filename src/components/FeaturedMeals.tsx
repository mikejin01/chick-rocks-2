const CateringSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[600px]">
          <div className="flex justify-center md:justify-start">
            <img
              src={`${import.meta.env.BASE_URL}catering-2.png`}
              alt="Chick Rocks catering spread with buckets of fried chicken and sides"
              loading="lazy"
              className="w-full max-w-[600px] h-auto max-h-[600px] object-contain"
            />
          </div>

          <div className="max-w-lg space-y-6">
            <p className="text-accent font-bold uppercase tracking-wide text-sm">
              Party with Chick Rocks
            </p>
            <h2 className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground">
              Our Catering
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Bring the joy of our hand-breaded fried chicken and smash burgers to your next event with Chick Rocks catering. Our party packages serve 20+ guests with crowd favorites like Chickenjoy buckets, loaded fries, and fresh sides, delivered straight to your event.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Get <span className="font-bold text-foreground">$20 off</span> your first order of $200+ with code{" "}
              <span className="font-bold text-foreground">ROCKS20</span>.
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
              Order Catering
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CateringSection;
