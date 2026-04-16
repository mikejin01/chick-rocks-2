import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuCategories from "@/components/MenuCategories";
import CrowdFavorites from "@/components/CrowdFavorites";
import FeaturedMeals from "@/components/FeaturedMeals";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MenuCategories />
      <CrowdFavorites />
      <FeaturedMeals />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
