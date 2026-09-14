import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CarFront, 
  CalendarDays, 
  CheckCircle2, 
  ArrowLeft,
  MessageSquare,
  X,
  PlusCircle
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const navItems = [
    { name: 'Dashboard', path: '/admin', end: true, icon: LayoutDashboard },
    { name: 'Rental Cars', path: '/admin/cars', icon: CarFront },
    { name: 'Walk-in Booking', path: '/admin/bookings?new=walk-in', icon: PlusCircle },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Completed Trips', path: '/admin/completed-trips', icon: CheckCircle2 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A192F] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                SL
              </div>
              <span className="font-bold text-lg text-white">Admin Portal</span>
            </div>
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
          {navItems.map((item) => {
            const isWalkInLink = item.path.includes('?new=walk-in');
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    (isActive && !isWalkInLink) 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} className="shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
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
    </>
  );
}
