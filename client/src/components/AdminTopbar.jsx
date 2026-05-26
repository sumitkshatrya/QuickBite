import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { fetchOrders } from '../services/api.js';
import { logout } from '../store/authSlice.js';
import { adminLinks } from './AdminSidebar.jsx';

const SEEN_ORDERS_KEY = 'quickbiteAdminSeenOrders';

const readSeenOrders = () => {
  try {
    const value = localStorage.getItem(SEEN_ORDERS_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(SEEN_ORDERS_KEY);
    return [];
  }
};

const writeSeenOrders = (orderIds) => {
  localStorage.setItem(SEEN_ORDERS_KEY, JSON.stringify(orderIds));
};

export default function AdminTopbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [seenOrderIds, setSeenOrderIds] = useState(readSeenOrders);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        if (isMounted) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) {
          setOrders([]);
        }
      }
    };

    loadOrders();
    const intervalId = window.setInterval(loadOrders, 20000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const bookedOrders = useMemo(
    () => orders.filter((order) => order.status === 'booked').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  );

  const unseenBookedOrders = useMemo(
    () => bookedOrders.filter((order) => !seenOrderIds.includes(order._id)),
    [bookedOrders, seenOrderIds]
  );

  const handleOpenNotifications = () => {
    const ids = bookedOrders.map((order) => order._id);
    setSeenOrderIds(ids);
    writeSeenOrders(ids);
    setIsOpen((current) => !current);
    setIsNavOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsNavOpen((current) => !current);
                setIsOpen(false);
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open admin navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <Link to="/admin/restaurants" className="inline-flex items-center gap-3 text-slate-900 transition hover:text-slate-700">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg">
                Q
              </span>
              <div>
                <p className="text-lg font-semibold">QuickBite</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Admin Panel</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 sm:flex-nowrap">
            <div className="relative">
              <button
                type="button"
                onClick={handleOpenNotifications}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
                aria-label="Order notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                </svg>
                {unseenBookedOrders.length > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[0.65rem] font-semibold text-white">
                    {unseenBookedOrders.length}
                  </span>
                )}
              </button>

              {isOpen && (
                <div className="fixed inset-x-4 top-20 z-40 max-h-96 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-80 sm:max-h-80">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">New Order Notifications</p>
                    <p className="mt-1 text-xs text-slate-500">Booked orders waiting for admin action.</p>
                  </div>

                  <div className="max-h-64 overflow-y-auto sm:max-h-64">
                    {bookedOrders.length === 0 ? (
                      <div className="px-5 py-6 text-sm text-slate-500">No new booked orders right now.</div>
                    ) : (
                      bookedOrders.slice(0, 10).map((order) => (
                        <button
                          key={order._id}
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/admin/orders');
                          }}
                          className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm transition hover:bg-slate-50 sm:px-5 sm:py-4"
                        >
                          <div className="flex items-start justify-between gap-2 sm:gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900">Order #{order._id.slice(-6)}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                {order.items?.length || 0} item(s)
                              </p>
                            </div>
                            {!seenOrderIds.includes(order._id) && (
                              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-emerald-700 flex-shrink-0">
                                New
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Just now'}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
              {isOpen && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-30 sm:hidden"
                  aria-label="Close notifications"
                />
              )}
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500">Logged in</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>

        {isNavOpen && (
          <nav className="mt-4 max-h-96 overflow-y-auto grid gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-3 lg:hidden">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsNavOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
