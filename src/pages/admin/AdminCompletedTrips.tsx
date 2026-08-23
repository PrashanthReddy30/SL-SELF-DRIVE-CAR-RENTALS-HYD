import { useBookingStore } from '../../store/bookingStore';
import { useFleetStore } from '../../store/fleetStore';
import { Download, User, Phone } from 'lucide-react';

export default function AdminCompletedTrips() {
  const { bookings } = useBookingStore();
  const { cars } = useFleetStore();

  const completedTrips = bookings.filter(b => b.status === 'Completed');

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-8">Completed Trips Log</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">CUSTOMER</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">VEHICLE</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">TRIP DATES</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">DESTINATION</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">REVENUE</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm text-right">INVOICE</th>
              </tr>
            </thead>
            <tbody>
              {completedTrips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No completed trips found.</td>
                </tr>
              ) : (
                completedTrips.map(b => {
                  const car = cars.find(c => c.id === b.carId);
                  return (
                    <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-gray-500">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-secondary">User {b.userId.slice(0,4)}</p>
                            <a href="tel:+910000000000" className="text-xs text-primary flex items-center gap-1 hover:underline"><Phone size={10} /> +91 0000000000</a>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {car && <img src={car.imageUrl} alt={car.name} className="w-12 h-8 rounded object-cover" />}
                          <span className="font-semibold text-sm text-secondary">{car?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(b.startDate).toLocaleDateString()} &rarr; {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{b.pickupLocation}</td>
                      <td className="py-4 px-6 font-bold text-green-600">₹{b.totalPrice.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right">
                        <button className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                          <Download size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
