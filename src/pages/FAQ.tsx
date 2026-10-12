import { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Booking & Documents',
    question: 'What documents are required to rent a self-drive car in Hyderabad?',
    answer: 'You need a valid original Driving License (held for at least 1 year) and an Aadhaar Card or Passport for identity and address verification. Upload or present clear copies during the booking confirmation.',
  },
  {
    category: 'Booking & Documents',
    question: 'What is the minimum age to rent a self-drive car with SL Rentals?',
    answer: 'The minimum age requirement is 21 years for hatchbacks and compact sedans, and 23 years for SUVs (like Scorpio, Thar, and Innova Crysta). A valid driving license is mandatory.',
  },
  {
    category: 'Pricing & Deposits',
    question: 'Is there a security deposit, and when is it refunded?',
    answer: 'Yes, a nominal refundable security deposit (starting at ₹3,000 depending on the vehicle class) is collected before handover. The deposit is refunded back to your bank account or UPI within 24 to 48 hours of vehicle return, after fastag and challan checks.',
  },
  {
    category: 'Pricing & Deposits',
    question: 'Is fuel included in the rental charges?',
    answer: 'All our rentals follow a fair "Fuel Excluded" or "Same-to-Same" policy. The car is handed over with a designated fuel level, and you simply return it with the same level. You only pay for the fuel you actually consume.',
  },
  {
    category: 'Delivery & Locations',
    question: 'Do you offer doorstep car delivery in Hyderabad?',
    answer: 'Yes! We provide 24/7 doorstep delivery and pickup across Hyderabad including Hitec City, Gachibowli, Madhapur, Kondapur, Kukatpally, Secunderabad, Nagaram, and ECIL. Nominal delivery charges may apply based on distance.',
  },
  {
    category: 'Delivery & Locations',
    question: 'Can I pick up or return the car at Rajiv Gandhi International Airport (RGIA Shamshabad)?',
    answer: 'Yes, we provide specialized airport car delivery and pickup service right at Shamshabad RGIA terminal parking. Book in advance with your flight timings and our team will have the car ready when you land.',
  },
  {
    category: 'Travel & Trips',
    question: 'Can I take the self-drive car outstation outside Hyderabad or Telangana?',
    answer: 'Yes, all our cars come with all-India permits. You can drive freely to popular destinations like Goa, Srisailam, Tirupati, Bangalore, Vijayawada, or Pune. State border entry taxes and highway tolls are borne by the customer.',
  },
  {
    category: 'Travel & Trips',
    question: 'What is the daily kilometer limit, and are there extra km charges?',
    answer: 'Standard rental plans include a generous daily allowance (typically 300 km/day or flexible packages). Any additional kilometers driven are billed at a transparent per-km rate (₹8 to ₹14/km depending on vehicle category).',
  },
  {
    category: 'Safety & Support',
    question: 'What should I do in case of a breakdown or roadside emergency?',
    answer: 'We provide 24/7 roadside assistance across Hyderabad and Telangana highway corridors. Simply call our dedicated support hotline at +91 8106698859 and our technical team or RSA partner will assist you promptly.',
  },
  {
    category: 'Safety & Support',
    question: 'What is the speed limit policy for self-drive rental cars?',
    answer: 'In accordance with Telangana and National Highway road safety regulations, all commercial passenger self-drive vehicles are speed governed at 80 km/h or 100 km/h. Please respect all local traffic laws to avoid government camera challans.',
  },
  {
    category: 'Booking & Documents',
    question: 'Can I extend my booking period during an ongoing trip?',
    answer: 'Yes, extensions are permitted subject to vehicle availability and prior notice. Please contact admin support via WhatsApp or phone at least 4 to 6 hours before your scheduled drop-off time.',
  },
  {
    category: 'Safety & Support',
    question: 'What is your cancellation and refund policy?',
    answer: 'Cancellations made 24 hours prior to the scheduled pickup time receive a full refund minus nominal processing charges. Review our full terms page or contact support for trip adjustments.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Booking & Documents', 'Pricing & Deposits', 'Delivery & Locations', 'Travel & Trips', 'Safety & Support'];

  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured Data Schema for FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="pt-8 bg-slate-50 min-h-screen">
      <SEO
        title="Frequently Asked Questions (FAQ) | SL Self Drive Car Rentals Hyderabad"
        description="Got questions about renting a self-drive car in Hyderabad? Find answers on documents required, security deposits, fuel policy, airport delivery, outstation trips, and 24/7 RSA."
        canonical="/faq"
        keywords="car rental faq hyderabad, documents for self drive car hyderabad, security deposit car rental hyderabad, outstation car rental permission hyderabad"
        schema={faqSchema}
      />

      {/* Header Banner */}
      <section className="bg-white border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary font-semibold text-sm rounded-full mb-4">
            <HelpCircle size={16} />
            Got Questions? We Have Answers
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-secondary mb-4 tracking-tight">
            Frequently Asked Questions — SL Self Drive Car Rentals
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Everything you need to know about booking, security deposits, doorstep delivery, and rental guidelines in Hyderabad.
          </p>
        </div>
      </section>

      {/* Main FAQ Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white text-gray-600 hover:text-secondary border border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-secondary text-lg pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-primary text-white rotate-180' : 'bg-slate-100 text-gray-500'
                    }`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 md:px-6 pb-6 pt-1 text-gray-600 leading-relaxed border-t border-slate-100 text-base">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Links & Local Help Banner */}
        <div className="mt-16 bg-gradient-to-br from-secondary to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Still have questions?</span>
              <h2 className="text-2xl md:text-3xl font-black mt-2 mb-4">Talk Directly to Our Hyderabad Team</h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Our customer care representatives are available 24/7 to guide you with car availability, pricing estimates, and custom rental packages.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+918106698859"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-md"
                >
                  <PhoneCall size={18} />
                  +91 8106698859
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-slate-800 text-slate-200 font-bold px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
                >
                  Send Inquiry
                </Link>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <h3 className="font-bold text-lg text-white">Helpful Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/fleet" className="flex items-center justify-between text-slate-300 hover:text-primary transition-colors">
                    <span className="flex items-center gap-2"><ArrowRight size={14} className="text-primary" /> View Complete Fleet & Daily Rates</span>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded">Cars</span>
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="flex items-center justify-between text-slate-300 hover:text-primary transition-colors">
                    <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> Doorstep & Airport Delivery Services</span>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded">Services</span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="flex items-center justify-between text-slate-300 hover:text-primary transition-colors">
                    <span className="flex items-center gap-2"><FileText size={14} className="text-primary" /> Rental Policies & Security Deposit Rules</span>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded">Terms</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
