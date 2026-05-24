import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import AdminTopbar from '../../components/AdminTopbar.jsx';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminTopbar />
      <div className="lg:flex">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
