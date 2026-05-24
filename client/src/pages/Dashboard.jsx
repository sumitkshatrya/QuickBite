import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatPrice } from '../utils/formatPrice.js';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setStatus('loading');
      setError('');

      try {
        const data = await fetchOrders();
        setOrders(data);
        setStatus('succeeded');
      } catch (err) {
        setError(err.message || 'Unable to load orders.');
        setStatus('failed');
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Track your latest orders and delivery status.</p>
      </div>

      {status === 'loading' && <Loader label="Loading your orders..." />}

      {status === 'failed' && (
        <ErrorMessage title="Unable to load orders" message={error || 'Please try again later.'} />
      )}

      {status === 'succeeded' && orders.length === 0 && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-slate-600">No orders yet. Place your first order from the home page.</p>
        </div>
      )}

      {status === 'succeeded' && orders.length > 0 && (
        <div className="grid gap-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Order #{order._id.slice(-6)}</h2>
                  <p className="mt-2 text-slate-600">Status: {order.status.replace(/_/g, ' ')}</p>
                  <p className="mt-2 text-slate-600">Total: {formatPrice(order.total || 0)}</p>
                </div>
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Track order
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
