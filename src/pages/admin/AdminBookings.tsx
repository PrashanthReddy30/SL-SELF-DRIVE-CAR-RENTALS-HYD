import { useBookingStore } from '../../store/bookingStore';
import { useFleetStore } from '../../store/fleetStore';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Save, X, Edit2, Calculator, RefreshCw, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const { bookings, updateBookingStatus, updateAdminNote, completeBooking, updateBookingDetails } = useBookingStore();
  const { cars } = useFleetStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  
  // Completion Modal State
  const [completingBooking, setCompletingBooking] = useState<string | null>(null);
  const [extraDays, setExtraDays] = useState<number | ''>(0);
  const [extraHours, setExtraHours] = useState<number | ''>(0);
  const [overrideTotal, setOverrideTotal] = useState<number | ''>('');

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
  const [walkInStartTime, setWalkInStartTime] = useState('10:00');
  const [walkInEndDate, setWalkInEndDate] = useState('');
  const [walkInEndTime, setWalkInEndTime] = useState('10:00');
  const [walkInLocation, setWalkInLocation] = useState('Office');
  const [walkInPrice, setWalkInPrice] = useState<number | ''>('');

  // Edit Booking State
  const [editingBookingObj, setEditingBookingObj] = useState<any>(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editPrice, setEditPrice] = useState<number | ''>('');
  const [editCarId, setEditCarId] = useState('');
  const [editCarNumber, setEditCarNumber] = useState('');
  const [editCalculatedDays, setEditCalculatedDays] = useState<number>(1);
  const [editCarDailyRate, setEditCarDailyRate] = useState<number>(0);
  const [editAutoPrice, setEditAutoPrice] = useState<number>(0);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  const activeBookings = bookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled');

  // Generate 12-hour AM/PM time options
  const timeOptions = Array.from({ length: 48 }).map((_, i) => {
    const hour24 = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return {
      value: `${hour24.toString().padStart(2, '0')}:${minute}`,
      label: `${hour12}:${minute} ${ampm}`
    };
  });

  // Open modal if query param is present
  useEffect(() => {
    if (searchParams.get('new') === 'walk-in') {
      setIsWalkInModalOpen(true);
      setSearchParams({}); // Clear query param after opening
    }
  }, [searchParams, setSearchParams]);

  // Auto-calculate walk-in price when dates or car changes
  useEffect(() => {
    if (walkInCarId && walkInStartDate && walkInStartTime && walkInEndDate && walkInEndTime) {
      const selectedCar = cars.find(c => c.id === walkInCarId);
      if (selectedCar) {
        const start = new Date(`${walkInStartDate}T${walkInStartTime}`);
        const end = new Date(`${walkInEndDate}T${walkInEndTime}`);
        if (end > start) {
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          setWalkInPrice(days * selectedCar.pricePerDay);
        } else {
          setWalkInPrice('');
        }
      }
    }
  }, [walkInCarId, walkInStartDate, walkInStartTime, walkInEndDate, walkInEndTime, cars]);

  const handleAddWalkInBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInCarId || !walkInStartDate || !walkInStartTime || !walkInEndDate || !walkInEndTime || walkInPrice === '') return;
    
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
      startDate: new Date(`${walkInStartDate}T${walkInStartTime}`).toISOString(),
      endDate: new Date(`${walkInEndDate}T${walkInEndTime}`).toISOString(),
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
    setWalkInStartTime('10:00');
    setWalkInEndDate('');
    setWalkInEndTime('10:00');
    setWalkInPrice('');
  };

  const calculateDurationDays = (startD: string, startT: string, endD: string, endT: string) => {
    if (!startD || !startT || !endD || !endT) return 0;
    const start = new Date(`${startD}T${startT}`);
    const end = new Date(`${endD}T${endT}`);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0;
    const diffMs = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  const openEditModal = (b: any) => {
    setEditingBookingObj(b);
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    
    const roundMinutes = (date: Date) => {
      const d = new Date(date);
      const m = d.getMinutes();
      d.setMinutes(m >= 30 ? 30 : 0);
      return d;
    };
    
    const sD = isNaN(start.getTime()) ? new Date().toISOString().split('T')[0] : start.toISOString().split('T')[0];
    const sT = isNaN(start.getTime()) ? '10:00' : roundMinutes(start).toTimeString().slice(0, 5);
    const eD = isNaN(end.getTime()) ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : end.toISOString().split('T')[0];
    const eT = isNaN(end.getTime()) ? '10:00' : roundMinutes(end).toTimeString().slice(0, 5);

    setEditStartDate(sD);
    setEditStartTime(sT);
    setEditEndDate(eD);
    setEditEndTime(eT);
    setEditCarId(b.carId);
    setEditCarNumber(b.carNumber || '');

    const days = calculateDurationDays(sD, sT, eD, eT);
    setEditCalculatedDays(days);

    const car = cars.find(c => c.id === b.carId);
    const rate = car?.pricePerDay || (days > 0 ? Math.round(b.totalPrice / days) : b.totalPrice);
    setEditCarDailyRate(rate);
    const autoPrice = days * rate;
    setEditAutoPrice(autoPrice);
    setEditPrice(b.totalPrice || autoPrice);
  };

  // Real-time automatic recalculation of duration (days) and price when dates/times or car change
  useEffect(() => {
    if (editingBookingObj && editStartDate && editStartTime && editEndDate && editEndTime) {
      const days = calculateDurationDays(editStartDate, editStartTime, editEndDate, editEndTime);
      setEditCalculatedDays(days);
      const car = cars.find(c => c.id === editCarId);
      const rate = car?.pricePerDay || editCarDailyRate || 0;
      setEditCarDailyRate(rate);
      if (days > 0) {
        const auto = days * rate;
        setEditAutoPrice(auto);
        setEditPrice(auto);
      } else {
        setEditAutoPrice(0);
      }
    }
  }, [editStartDate, editStartTime, editEndDate, editEndTime, editCarId, cars, editingBookingObj]);

  const handleEditBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookingObj || !editStartDate || !editStartTime || !editEndDate || !editEndTime || editPrice === '') return;

    const start = new Date(`${editStartDate}T${editStartTime}`);
    const end = new Date(`${editEndDate}T${editEndTime}`);

    if (end <= start) {
      toast.error('Trip End date & time must be after Start date & time.');
      return;
    }

    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const selectedCar = cars.find(c => c.id === editCarId);

    setIsSavingEdit(true);
    try {
      await updateBookingDetails(editingBookingObj.id, {
        carId: editCarId,
        carName: selectedCar?.name || editingBookingObj.carName,
        carNumber: editCarNumber,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalPrice: Number(editPrice),
        extraDays: 0,
        extraHours: 0
      });

      toast.success(`Booking dates updated! Duration: ${days} Day${days > 1 ? 's' : ''} — Total: ₹${editPrice}`);
      setEditingBookingObj(null);
    } catch (err: any) {
      console.error('Error updating booking dates:', err);
      toast.error(err.message || 'Failed to update booking dates.');
    } finally {
      setIsSavingEdit(false);
    }
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
      setOverrideTotal('');
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
    const calculatedTotal = targetBooking.totalPrice + extraCost;
    const newTotal = overrideTotal !== '' ? Number(overrideTotal) : calculatedTotal;

    completeBooking(completingBooking, days, hours, newTotal, targetCar.name, targetBooking.carNumber || targetCar.carNumber);
    
    setCompletingBooking(null);
  };

  // Calculations for modal preview
  const targetBooking = bookings.find(b => b.id === completingBooking);
  const targetCar = cars.find(c => c.id === targetBooking?.carId);
  const perDayRate = targetCar?.pricePerDay || 0;
  const hourlyRate = Math.round(perDayRate / 24);
  const currentExtraCost = (Number(extraDays || 0) * perDayRate) + (Number(extraHours || 0) * hourlyRate);
  const calculatedTotal = (targetBooking?.totalPrice || 0) + currentExtraCost;
  const displayTotal = overrideTotal !== '' ? Number(overrideTotal) : calculatedTotal;

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
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">VEHICLE NUMBER</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">OWNER</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">DATES & LOCATION</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">DURATION</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">TOTAL</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">STATUS</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">NOTES & ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {activeBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">No active bookings found.</td>
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
                    <td className="py-4 px-6 font-semibold text-secondary">
                      {cars.find(c => c.id === b.carId)?.name || 'Unknown'}
                    </td>
                    {(() => {
                      const car = cars.find(c => c.id === b.carId);
                      let ownerName = car?.owner || '-';
                      if (b.carNumber && car?.carNumbers && typeof car.carNumbers[0] !== 'string') {
                        const regObj = (car.carNumbers as any[]).find(cn => cn.number === b.carNumber);
                        if (regObj && regObj.owner) ownerName = regObj.owner;
                      }
                      return (
                        <>
                          <td className="py-4 px-6 font-mono text-gray-600">{b.carNumber || '-'}</td>
                          <td className="py-4 px-6 text-sm font-semibold text-gray-700">{ownerName}</td>
                        </>
                      );
                    })()}
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Dates & Price"
                        >
                          <Edit2 size={13} />
                        </button>
                      </div>
                      <div className="text-gray-500 text-xs mt-1">{b.pickupLocation}</div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-700">
                      {(() => {
                        const durationDiff = new Date(b.endDate).getTime() - new Date(b.startDate).getTime();
                        const days = Math.max(1, Math.ceil(durationDiff / (1000 * 60 * 60 * 24)));
                        return `${days} Day${days > 1 ? 's' : ''}`;
                      })()}
                    </td>
                    <td className="py-4 px-6 font-bold text-secondary">₹{b.totalPrice}</td>
                    <td className="py-4 px-6">
                      <select 
                        value={b.status} 
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`text-sm font-bold rounded-lg px-2 py-1 outline-none border border-transparent hover:border-gray-300 focus:border-primary ${
                          b.status === 'Confirmed' ? 'text-green-700 bg-green-50' : 
                          b.status === 'Trip Started' ? 'text-purple-700 bg-purple-50' :
                          b.status === 'Pending' ? 'text-yellow-700 bg-yellow-50' : 'text-red-700 bg-red-50'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Trip Started">Trip Started</option>
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
                          <button onClick={() => saveNote(b.id)} className="text-green-600 hover:text-green-800 p-1"><Save size={18} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-gray-600 truncate max-w-[110px]" title={b.adminNote || 'No notes'}>
                            {b.adminNote || 'No notes'}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button 
                              onClick={() => openEditModal(b)} 
                              className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors" 
                              title="Edit Dates & Price"
                            >
                              <Edit2 size={13} />
                              <span className="hidden sm:inline">Edit Dates</span>
                            </button>
                            <button 
                              onClick={() => startEditingNote(b.id, b.adminNote)} 
                              className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" 
                              title="Edit Note"
                            >
                              <MessageSquare size={15} />
                            </button>
                          </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Amount Override (Optional)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder={`₹${calculatedTotal.toLocaleString()}`}
                  value={overrideTotal} 
                  onChange={(e) => setOverrideTotal(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to use the automatically calculated total.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 mb-8 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Original Total:</span>
                <span>₹{targetBooking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-secondary text-lg">
                <span>Final Total to Save:</span>
                <span>₹{displayTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCompleteSubmit}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-md"
            >
              Complete Booking
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
                {(() => {
                  const nums = targetConfirmCar.carNumbers?.length ? targetConfirmCar.carNumbers : (targetConfirmCar.carNumber ? [{number: targetConfirmCar.carNumber, owner: '', ownerPhone: ''}] : []);
                  return nums.length > 0 ? (
                    <select 
                      value={selectedRegNumber} 
                      onChange={e => setSelectedRegNumber(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none mt-1"
                    >
                      <option value="">-- Select a Registration Number --</option>
                      {nums.map((cn, idx) => {
                        const num = typeof cn === 'string' ? cn : cn.number;
                        const owner = typeof cn === 'string' ? '' : cn.owner;
                        return (
                          <option key={idx} value={num}>{num} {owner ? `(${owner})` : ''}</option>
                        );
                      })}
                    </select>
                  ) : (
                    <span className="font-semibold text-secondary">N/A</span>
                  );
                })()}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Customer Details</span>
                <span className="font-medium text-gray-700">{targetConfirmBooking.customerName}</span>
                <span className="text-sm text-gray-500">{targetConfirmBooking.customerPhone}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                const nums = targetConfirmCar?.carNumbers?.length ? targetConfirmCar.carNumbers : (targetConfirmCar?.carNumber ? [{number: targetConfirmCar.carNumber, owner: '', ownerPhone: ''}] : []);
                if (nums.length > 0 && !selectedRegNumber) {
                  alert('Please select a registration number to assign');
                  return;
                }
                const assignedReg = selectedRegNumber || targetConfirmCar?.carNumber;
                


                updateBookingStatus(confirmingBooking, 'Confirmed', assignedReg);
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
                    {walkInCarId && (() => {
                      const selectedCar = cars.find(c => c.id === walkInCarId);
                      const nums = selectedCar?.carNumbers?.length ? selectedCar.carNumbers : (selectedCar?.carNumber ? [{number: selectedCar.carNumber, owner: ''}] : []);
                      return nums.map((cn, idx) => {
                        const num = typeof cn === 'string' ? cn : cn.number;
                        const owner = typeof cn === 'string' ? '' : cn.owner;
                        return <option key={idx} value={num}>{num} {owner ? `(${owner})` : ''}</option>;
                      });
                    })()}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                  <div className="flex gap-2">
                    <input type="date" required value={walkInStartDate} onChange={e => setWalkInStartDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                    <select required value={walkInStartTime} onChange={e => setWalkInStartTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white">
                      {timeOptions.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                  <div className="flex gap-2">
                    <input type="date" required value={walkInEndDate} onChange={e => setWalkInEndDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                    <select required value={walkInEndTime} onChange={e => setWalkInEndTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white">
                      {timeOptions.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
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

      {/* Edit Booking Dates & Total Modal */}
      {editingBookingObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingBookingObj(null)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-fade-in-up my-auto max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-secondary">Edit Trip Dates & Price</h2>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    #{editingBookingObj.id.slice(0, 8)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Customer: <strong className="text-gray-700">{editingBookingObj.customerName}</strong> • {editingBookingObj.customerPhone}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingBookingObj(null)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditBookingSubmit} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
              {/* Vehicle Selection Box */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Vehicle</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Car Model</label>
                    <select 
                      value={editCarId} 
                      onChange={e => { 
                        setEditCarId(e.target.value); 
                        setEditCarNumber(''); 
                      }} 
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white font-medium"
                    >
                      {cars.map(c => (
                        <option key={c.id} value={c.id}>{c.name} (₹{c.pricePerDay}/day)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Registration Plate</label>
                    <select 
                      value={editCarNumber} 
                      onChange={e => setEditCarNumber(e.target.value)} 
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white font-mono"
                    >
                      <option value="">-- Any Plate --</option>
                      {editCarId && (() => {
                        const selectedCar = cars.find(c => c.id === editCarId);
                        const nums = selectedCar?.carNumbers?.length 
                          ? selectedCar.carNumbers 
                          : (selectedCar?.carNumber ? [{ number: selectedCar.carNumber, owner: '' }] : []);
                        return nums.map((cn, idx) => {
                          const num = typeof cn === 'string' ? cn : cn.number;
                          const owner = typeof cn === 'string' ? '' : cn.owner;
                          return <option key={idx} value={num}>{num} {owner ? `(${owner})` : ''}</option>;
                        });
                      })()}
                    </select>
                  </div>
                </div>
              </div>

              {/* Start Date & Time */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Trip Start Date & Time</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    required 
                    value={editStartDate} 
                    onChange={e => setEditStartDate(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                  <select 
                    required 
                    value={editStartTime} 
                    onChange={e => setEditStartTime(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {timeOptions.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Date & Time */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Trip End Date & Time</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    required 
                    value={editEndDate} 
                    onChange={e => setEditEndDate(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                  <select 
                    required 
                    value={editEndTime} 
                    onChange={e => setEditEndTime(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {timeOptions.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Calculation Summary */}
              <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Calculator size={15} className="text-blue-600" />
                    Auto-Calculated Duration & Price
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200 shadow-xs">
                    {editCalculatedDays > 0 ? `${editCalculatedDays} Day${editCalculatedDays > 1 ? 's' : ''}` : 'Invalid Dates'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-blue-900">
                  <div>
                    <span className="text-blue-700/80 block text-[11px] font-medium">Daily Rate:</span>
                    <strong className="text-sm font-bold">₹{editCarDailyRate} / day</strong>
                  </div>
                  <div>
                    <span className="text-blue-700/80 block text-[11px] font-medium">Total Calculation:</span>
                    <strong className="text-sm font-bold">
                      {editCalculatedDays > 0 ? `₹${editAutoPrice} (${editCalculatedDays}d × ₹${editCarDailyRate})` : '—'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Total Price input (with manual override allowed) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">
                    Total Booking Price (INR) <span className="text-red-500">*</span>
                  </label>
                  {Number(editPrice) !== editAutoPrice && editAutoPrice > 0 && (
                    <button
                      type="button"
                      onClick={() => setEditPrice(editAutoPrice)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw size={11} /> Reset to Auto (₹{editAutoPrice})
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                  <input 
                    type="number" 
                    required 
                    value={editPrice} 
                    onChange={e => setEditPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-base outline-none font-bold text-secondary focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                    placeholder="e.g. 8000"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex-shrink-0">
                <button 
                  type="submit" 
                  disabled={isSavingEdit || editCalculatedDays <= 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {isSavingEdit ? (
                    'Saving Updates...'
                  ) : (
                    <>
                      <Check size={18} /> Update Dates & Total (₹{editPrice || 0})
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
