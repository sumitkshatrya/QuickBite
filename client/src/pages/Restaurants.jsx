import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import RestaurantCard from '../components/RestaurantCard';
import SkeletonCard from '../components/SkeletonCard.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { fetchRestaurants } from '../services/api.js';

const ratings = [0, 4.5, 4.7, 4.8];
const sortOptions = [
  { value: 'rating_desc', label: 'Best rating' },
  { value: 'rating_asc', label: 'Lowest rating' },
  { value: 'newest', label: 'Newest' },
];

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('rating_desc');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchList = async () => {
      setStatus('loading');
      try {
        const data = await fetchRestaurants({
          search: search.trim() || undefined,
          category: category === 'All' ? undefined : category,
          minRating: minRating || undefined,
          sort,
        });
        setRestaurants(data);
        setStatus('success');
      } catch (error) {
        const message = error?.message || 'Failed to load restaurants.';
        toast.error(message);
        console.error(error);
        setStatus('error');
      }
    };

    fetchList();
  }, [search, category, minRating, sort]);

  const categories = useMemo(() => {
    const unique = new Set(restaurants.flatMap((restaurant) => restaurant.categories || []));
    return ['All', ...Array.from(unique)];
  }, [restaurants]);

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 px-6 py-10 text-white shadow-2xl sm:px-10">
        <div className="container mx-auto flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Restaurant discovery</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Find restaurants that match your cravings.</h1>
            <p className="mt-4 max-w-xl text-slate-300">Browse rich restaurant cards, filter by cuisine and rating, and quickly find the perfect delivery option.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-white/10 p-6 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Live listings</p>
              <p className="mt-3 text-3xl font-semibold">{restaurants.length}</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/10 p-6 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Top rating</p>
              <p className="mt-3 text-3xl font-semibold">{Math.max(0, ...restaurants.map((restaurant) => restaurant.rating?.avg ?? restaurant.rating ?? 0)).toFixed(1)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_280px]">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Search restaurants</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, cuisine or description"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Filter category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Filter rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            >
              {ratings.map((rating) => (
                <option key={rating} value={rating}>
                  {rating === 0 ? 'Any rating' : `${rating}+ stars`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Results</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{restaurants.length} restaurants found</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <label className="text-sm font-semibold text-slate-700">Sort by</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('All');
                setMinRating(0);
                setSort('rating_desc');
              }}
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:w-auto"
            >
              Reset filters
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {status === 'loading' && Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}

        {status === 'error' && (
          <div className="col-span-full">
            <ErrorMessage
              title="Unable to load restaurants"
              message="Please refresh the page or try again later."
            />
          </div>
        )}

        {status === 'success' && restaurants.length === 0 && (
          <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
            No restaurants match your filters.
          </div>
        )}

        {status === 'success' && restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </section>
    </div>
  );
};

export default Restaurants;
