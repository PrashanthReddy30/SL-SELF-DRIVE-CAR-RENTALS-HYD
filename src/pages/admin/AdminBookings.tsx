import { useBookingStore } from '../../store/bookingStore';
import { useFleetStore } from '../../store/fleetStore';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Save, X } from 'lucide-react';
import { generateInvoice } from '../../utils/generateInvoice';

export default function AdminBookings() {
  const { bookings, updateBookingStatus, updateAdminNote, completeBooking } = useBookingStore();
  const { cars } = useFleetStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  
  // Completion Modal State
  const [completingBooking, setCompletingBooking] = useState<string | null>(null);
  const [extraDays, setExtraDays] = useState<number | ''>(0);
  const [extraHours, setExtraHours] = useState<number | ''>(0);

  // Confirmation Modal State
  const [confirmingBooking, setConfirmingBooking] = useState<string | null>(null);
  const [selectedRegNumber, setSelectedRegNumber] = useState('');

  // Walk-in Booking State
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInAadhaar, setWalkInAadhaar] = useState('');
  const [walkInCarId, setWalkInCarId] = useState('');
  const [walkInCarNumber, setWalkInCarNumber] = useState('');
  const [walkInStartDate, setWalkInStartDate] = useState('');
  const [walkInEndDate, setWalkInEndDate] = useState('');
  const [walkInLocation, setWalkInLocation] = useState('Office');
  const [walkInPrice, setWalkInPrice] = useState<number | ''>('');

  const activeBookings = bookings.filter(b => b.status !== 'Completed');

  // Open modal if query param is present
  useEffect(() => {
    if (searchParams.get('new') === 'walk-in') {
      setIsWalkInModalOpen(true);
      setSearchParams({}); // Clear query param after opening
    }
  }, [searchParams, setSearchParams]);

  // Auto-calculate walk-in price when dates or car changes
  useEffect(() => {
    if (walkInCarId && walkInStartDate && walkInEndDate) {
      const selectedCar = cars.find(c => c.id === walkInCarId);
      if (selectedCar) {
        const start = new Date(walkInStartDate);
        const end = new Date(walkInEndDate);
        if (end > start) {
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          setWalkInPrice(days * selectedCar.pricePerDay);
        } else {
          setWalkInPrice('');
        }
      }
    }
  }, [walkInCarId, walkInStartDate, walkInEndDate, cars]);

  const handleAddWalkInBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInCarId || !walkInStartDate || !walkInEndDate || walkInPrice === '') return;
    
    const selectedCar = cars.find(c => c.id === walkInCarId);
    if (!selectedCar) return;

    const bookingId = 'BK' + Date.now().toString().slice(-6);
    
    await useBookingStore.getState().addBooking({
      id: bookingId,
      carId: walkInCarId,
      carNumber: walkInCarNumber,
      customerName: walkInName,
      customerPhone: walkInPhone,
      aadharNumber: walkInAadhaar,
      startDate: new Date(walkInStartDate).toISOString(),
      endDate: new Date(walkInEndDate).toISOString(),
      pickupLocation: walkInLocation,
      totalPrice: Number(walkInPrice),
      status: 'Confirmed',
      source: 'walk-in',
      createdAt: new Date().toISOString()
    });

    setIsWalkInModalOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    setWalkInAadhaar('');
    setWalkInCarId('');
    setWalkInCarNumber('');
    setWalkInStartDate('');
    setWalkInEndDate('');
    setWalkInPrice('');
  };

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
    } else if (newStatus === 'Confirmed') {
      setConfirmingBooking(bookingId);
      setSelectedRegNumber('');
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

    completeBooking(completingBooking, days, hours, newTotal, targetCar.name, targetBooking.carNumber || targetCar.carNumber);
    
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

  // Variables for confirmation modal
  const targetConfirmBooking = bookings.find(b => b.id === confirmingBooking);
  const targetConfirmCar = cars.find(c => c.id === targetConfirmBooking?.carId);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Active Bookings</h1>
      </div>

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
                    <td className="py-4 px-6 font-mono text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {b.id.slice(0, 8)}
                        {b.source === 'walk-in' && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">Walk-in</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-secondary">{cars.find(c => c.id === b.carId)?.name || 'Unknown'}</span>
                        {b.carNumber && (() => {
                          const car = cars.find(c => c.id === b.carId);
                          let ownerName = '';
                          if (car?.carNumbers && typeof car.carNumbers[0] !== 'string') {
                            const regObj = (car.carNumbers as any[]).find(cn => cn.number === b.carNumber);
                            if (regObj) ownerName = regObj.owner;
                          }
                          return (
                            <span className="text-xs text-gray-500 font-mono mt-1">
                              Reg: {b.carNumber} {ownerName && <span className="text-blue-600 font-semibold ml-1">| {ownerName}</span>}
                            </span>
                          );
                        })()}
                      </div>
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

      {/* Confirmation Modal */}
      {confirmingBooking && targetConfirmBooking && targetConfirmCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setConfirmingBooking(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
            <button onClick={() => setConfirmingBooking(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-secondary mb-6">Confirm Booking</h2>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 mb-8 space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Vehicle</span>
                <span className="font-semibold text-secondary">{targetConfirmCar.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Assign Registration Number</span>
                {targetConfirmCar.carNumbers && targetConfirmCar.carNumbers.length > 0 ? (
                  <select 
                    value={selectedRegNumber} 
                    onChange={e => setSelectedRegNumber(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none mt-1"
                  >
                    <option value="">-- Select a Registration Number --</option>
                    {targetConfirmCar.carNumbers.map((cn, idx) => {
                      const num = typeof cn === 'string' ? cn : cn.number;
                      const owner = typeof cn === 'string' ? '' : cn.owner;
                      return (
                        <option key={idx} value={num}>{num} {owner ? `(${owner})` : ''}</option>
                      );
                    })}
                  </select>
                ) : (
                  <span className="font-semibold text-secondary">{targetConfirmCar.carNumber || 'N/A'}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Customer Details</span>
                <span className="font-medium text-gray-700">{targetConfirmBooking.customerName}</span>
                <span className="text-sm text-gray-500">{targetConfirmBooking.customerPhone}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (targetConfirmCar?.carNumbers?.length && !selectedRegNumber) {
                  alert('Please select a registration number to assign');
                  return;
                }
                updateBookingStatus(confirmingBooking, 'Confirmed', selectedRegNumber || targetConfirmCar.carNumber);
                setConfirmingBooking(null);
                setSelectedRegNumber('');
              }}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md"
            >
              Confirmed
            </button>
          </div>
        </div>
      )}

      {/* Walk-in Booking Modal */}
      {isWalkInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsWalkInModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-secondary">Add Walk-in Booking</h2>
              <button onClick={() => setIsWalkInModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleAddWalkInBooking} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input type="text" required value={walkInName} onChange={e => setWalkInName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" required value={walkInPhone} onChange={e => setWalkInPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number (Optional)</label>
                  <input type="text" value={walkInAadhaar} onChange={e => setWalkInAadhaar(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Car Model</label>
                  <select required value={walkInCarId} onChange={e => { setWalkInCarId(e.target.value); setWalkInCarNumber(''); }} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none bg-white">
                    <option value="">-- Choose a Car --</option>
                    {cars.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (₹{c.pricePerDay}/day)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Registration (Optional)</label>
                  <select value={walkInCarNumber} onChange={e => setWalkInCarNumber(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none bg-white">
                    <option value="">-- Choose Registration --</option>
                    {walkInCarId && cars.find(c => c.id === walkInCarId)?.carNumbers?.map((cn, idx) => {
                      const num = typeof cn === 'string' ? cn : cn.number;
                      const owner = typeof cn === 'string' ? '' : cn.owner;
                      return <option key={idx} value={num}>{num} {owner ? `(${owner})` : ''}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                  <input type="datetime-local" required value={walkInStartDate} onChange={e => setWalkInStartDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                  <input type="datetime-local" required value={walkInEndDate} onChange={e => setWalkInEndDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <input type="text" required value={walkInLocation} onChange={e => setWalkInLocation(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (₹)</label>
                  <input type="number" required value={walkInPrice} onChange={e => setWalkInPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  <p className="text-xs text-gray-500 mt-1">Auto-calculated, but can be overridden.</p>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors mt-6">
                Save Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
