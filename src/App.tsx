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

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFleet from './pages/admin/AdminFleet';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCompletedTrips from './pages/admin/AdminCompletedTrips';
import AdminInquiries from './pages/admin/AdminInquiries';

function App() {
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
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="fleet" element={<AdminFleet />} />
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
