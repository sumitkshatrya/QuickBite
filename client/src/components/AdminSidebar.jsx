import { NavLink } from 'react-router-dom';

export const adminLinks = [
  { label: 'Restaurants', to: '/admin/restaurants' },
  { label: 'Menu Items', to: '/admin/foods' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Orders', to: '/admin/orders' },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 bg-slate-900 p-5 text-slate-100 lg:block">
      <div className="mb-8 text-2xl font-semibold">Admin Panel</div>
      <nav className="space-y-2">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
