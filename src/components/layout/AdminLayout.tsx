import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuthStore } from '../../store/authStore';

export default function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      
      {/* Mobile Header (since sidebar is hidden on md) */}
      <div className="flex-1 flex flex-col max-w-full overflow-hidden">
        <header className="md:hidden bg-secondary text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
