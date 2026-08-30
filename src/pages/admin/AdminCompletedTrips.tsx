import { useBookingStore } from '../../store/bookingStore';
import { useFleetStore } from '../../store/fleetStore';
import { Download, User, Phone, FileSpreadsheet } from 'lucide-react';
import { generateInvoice } from '../../utils/generateInvoice';
import { useState } from 'react';

export default function AdminCompletedTrips() {
  const { bookings } = useBookingStore();
  const { cars } = useFleetStore();
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const completedTrips = bookings.filter(b => b.status === 'Completed');

  const filteredTrips = completedTrips.filter(b => {
    if (!filterStartDate && !filterEndDate) return true;
    
    const tripDate = new Date(b.endDate).getTime();
    const start = filterStartDate ? new Date(filterStartDate).getTime() : 0;
    
    // If end date is selected, set it to the end of that day (23:59:59) to include all trips on that day
    const end = filterEndDate ? new Date(filterEndDate).getTime() + (24 * 60 * 60 * 1000) - 1 : Infinity;

    return tripDate >= start && tripDate <= end;
  });

  const handleDownloadReport = () => {
    if (filteredTrips.length === 0) {
      alert('No trips found for this month.');
      return;
    }

    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Aadhaar', 'Vehicle', 'Start Date', 'End Date', 'Location', 'Total Revenue', 'Extra Days', 'Extra Hours'];
    const csvData = filteredTrips.map(b => {
      const car = cars.find(c => c.id === b.carId);
      return [
        b.id,
        `"${b.customerName}"`,
        b.customerPhone,
        b.aadharNumber || '',
        `"${car?.name || 'Unknown'}"`,
        new Date(b.startDate).toLocaleDateString(),
        new Date(b.endDate).toLocaleDateString(),
        `"${b.pickupLocation}"`,
        b.totalPrice,
        b.extraDays || 0,
        b.extraHours || 0
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const dateStr = (filterStartDate && filterEndDate) ? `${filterStartDate}_to_${filterEndDate}` : 'All';
    link.download = `SL_Trips_Report_${dateStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Completed Trips Log</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">From</span>
            <input 
              type="date" 
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">To</span>
            <input 
              type="date" 
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button 
            onClick={handleDownloadReport}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm w-full sm:w-auto"
          >
            <FileSpreadsheet size={18} />
            Export CSV
          </button>
        </div>
      </div>

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
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No completed trips found.</td>
                </tr>
              ) : (
                filteredTrips.map(b => {
                  const car = cars.find(c => c.id === b.carId);
                  return (
                    <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-gray-500">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-secondary">{b.customerName}</p>
                            <a href={`tel:${b.customerPhone}`} className="text-xs text-primary flex items-center gap-1 hover:underline"><Phone size={10} /> {b.customerPhone}</a>
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
                        <button 
                          onClick={() => generateInvoice(b, car)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
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
