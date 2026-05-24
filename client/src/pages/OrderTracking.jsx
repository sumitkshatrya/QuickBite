import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchOrderTracking, updateOrderStatus } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const statusLabels = {
  booked: 'Order booked',
  preparing: 'Preparing',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  failed: 'Delivery failed',
  cancelled: 'Cancelled',
};

const adminStatuses = ['preparing', 'on_the_way', 'delivered', 'failed'];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');

  const loadOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchOrderTracking(id);
      setOrder(data);
    } catch (err) {
      const message = err.message || 'Failed to load order details.';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(newStatus);

    try {
      await updateOrderStatus(id, newStatus);
      await loadOrder();
      toast.success(`Order updated to ${statusLabels[newStatus] || newStatus}.`);
    } catch (err) {
      const message = err.message || 'Failed to update order status.';
      toast.error(message);
      setError(message);
    } finally {
      setUpdating('');
    }
  };

  if (loading) return <Loader label="Loading order details..." />;
  if (error) return <ErrorMessage title="Order load failed" message={error} />;
  if (!order) return <ErrorMessage title="Order not found" message="We could not find that order." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">Order Tracking - {order._id}</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>
            Status: <strong className="text-slate-900">{statusLabels[order.status] || order.status}</strong>
          </p>
          <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
          <p>Last update: {new Date(order.updatedAt).toLocaleString()}</p>
          {order.deliveredAt && <p>Delivered: {new Date(order.deliveredAt).toLocaleString()}</p>}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-950">Items</h3>
        <ul className="mt-4 divide-y divide-slate-200">
          {order.items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex justify-between py-3">
              <span className="text-slate-900">{item.name}</span>
              <span className="text-sm text-slate-600">x{item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        {auth.user?.isAdmin ? (
          adminStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              disabled={updating === status}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating === status ? 'Updating...' : `Mark ${statusLabels[status]}`}
            </button>
          ))
        ) : (
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Back to your orders
          </button>
        )}
      </div>
    </div>
  );
}
