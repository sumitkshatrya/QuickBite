import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { fetchRestaurantById, fetchFoods } from '../services/api.js';
import { getImageSrc } from '../utils/getImageSrc.js';
import { formatPrice } from '../utils/formatPrice.js';
import FoodCard from '../components/FoodCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRestaurant = async () => {
      setStatus('loading');
      setError('');

      try {
        const [restaurantData, foodData] = await Promise.all([
          fetchRestaurantById(id),
          fetchFoods({ restaurant: id }),
        ]);
        setRestaurant(restaurantData);
        setFoods(Array.isArray(foodData) ? foodData : []);
        setStatus('succeeded');
      } catch (err) {
        const message = err.message || 'Unable to load restaurant details.';
        toast.error(message);
        setError(message);
        setStatus('failed');
      }
    };

    if (id) {
      loadRestaurant();
    }
  }, [id]);

  const heroImage = useMemo(() => {
    return getImageSrc(
      restaurant?.image,
      `https://placehold.co/1400x700/e2e8f0/334155?text=${encodeURIComponent(restaurant?.name || 'Restaurant')}`
    );
  }, [restaurant]);

  const ratingValue = Number(restaurant?.rating?.avg ?? restaurant?.rating ?? 0);

  if (status === 'loading') {
    return <Loader label="Loading restaurant..." />;
  }

  if (status === 'failed') {
    return <ErrorMessage title="Unable to load restaurant" message={error || 'Please try again later.'} />;
  }

  if (!restaurant) {
    return <ErrorMessage title="Restaurant not found" message="We could not find that restaurant." />;
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <img src={heroImage} alt={restaurant.name} className="h-72 w-full object-cover sm:h-96" />
        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Restaurant</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">{restaurant.name}</h1>
              <p className="mt-3 text-base text-slate-600">{restaurant.cuisine}</p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
              {Number.isFinite(ratingValue) ? ratingValue.toFixed(1) : '0.0'}
            </div>
          </div>

          <p className="max-w-4xl text-slate-600">{restaurant.description}</p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {restaurant.deliveryFee != null && <span>Delivery: {formatPrice(restaurant.deliveryFee)}</span>}
            {restaurant.openingHours && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{restaurant.openingHours}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/restaurants')}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Back to restaurants
            </button>
            <Link
              to="/cart"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              View cart
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Menu</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Food items from {restaurant.name}</h2>
          </div>
          <p className="text-sm text-slate-500">{foods.length} item(s)</p>
        </div>

        {foods.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
            No food items are available for this restaurant yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RestaurantDetails;
