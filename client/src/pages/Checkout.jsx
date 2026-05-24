import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { clearCart } from '../store/cartSlice.js';
import { placeOrder } from '../store/orderSlice.js';
import { formatPrice } from '../utils/formatPrice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, discount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { status, currentOrder } = useSelector((state) => state.orders);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      address: '',
      city: '',
      postalCode: '',
      paymentMethod: 'card',
    },
  });

  useEffect(() => {
    if (currentOrder) {
      dispatch(clearCart());
      navigate('/dashboard');
    }
  }, [currentOrder, dispatch, navigate]);

  const [submissionError, setSubmissionError] = useState(null);

  const onSubmit = (data) => {
    setSubmissionError(null);
    dispatch(
      placeOrder({
        items,
        shippingAddress: data,
        total,
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Your order has been placed successfully!');
      })
      .catch((err) => {
        const message = err || 'Failed to place your order.';
        toast.error(message);
        setSubmissionError(message);
      });
  };

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">Your cart is empty</h2>
        <p className="mt-3 text-slate-600">Add something delicious before checking out.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Checkout</h1>
          <p className="mt-2 text-slate-600">Enter your address and payment details to complete the order.</p>
          {submissionError && (
            <div className="mt-4 rounded-[1.75rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submissionError}
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Full name</span>
            <input
              type="text"
              {...register('name', { required: 'Full name is required' })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
            {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email address</span>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
            {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>}
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Delivery address</span>
          <input
            type="text"
            {...register('address', { required: 'Address is required' })}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
          />
          {errors.address && <p className="mt-2 text-sm text-rose-600">{errors.address.message}</p>}
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">City</span>
            <input
              type="text"
              {...register('city', { required: 'City is required' })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
            {errors.city && <p className="mt-2 text-sm text-rose-600">{errors.city.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Postal code</span>
            <input
              type="text"
              {...register('postalCode', { required: 'Postal code is required' })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
            {errors.postalCode && <p className="mt-2 text-sm text-rose-600">{errors.postalCode.message}</p>}
          </label>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-950">Payment method</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {['card', 'wallet', 'cash'].map((method) => (
              <label key={method} className="inline-flex cursor-pointer items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-4 transition hover:border-slate-400">
                <input type="radio" value={method} {...register('paymentMethod')} className="h-4 w-4 text-slate-900" />
                <span className="text-sm font-semibold text-slate-900">
                  {method === 'card' ? 'Credit card' : method === 'wallet' ? 'Wallet' : 'Cash on delivery'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-700"
        >
          {status === 'loading' ? 'Placing order...' : 'Place order'}
        </button>
      </form>

      <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-950">Order summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex flex-col gap-2 rounded-3xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-600">Qty {item.quantity}</p>
              </div>
              <p className="font-semibold text-slate-900">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="border-t border-slate-200 pt-4 font-semibold text-slate-950">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;
