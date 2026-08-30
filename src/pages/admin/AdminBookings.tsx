import { useBookingStore } from '../../store/bookingStore';
import { useFleetStore } from '../../store/fleetStore';
import { useState } from 'react';
import { MessageSquare, Save, X } from 'lucide-react';
import { generateInvoice } from '../../utils/generateInvoice';

export default function AdminBookings() {
  const { bookings, updateBookingStatus, updateAdminNote, completeBooking } = useBookingStore();
  const { cars } = useFleetStore();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  
  // Completion Modal State
  const [completingBooking, setCompletingBooking] = useState<string | null>(null);
  const [extraDays, setExtraDays] = useState<number | ''>(0);
  const [extraHours, setExtraHours] = useState<number | ''>(0);

  const activeBookings = bookings.filter(b => b.status !== 'Completed');

  const startEditingNote = (id: string, currentNote: string = '') => {
    setEditingNote(id);
    setNoteContent(currentNote);
  };

  const saveNote = (id: string) => {
    updateAdminNote(id, noteContent);
    setEditingNote(null);
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    if (newStatus === 'Completed') {
      setCompletingBooking(bookingId);
      setExtraDays(0);
      setExtraHours(0);
    } else {
      updateBookingStatus(bookingId, newStatus as any);
    }
  };

  const handleCompleteSubmit = () => {
    if (!completingBooking) return;
    const targetBooking = bookings.find(b => b.id === completingBooking);
    const targetCar = cars.find(c => c.id === targetBooking?.carId);
    if (!targetBooking || !targetCar) return;

    const days = Number(extraDays) || 0;
    const hours = Number(extraHours) || 0;
    
    const perDayRate = targetCar.pricePerDay;
    const hourlyRate = Math.round(perDayRate / 24);
    const extraCost = (days * perDayRate) + (hours * hourlyRate);
    const newTotal = targetBooking.totalPrice + extraCost;

    completeBooking(completingBooking, days, hours, newTotal);
    
    // Create a temporary updated booking object to generate the accurate invoice instantly
    const updatedBooking = { ...targetBooking, status: 'Completed' as any, extraDays: days, extraHours: hours, totalPrice: newTotal };
    generateInvoice(updatedBooking, targetCar);
    
    setCompletingBooking(null);
  };

  // Calculations for modal preview
  const targetBooking = bookings.find(b => b.id === completingBooking);
  const targetCar = cars.find(c => c.id === targetBooking?.carId);
  const perDayRate = targetCar?.pricePerDay || 0;
  const hourlyRate = Math.round(perDayRate / 24);
  const currentExtraCost = (Number(extraDays || 0) * perDayRate) + (Number(extraHours || 0) * hourlyRate);
  const calculatedTotal = (targetBooking?.totalPrice || 0) + currentExtraCost;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-8">Active Bookings</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">BOOKING ID</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">VEHICLE</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">DATES & LOCATION</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">TOTAL</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">STATUS</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">ADMIN NOTES</th>
              </tr>
            </thead>
            <tbody>
              {activeBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No active bookings found.</td>
                </tr>
              ) : (
                activeBookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-mono text-sm text-gray-500">{b.id.slice(0, 8)}</td>
                    <td className="py-4 px-6 font-semibold text-secondary">
                      {cars.find(c => c.id === b.carId)?.name || 'Unknown'}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="text-gray-700">{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</div>
                      <div className="text-gray-500 text-xs mt-1">{b.pickupLocation}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-secondary">₹{b.totalPrice}</td>
                    <td className="py-4 px-6">
                      <select 
                        value={b.status} 
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`text-sm font-bold rounded-lg px-2 py-1 outline-none border border-transparent hover:border-gray-300 focus:border-primary ${
                          b.status === 'Confirmed' ? 'text-green-700 bg-green-50' : 
                          b.status === 'Pending' ? 'text-yellow-700 bg-yellow-50' : 'text-red-700 bg-red-50'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      {editingNote === b.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={noteContent} 
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full outline-none focus:border-primary"
                          />
                          <button onClick={() => saveNote(b.id)} className="text-green-600 hover:text-green-800"><Save size={18} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <span className="text-sm text-gray-600 truncate max-w-[150px]">{b.adminNote || 'No notes'}</span>
                          <button onClick={() => startEditingNote(b.id, b.adminNote)} className="text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Completion Modal */}
      {completingBooking && targetBooking && targetCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setCompletingBooking(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
            <button onClick={() => setCompletingBooking(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-secondary mb-6">Complete Booking</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extra Days (₹{perDayRate}/day)</label>
                <input 
                  type="number" 
                  min="0"
                  value={extraDays} 
                  onChange={(e) => setExtraDays(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extra Hours (₹{hourlyRate}/hr pro-rata)</label>
                <input 
                  type="number" 
                  min="0"
                  max="23"
                  value={extraHours} 
                  onChange={(e) => setExtraHours(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 mb-8 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Original Total:</span>
                <span>₹{targetBooking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-secondary text-lg">
                <span>New Total:</span>
                <span>₹{calculatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCompleteSubmit}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-md"
            >
              Complete & Generate Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
