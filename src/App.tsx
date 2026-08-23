import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import Services from './pages/Services';
import Profile from './pages/Profile';

// Placeholder Pages
const Team = () => <div className="p-8"><h1 className="text-3xl font-bold">Team</h1></div>;
const FAQ = () => <div className="p-8"><h1 className="text-3xl font-bold">FAQ</h1></div>;
const Contact = () => <div className="p-8"><h1 className="text-3xl font-bold">Contact</h1></div>;

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCompletedTrips from './pages/admin/AdminCompletedTrips';

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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="completed-trips" element={<AdminCompletedTrips />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
