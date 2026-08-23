import { useBookingStore } from '../../store/bookingStore';
import { useFleetStore } from '../../store/fleetStore';
import { useState } from 'react';
import { MessageSquare, Save } from 'lucide-react';

export default function AdminBookings() {
  const { bookings, updateBookingStatus, updateAdminNote } = useBookingStore();
  const { cars } = useFleetStore();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  const activeBookings = bookings.filter(b => b.status !== 'Completed');

  const startEditingNote = (id: string, currentNote: string = '') => {
    setEditingNote(id);
    setNoteContent(currentNote);
  };

  const saveNote = (id: string) => {
    updateAdminNote(id, noteContent);
    setEditingNote(null);
  };

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
                        onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
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
    </div>
  );
}
