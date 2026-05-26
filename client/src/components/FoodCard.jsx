import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { getImageSrc } from '../utils/getImageSrc.js';

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const imageSrc = getImageSrc(
    food.image,
    `https://placehold.co/800x600/f1f5f9/334155?text=${encodeURIComponent(food.name || 'Food Item')}`
  );

  const handleOrderClick = () => {
    navigate(`/food/${food._id}`);
  };

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img src={imageSrc} alt={food.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-sm">
          Popular
        </span>
      </div>
      <div className="space-y-4 p-6 min-w-0">
        <div>
          <div className="flex flex-wrap items-start gap-3">
            <h3 className="min-w-0 text-2xl font-semibold text-slate-950">{food.name}</h3>
            {food.isVegetarian && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Veg
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{food.description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xl font-semibold text-slate-950">{formatPrice(food.price)}</span>
          <button 
            type="button"
            onClick={handleOrderClick}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
          >
            Order now
          </button>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
