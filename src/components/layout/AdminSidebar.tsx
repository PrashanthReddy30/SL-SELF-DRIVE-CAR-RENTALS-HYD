import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CarFront, 
  CalendarDays, 
  CheckCircle2, 
  ArrowLeft,
  MessageSquare
} from 'lucide-react';

export default function AdminSidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/admin', end: true, icon: LayoutDashboard },
    { name: 'Rental Cars', path: '/admin/cars', icon: CarFront },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Completed Trips', path: '/admin/completed-trips', icon: CheckCircle2 },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-[#0A192F] min-h-screen text-slate-300 flex flex-col hidden md:flex border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            SL
          </div>
          <span className="font-bold text-lg text-white">Admin Portal</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={20} className="shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <NavLink 
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <ArrowLeft size={20} />
          Back to Site
        </NavLink>
      </div>
    </aside>
  );
}
