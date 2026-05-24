import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice.js';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Search', to: '/search' },
    { label: 'Restaurants', to: '/restaurants' },
    { label: 'Orders', to: '/dashboard' },
    ...(user?.isAdmin || user?.role === 'admin' ? [{ label: 'Admin', to: '/admin' }] : []),
  ];

  const activeClass = ({ isActive }) =>
    isActive
      ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-slate-900'
      : 'text-slate-600 hover:text-slate-900';

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    setSearch('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-slate-900 transition hover:text-slate-700">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                Q
              </span>
              <span>QuickBite</span>
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 items-center justify-center md:flex"
          >
            <label className="relative w-full max-w-xl">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants, dishes, cuisines..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 103.707 9.457l3.85 3.85a.75.75 0 101.06-1.06l-3.85-3.85A5.5 5.5 0 009 3.5zm-4.5 5.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" clipRule="evenodd" />
                </svg>
              </span>
            </label>
          </form>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-slate-300 md:hidden"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>

          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-4">
              {navLinks.map((item) => (
                <NavLink key={item.to} to={item.to} className={activeClass} end>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <Link to="/cart" className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100">
              <span className="sr-only">View cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-9-9v9" />
              </svg>
              <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-semibold text-white shadow-sm">
                {cartCount}
              </span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  {user.name || 'Profile'}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 z-50 mt-2 min-w-[14rem] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                      {user.isAdmin || user.role === 'admin' ? 'Admin' : 'User'}
                    </p>
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(logout());
                          setProfileOpen(false);
                          navigate('/');
                        }}
                        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Login
              </Link>
            )}
          </div>
        </div>

        <div className={`${isOpen ? 'max-h-[26rem] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-[max-height,opacity] duration-300 md:hidden`}>
          <div className="mt-4 space-y-4 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food or restaurants"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              />
              <button type="submit" className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700">
                Go
              </button>
            </form>

            <nav className="flex flex-col gap-3">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${isActive ? 'text-slate-900 font-semibold' : 'text-slate-600'} rounded-2xl px-4 py-3 transition hover:bg-white hover:text-slate-900`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <Link to="/cart" className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-9-9v9" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Cart</p>
                  <p className="text-xs text-slate-500">{cartCount} items</p>
                </div>
              </div>
              <span className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                View
              </span>
            </Link>

            <div className="grid gap-3 sm:grid-cols-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(logout());
                    navigate('/');
                    setIsOpen(false);
                  }}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-slate-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
              <Link
                to="/register"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 text-center transition hover:bg-slate-100"
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
