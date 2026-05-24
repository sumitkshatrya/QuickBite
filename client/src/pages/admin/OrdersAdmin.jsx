import { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../services/api.js';

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await fetchOrders());
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      await load();
      setMessage('Order status updated');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Orders</h2>
            <p className="text-sm text-slate-500">Manage order statuses from booked to delivered.</p>
          </div>
        </div>
        {message && <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-slate-700">{message}</div>}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="p-6 text-slate-500">Loading orders…</div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                    <p className="text-sm text-slate-500">Status: {order.status.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-slate-500">Total: ${order.total?.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['preparing', 'on_the_way', 'delivered', 'failed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => changeStatus(order._id, status)}
                        className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        {status.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
