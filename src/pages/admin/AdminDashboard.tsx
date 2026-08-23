import { useFleetStore } from '../../store/fleetStore';
import { useBookingStore } from '../../store/bookingStore';
import { Car, CalendarDays, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { cars } = useFleetStore();
  const { bookings } = useBookingStore();

  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
  const completedTrips = bookings.filter(b => b.status === 'Completed');
  const totalRevenue = completedTrips.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const stats = [
    { title: 'Total Fleet', value: cars.length, icon: Car, color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Active Bookings', value: activeBookings, icon: CalendarDays, color: 'text-orange-500', bg: 'bg-orange-100' },
    { title: 'Completed Trips', value: completedTrips.length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold text-secondary mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-secondary mb-4">Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent bookings to show.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">ID</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Car</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Dates</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map(b => (
                  <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-500">{b.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-secondary">{cars.find(c => c.id === b.carId)?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{new Date(b.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        b.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
