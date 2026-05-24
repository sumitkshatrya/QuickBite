import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="mt-16 border-t border-slate-200 bg-slate-950 py-10 text-slate-300">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
      <div>
        <Link to="/" className="text-2xl font-semibold text-white">
          QuickBite
        </Link>
        <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">
          Premium food delivery experiences with fresh cuisine, curated menus, and fast doorstep service.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
          <span>support@quickbite.com</span>
          <span className="hidden sm:inline">•</span>
          <span>+1 (800) 123-4567</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Explore</h3>
        <ul className="mt-5 space-y-3 text-sm">
          <li><Link to="/" className="transition hover:text-white">Home</Link></li>
          <li><Link to="/restaurants" className="transition hover:text-white">Restaurants</Link></li>
          <li><Link to="/dashboard" className="transition hover:text-white">Orders</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Legal</h3>
        <ul className="mt-5 space-y-3 text-sm">
          <li><Link to="/" className="transition hover:text-white">Privacy</Link></li>
          <li><Link to="/" className="transition hover:text-white">Terms</Link></li>
          <li><Link to="/" className="transition hover:text-white">Cookies</Link></li>
        </ul>
      </div>
    </div>
    </div>
    <p className="mt-10 text-center text-xs text-slate-500">© 2026 QuickBite. Crafted for modern food lovers.</p>
  </footer>
);

export default Footer;
