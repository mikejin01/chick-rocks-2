import { MapPin, User, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Chick Rocks" className="h-12 w-auto" />
              <h1 className="text-2xl font-heading text-primary tracking-wider">CHICK ROCKS</h1>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Flushing, NY</span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Astoria, NY</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#" className="text-primary">Home</a>
            <a href="#menu" className="text-foreground hover:text-primary transition-colors">Menu</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Offers</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About Us</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm font-semibold text-foreground">EGP 1,530</span>
            <button className="relative text-primary">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </button>
            <button className="text-foreground">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
