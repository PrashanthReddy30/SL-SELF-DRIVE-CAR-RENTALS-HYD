import { ArrowRight, ShieldCheck, FileText, AlertCircle, Fuel, XOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4 tracking-tight">Terms & Conditions</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Please read these important terms and conditions carefully before renting a self-drive car with us.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-bold text-secondary">Driver Eligibility & License</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                The driver must be at least 21 or 23 years old (depending on the vehicle class) and must hold a valid, original Driving License (DL).
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={24} />
                </div>
                <h2 className="text-2xl font-bold text-secondary">Identity Proofs</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                Original Aadhaar Card and Driving License must be submitted or presented for verification at the time of booking.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-xl">₹</span>
                </div>
                <h2 className="text-2xl font-bold text-secondary">Security Deposit</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                A refundable security deposit amount must be paid while taking delivery of the car, which is returned once the car is safely handed back.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={24} />
                </div>
                <h2 className="text-2xl font-bold text-secondary">Kilometer Limit</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                There is a daily or trip-wise kilometer limit. Crossing that limit will incur extra per-kilometer charges.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Fuel size={24} />
                </div>
                <h2 className="text-2xl font-bold text-secondary">Fuel Policy</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                Usually, the fuel level given at pickup should be maintained when returning the car (Full-to-Full policy).
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <XOctagon size={24} />
                </div>
                <h2 className="text-2xl font-bold text-secondary">Prohibitions</h2>
              </div>
              <ul className="text-gray-600 leading-relaxed pl-14 list-disc space-y-2">
                <li>Smoking and consuming alcohol inside the car are strictly prohibited.</li>
                <li>Racing, stunts, or driving on unauthorized rough terrain are not allowed.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={24} />
                </div>
                <h2 className="text-2xl font-bold text-secondary">Damages & Traffic Fines</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                Traffic challans (over-speeding, red light violations) and parking fines incurred during the rental period must be borne solely by the customer. In case of major damage, expenses not covered by insurance must be paid.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={24} />
                </div>
                <h2 className="text-2xl font-bold text-secondary">Cancellation Policy</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                Outlines the refund rules and charges applicable if a booking is cancelled before the trip.
              </p>
            </section>

          </div>
          
          <div className="bg-gray-50 p-8 text-center border-t border-gray-100">
            <Link to="/" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-hover transition-colors shadow-sm">
              Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
