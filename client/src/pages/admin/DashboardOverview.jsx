import { useEffect, useState } from 'react';
import { fetchOrders, fetchRestaurants } from '../../services/api.js';
import { formatPrice } from '../../utils/formatPrice.js';

export default function DashboardOverview() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [orderData, restaurantData] = await Promise.all([fetchOrders(), fetchRestaurants()]);
        setOrders(orderData);
        setRestaurants(restaurantData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const orderCount = orders.length;
  const completedCount = orders.filter((o) => o.status === 'delivered').length;
  const failedCount = orders.filter((o) => o.status === 'failed').length;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Orders</h3>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{orderCount}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500">Restaurants</h3>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{restaurants.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500">Delivered</h3>
          <p className="mt-4 text-3xl font-semibold text-emerald-600">{completedCount}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500">Failed</h3>
          <p className="mt-4 text-3xl font-semibold text-rose-600">{failedCount}</p>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="text-slate-500">Loading...</div>
            ) : orders.slice(0, 4).map((order) => (
              <div key={order._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">{order.status.replace(/_/g, ' ')}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Total: {formatPrice(order.total)}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Top Restaurants</h2>
          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="text-slate-500">Loading...</div>
            ) : restaurants.slice(0, 4).map((rest) => (
              <div key={rest._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold">{rest.name}</p>
                  <span className="text-sm text-slate-500">{rest.cuisine}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{rest.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
