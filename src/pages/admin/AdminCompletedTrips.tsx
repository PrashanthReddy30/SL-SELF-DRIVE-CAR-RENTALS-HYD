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
  const [filterOwner, setFilterOwner] = useState('');
  const [commissionPct, setCommissionPct] = useState<number>(30); // Admin commission percentage

  const uniqueOwners = Array.from(new Set(cars.flatMap(c => 
    c.carNumbers?.map(cn => typeof cn === 'string' ? '' : cn.owner).filter(Boolean) || []
  )));

  const completedTrips = bookings.filter(b => b.status === 'Completed');

  const filteredTrips = completedTrips.filter(b => {
    // Date filter
    const tripDate = new Date(b.endDate).getTime();
    if (filterStartDate && tripDate < new Date(filterStartDate).getTime()) return false;
    if (filterEndDate && tripDate > new Date(filterEndDate).getTime() + 86399999) return false;

    // Owner filter
    if (filterOwner) {
      const car = cars.find(c => c.id === b.carId);
      const carNumber = b.carNumber || car?.carNumber;
      let ownerName = '';
      if (car?.carNumbers && typeof car.carNumbers[0] !== 'string') {
        const regObj = (car.carNumbers as any[]).find(cn => cn.number === carNumber);
        if (regObj) ownerName = regObj.owner;
      }
      if (ownerName.toLowerCase() !== filterOwner.toLowerCase()) return false;
    }

    return true;
  });

  const totalRevenue = filteredTrips.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const adminCommission = (totalRevenue * commissionPct) / 100;
  const ownerPayout = totalRevenue - adminCommission;

  const handleDownloadReport = () => {
    if (filteredTrips.length === 0) {
      alert('No trips found for this month.');
      return;
    }

    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Aadhaar', 'Vehicle', 'Start Date', 'End Date', 'Location', 'Total Revenue', 'Extra Days', 'Extra Hours'];
    const csvData = filteredTrips.map(b => {
      const car = cars.find(c => c.id === b.carId);
      const carName = b.carName || car?.name || 'Unknown';
      const carNumber = b.carNumber || car?.carNumber;
      let ownerName = '';
      if (car?.carNumbers && typeof car.carNumbers[0] !== 'string') {
        const regObj = (car.carNumbers as any[]).find(cn => cn.number === carNumber);
        if (regObj) ownerName = regObj.owner;
      }
      const carDisplayName = carNumber ? `${carName} - ${carNumber}${ownerName ? ` (${ownerName})` : ''}` : carName;
      return [
        b.id,
        `"${b.customerName}"`,
        b.customerPhone,
        b.aadharNumber || '',
        `"${carDisplayName}"`,
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
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-wrap justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Owner</span>
            <select 
              value={filterOwner} 
              onChange={(e) => setFilterOwner(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white"
            >
              <option value="">All Owners</option>
              {uniqueOwners.map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
          </div>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Completed Trips</span>
          <span className="text-3xl font-bold text-secondary">{filteredTrips.length}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-green-600"><FileSpreadsheet size={48} /></div>
          <span className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-2">Total Revenue</span>
          <span className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</span>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-600"><User size={48} /></div>
          <div className="flex justify-between items-center mb-2 relative z-10">
            <span className="text-sm font-semibold text-blue-800 uppercase tracking-wider">Owner Payout</span>
            <div className="flex items-center gap-2 bg-white/50 px-2 py-1 rounded-md">
              <span className="text-xs text-blue-800 font-medium">Admin Comm %</span>
              <input 
                type="number" 
                value={commissionPct} 
                onChange={(e) => setCommissionPct(Number(e.target.value))}
                className="w-14 border border-blue-200 rounded px-1 py-0.5 text-xs outline-none bg-white text-blue-900" 
              />
            </div>
          </div>
          <span className="text-3xl font-bold text-blue-700 relative z-10">₹{ownerPayout.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">CUSTOMER</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">VEHICLE</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">VEHICLE NUMBER</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">OWNER</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">TRIP DATES</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">DESTINATION</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">REVENUE</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm text-right">INVOICE</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">No completed trips found.</td>
                </tr>
              ) : (
                filteredTrips.map(b => {
                  const car = cars.find(c => c.id === b.carId);
                  const carName = b.carName || car?.name || 'Unknown';
                  const carNumber = b.carNumber || car?.carNumber;
                  let ownerName = '';
                  if (car?.carNumbers && typeof car.carNumbers[0] !== 'string') {
                    const regObj = (car.carNumbers as any[]).find(cn => cn.number === carNumber);
                    if (regObj) ownerName = regObj.owner;
                  }
                  
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
                          <span className="font-semibold text-sm text-secondary">{carName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-gray-600">
                        {carNumber || '-'}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-700">
                        {ownerName || '-'}
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
