import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/', icon: 'HM' },
  { label: 'Search', to: '/search', icon: 'SR' },
  { label: 'Restaurants', to: '/restaurants', icon: 'RS' },
  { label: 'Orders', to: '/dashboard', icon: 'OR' },
];

const BottomNav = () => {
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-xl backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
        <div className="flex flex-1 items-center justify-between gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-w-[3.5rem] flex-1 flex-col items-center justify-center gap-1 rounded-3xl px-2 py-2 text-center text-[0.68rem] font-semibold transition ${
                  isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <span className="text-xs tracking-[0.2em]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <NavLink
          to="/cart"
          className="inline-flex min-w-[3.5rem] flex-col items-center justify-center gap-1 rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-[0.68rem] font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <span className="text-xs tracking-[0.2em]">CT</span>
          <span>Cart</span>
          <span className="mt-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-semibold text-white">
            {cartCount}
          </span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
