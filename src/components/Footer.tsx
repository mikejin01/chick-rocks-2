const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="checkered-border h-2" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-3xl font-heading text-primary mb-4">CRAFTED</h3>
            <p className="text-sm opacity-70">Burger & Fried Chicken</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Home</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">About Us</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Menu</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Burgers</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Plates</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Sides</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Extras</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Drinks</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Location & Hours</h4>
            <div className="text-sm opacity-70 space-y-2">
              <p>22 - El Horya Street,<br />Heliopolis, Cairo</p>
              <p>Mon – Fri: 7 AM – 6 PM</p>
              <p>Sat: 8 AM – 4 PM</p>
            </div>
          </div>
        </div>
        <div className="border-t border-background/20 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm opacity-60">
          <p>© Copyright Crafted Inc. 2026</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy policy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms of use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
