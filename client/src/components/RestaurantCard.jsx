import { getImageSrc } from '../utils/getImageSrc.js';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const ratingValue = restaurant.rating?.avg ?? restaurant.rating ?? 0;
  const imageSrc = getImageSrc(
    restaurant.image,
    `https://placehold.co/800x500/e2e8f0/334155?text=${encodeURIComponent(restaurant.name || 'Restaurant')}`
  );

  const toNumber = (v) => {
    if (v == null) return NaN;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : NaN;
    }
    if (typeof v === 'object') {
      if ('$numberDecimal' in v) {
        const n = parseFloat(v.$numberDecimal);
        return Number.isFinite(n) ? n : NaN;
      }
      if ('avg' in v) return toNumber(v.avg);
      if ('value' in v) return toNumber(v.value);
    }
    return NaN;
  };

  const safeToFixed = (v, decimals) => {
    const n = toNumber(v);
    return Number.isFinite(n) ? n.toFixed(decimals) : (typeof v === 'string' ? v : (decimals === 2 ? '0.00' : '0.0'));
  };
  const content = (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <img src={imageSrc} alt={restaurant.name} loading="lazy" className="h-56 w-full object-cover" />
      <div className="p-6 min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-slate-950 truncate">{restaurant.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{restaurant.cuisine}</p>
          </div>
          <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">{safeToFixed(ratingValue, 1)}</div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{restaurant.description}</p>
        {(restaurant.time || restaurant.delivery || restaurant.deliveryFee) && (
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {restaurant.time && <span>{restaurant.time} min</span>}
            {restaurant.time && (restaurant.delivery || restaurant.deliveryFee) && <span className="h-1 w-1 rounded-full bg-slate-300" />}
            {restaurant.delivery && <span>{restaurant.delivery}</span>}
            {restaurant.deliveryFee != null && !restaurant.delivery && <span>${safeToFixed(restaurant.deliveryFee, 2)} delivery</span>}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {restaurant.categories?.map((category) => (
            <span key={category} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              {category}
            </span>
          ))}
        </div>
      </div>
    </article>
  );

  if (!restaurant?._id) {
    return content;
  }

  return (
    <Link to={`/restaurants/${restaurant._id}`} className="block">
      {content}
    </Link>
  );
};

export default RestaurantCard;
