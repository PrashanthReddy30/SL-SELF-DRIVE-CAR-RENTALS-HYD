import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import ServicesSection from '../components/home/ServicesSection';
import FleetSection from '../components/home/FleetSection';
import HyderabadLocations from '../components/home/HyderabadLocations';
import TeamFAQSection from '../components/home/TeamFAQSection';

export default function Home() {
  return (
    <main>
      <SEO 
        title="SL Self Drive Car Rentals Hyderabad | Best Self Drive Cars in Hyderabad"
        description="Book top-rated self drive car rentals in Hyderabad starting @ ₹1,800/day. Choose from sanitized SUVs, Sedans, Hatchbacks & 7-seaters with doorstep delivery, easy documentation & zero hidden fees. Call 8106698859!"
        canonicalPath="/"
        keywords="self drive car rentals in hyderabad, self drive cars hyderabad, car rentals hyderabad, sl self drive car rentals, best car rental in hyderabad, hyderabad airport car rental, rent a car hyderabad"
      />
      <Hero />
      <ServicesSection />
      <FleetSection />
      <HyderabadLocations />
      <TeamFAQSection />
    </main>
  );
}
