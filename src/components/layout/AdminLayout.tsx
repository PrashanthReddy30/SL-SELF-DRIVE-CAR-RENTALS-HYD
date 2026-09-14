import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuthStore } from '../../store/authStore';
import { Menu } from 'lucide-react';

export default function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      {/* Mobile Header (since sidebar is hidden on md) */}
      <div className="flex-1 flex flex-col max-w-full overflow-hidden">
        <header className="md:hidden bg-secondary text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors mr-2"
            >
              <Menu size={24} />
            </button>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              SL
            </div>
            <span className="font-bold">Admin Portal</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
