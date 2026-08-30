import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import Services from './pages/Services';
import Profile from './pages/Profile';
import Contact from './pages/Contact';

// Placeholder Pages
const Team = () => <div className="p-8"><h1 className="text-3xl font-bold">Team</h1></div>;
const FAQ = () => <div className="p-8"><h1 className="text-3xl font-bold">FAQ</h1></div>;

import Terms from './pages/Terms';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCompletedTrips from './pages/admin/AdminCompletedTrips';
import AdminInquiries from './pages/admin/AdminInquiries';
import { useInquiryStore } from './store/inquiryStore';
import { useBookingStore } from './store/bookingStore';

import { useAuthStore } from './store/authStore';

function App() {
  useEffect(() => {
    useInquiryStore.getState().initialize();
    useBookingStore.getState().initialize();
    useAuthStore.getState().initialize();
  }, []);
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="completed-trips" element={<AdminCompletedTrips />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="customers" element={<div className="p-8"><h1 className="text-3xl font-bold">Customers</h1></div>} />
          <Route path="settings" element={<div className="p-8"><h1 className="text-3xl font-bold">Settings</h1></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
