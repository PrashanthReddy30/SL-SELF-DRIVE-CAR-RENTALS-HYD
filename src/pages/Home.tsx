import Hero from '../components/home/Hero';
import ServicesSection from '../components/home/ServicesSection';
import FleetSection from '../components/home/FleetSection';
import TeamFAQSection from '../components/home/TeamFAQSection';

export default function Home() {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <FleetSection />
      <TeamFAQSection />
    </div>
  );
}
