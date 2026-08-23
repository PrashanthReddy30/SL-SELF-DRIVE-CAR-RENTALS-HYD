import ServicesSection from '../components/home/ServicesSection';

export default function Services() {
  return (
    <div className="pt-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
        <h1 className="text-4xl font-bold text-secondary mb-4">Premium Services</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          We go beyond just renting cars. Explore our comprehensive range of mobility solutions designed for your comfort and convenience.
        </p>
      </div>
      <ServicesSection />
    </div>
  );
}
