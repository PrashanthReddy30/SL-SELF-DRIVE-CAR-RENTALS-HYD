import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { useFleetStore } from '../store/fleetStore';
import { ArrowLeft, UserCircle, LogOut, Phone, Mail, MapPin } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { bookings } = useBookingStore();
  const { cars } = useFleetStore();
  
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  const userBookings = bookings.filter(b => b.userId === user.id);
  const filteredBookings = activeTab === 'All' ? userBookings : userBookings.filter(b => b.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/fleet" className="text-primary font-bold hover:text-primary-hover flex items-center gap-2 mb-6">
            <ArrowLeft size={18} /> Browse Cars
          </Link>
          <h1 className="text-3xl font-bold text-secondary">My Profile & Bookings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* User Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex flex-col items-center text-center mb-6">
                <UserCircle size={80} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-secondary">{user.name}</h2>
                <p className="text-sm font-bold text-primary uppercase tracking-wider">{user.role}</p>
              </div>
              
              <div className="space-y-4 mb-8 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={18} className="text-gray-400" />
                  <span>{user.mobile}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={18} className="text-gray-400" />
                  <span>{user.email}</span>
                </div>
              </div>

              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="flex overflow-x-auto border-b border-gray-100">
                {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors relative ${
                      activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* Booking List */}
              <div className="p-6 space-y-6">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No bookings found in this category.</p>
                  </div>
                ) : (
                  filteredBookings.map(booking => {
                    const car = cars.find(c => c.id === booking.carId);
                    if (!car) return null;

                    return (
                      <div key={booking.id} className="border border-gray-100 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow bg-slate-50">
                        {/* Car Image */}
                        <div className="w-full md:w-48 h-32 bg-white rounded-xl overflow-hidden shrink-0">
                          <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-secondary">{car.name}</h3>
                              <p className="text-sm text-gray-500 font-medium">{new Date(booking.startDate).toLocaleDateString()} &rarr; {new Date(booking.endDate).toLocaleDateString()}</p>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                                <MapPin size={14} /> {booking.pickupLocation}
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                              <p className="text-xl font-bold text-secondary mt-2">₹{booking.totalPrice.toLocaleString()}</p>
                            </div>
                          </div>

                          {booking.adminNote && (
                            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-sm text-orange-800">
                              <span className="font-bold">Admin Note:</span> {booking.adminNote}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
