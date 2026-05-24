import { useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../store/cartSlice.js';
import { formatPrice } from '../utils/formatPrice';
import { getImageSrc } from '../utils/getImageSrc.js';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:grid-cols-[120px_minmax(0,1fr)_120px]">
      <img
        src={getImageSrc(item.image, `https://placehold.co/500x350/f8fafc/334155?text=${encodeURIComponent(item.name || 'Food')}`)}
        alt={item.name}
        className="h-28 w-full rounded-3xl object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold text-slate-950">{item.name}</h3>
        <p className="mt-2 text-sm text-slate-600">{item.description}</p>
        <p className="mt-3 text-sm font-semibold text-slate-900">{formatPrice(item.price)}</p>
      </div>
      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="flex w-full items-center justify-between gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 md:w-auto md:justify-start">
          <button
            type="button"
            onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: Math.max(1, item.quantity - 1) }))}
            className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            type="button"
            onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity + 1 }))}
            className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => dispatch(removeItem(item._id))}
          className="text-sm font-semibold text-rose-600 transition hover:text-rose-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
