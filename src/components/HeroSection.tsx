const HeroSection = () => {
  return (
    <section className="bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-heading uppercase leading-tight text-foreground">
              Chick Rocks perfection,<br />
              cooked fast,<br />
              delivered to you.
            </h2>
            <p className="text-muted-foreground max-w-md">
              Experience our signature burgers, plates, and sides. Order direct for the fastest delivery and tastiest food.
            </p>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Explore Menu
            </button>
          </div>
          <div className="relative">
            <img
              src={`${import.meta.env.BASE_URL}store-front.avif`}
              alt="Chick Rocks store front"
              width={1024}
              height={768}
              className="w-full h-auto rounded-2xl object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-7xl md:text-9xl font-heading text-primary opacity-20 rotate-[-10deg] select-none">
                TASTY..
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
