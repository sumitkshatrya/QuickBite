import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { applyCoupon, clearCart } from '../store/cartSlice.js';
import CartItem from '../components/CartItem.jsx';
import { formatPrice } from '../utils/formatPrice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, coupon, discount } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const discountValue = useMemo(() => subtotal * discount, [subtotal, discount]);
  const tax = useMemo(() => (subtotal - discountValue) * 0.08, [subtotal, discountValue]);
  const total = useMemo(() => subtotal - discountValue + tax, [subtotal, discountValue, tax]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage('Enter a coupon code to apply savings.');
      return;
    }

    if (code === 'QUICK10' || code === 'SAVE20') {
      dispatch(applyCoupon(code));
      setCouponMessage(`Coupon ${code} applied successfully.`);
    } else {
      setCouponMessage('Coupon not recognized. Try QUICK10 or SAVE20.');
    }

    setCouponCode('');
  };

  return (
    <div className="space-y-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-3xl font-semibold text-slate-950">Shopping cart</h1>
        <p className="mt-2 text-slate-600">Review your items, update quantities, and proceed to checkout.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600 shadow-sm">
          <p className="text-xl font-semibold text-slate-900">Your cart is empty.</p>
          <p className="mt-3">Add tasty meals from the restaurant listing to begin.</p>
          <Link
            to="/restaurants"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Browse restaurants
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-4">
              <div className="rounded-[1.75rem] bg-slate-50 p-5">
                <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                  <span>{itemCount} item{itemCount === 1 ? '' : 's'} in cart</span>
                  <span className="font-semibold text-slate-950">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-3 rounded-[1.75rem] bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discountValue)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-slate-200 pt-4 text-lg font-semibold text-slate-950">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                <label className="block text-sm font-semibold text-slate-700">Coupon code</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 sm:self-start"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-slate-600">Valid codes: <span className="font-semibold text-slate-900">QUICK10</span>, <span className="font-semibold text-slate-900">SAVE20</span>.</p>
                {couponMessage && (
                  <p className={`text-sm ${couponMessage.includes('successfully') ? 'text-emerald-700' : 'text-rose-600'}`}>{couponMessage}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full rounded-full bg-slate-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-700"
            >
              Proceed to checkout
            </button>
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
