import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

const Layout = () => (
  <div className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 text-slate-900 pb-24 md:pb-0">
    <Navbar />
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Outlet />
    </main>
    <BottomNav />
    <Footer />
  </div>
);

export default Layout;
