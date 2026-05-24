import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { fetchFoods, fetchRestaurants } from '../services/api.js';
import FoodCard from '../components/FoodCard.jsx';
import RestaurantCard from '../components/RestaurantCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const ratings = [0, 3.5, 4.0, 4.5];
const dietOptions = [
  { value: 'all', label: 'All' },
  { value: 'veg', label: 'Vegetarian' },
  { value: 'nonveg', label: 'Non-vegetarian' },
];
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating_desc', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
];
const tabs = [
  { value: 'foods', label: 'Foods' },
  { value: 'restaurants', label: 'Restaurants' },
];

const normalizeParam = (value) => (value == null ? '' : value);

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const q = normalizeParam(searchParams.get('q'));
  const category = normalizeParam(searchParams.get('category')) || 'All';
  const minPrice = normalizeParam(searchParams.get('minPrice'));
  const maxPrice = normalizeParam(searchParams.get('maxPrice'));
  const minRating = normalizeParam(searchParams.get('minRating')) || '0';
  const diet = normalizeParam(searchParams.get('diet')) || 'all';
  const sort = normalizeParam(searchParams.get('sort')) || 'relevance';
  const activeTab = normalizeParam(searchParams.get('tab')) || 'foods';

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === undefined || value === null || value === '' || value === 'All') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    setSearchParams(nextParams);
  };

  const foodParams = {
    search: q || undefined,
    category: category === 'All' ? undefined : category,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    minRating: minRating || undefined,
    isVegetarian: diet === 'all' ? undefined : diet === 'veg' ? 'true' : 'false',
    sort,
  };

  const restaurantParams = {
    search: q || undefined,
    category: category === 'All' ? undefined : category,
    minRating: minRating || undefined,
    sort: sort === 'price_asc' || sort === 'price_desc' ? 'rating_desc' : sort,
  };

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      setError('');

      try {
        const [foodData, restaurantData] = await Promise.all([
          fetchFoods(foodParams),
          fetchRestaurants(restaurantParams),
        ]);
        setFoods(foodData);
        setRestaurants(restaurantData);
      } catch (err) {
        const message = err.message || 'Search failed.';
        toast.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [q, category, minPrice, maxPrice, minRating, diet, sort]);

  const categories = useMemo(() => {
    const categorySet = new Set(['All']);
    foods.forEach((food) => {
      if (food.category) categorySet.add(food.category);
    });
    restaurants.forEach((restaurant) => {
      (restaurant.categories || []).forEach((item) => categorySet.add(item));
    });
    return Array.from(categorySet);
  }, [foods, restaurants]);

  const resultCount = activeTab === 'foods' ? foods.length : restaurants.length;

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 px-6 py-10 text-white shadow-2xl sm:px-10">
        <div className="container mx-auto flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Smart search</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Find foods and restaurants faster.</h1>
            <p className="mt-4 max-w-xl text-slate-300">Search across menus and restaurants with filters for category, price, rating, and vegetarian options.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-white/10 p-6 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Food results</p>
              <p className="mt-3 text-3xl font-semibold">{foods.length}</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/10 p-6 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Restaurant results</p>
              <p className="mt-3 text-3xl font-semibold">{restaurants.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700">Search keywords</label>
              <input
                type="search"
                value={q}
                onChange={(event) => updateParam('q', event.target.value)}
                placeholder="Search food names, restaurants, categories..."
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Category
                <select
                  value={category}
                  onChange={(event) => updateParam('category', event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Rating
                <select
                  value={minRating}
                  onChange={(event) => updateParam('minRating', event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                >
                  {ratings.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating === 0 ? 'All ratings' : `${rating}+ stars`}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Min price
                <input
                  type="number"
                  value={minPrice}
                  min="0"
                  onChange={(event) => updateParam('minPrice', event.target.value)}
                  placeholder="0"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Max price
                <input
                  type="number"
                  value={maxPrice}
                  min="0"
                  onChange={(event) => updateParam('maxPrice', event.target.value)}
                  placeholder="Any"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Diet type
                <select
                  value={diet}
                  onChange={(event) => updateParam('diet', event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                >
                  {dietOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Sort by
                <select
                  value={sort}
                  onChange={(event) => updateParam('sort', event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: activeTab })}
              className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Results</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                {resultCount} {activeTab === 'foods' ? 'foods' : 'restaurants'} found
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-2">
              {tabs.map((tabItem) => (
                <button
                  key={tabItem.value}
                  type="button"
                  onClick={() => updateParam('tab', tabItem.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tabItem.value ? 'bg-slate-900 text-white' : 'text-slate-700'
                  }`}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}

        {!loading && error && (
          <div className="col-span-full">
            <ErrorMessage title="Search error" message={error} />
          </div>
        )}

        {!loading && !error && resultCount === 0 && (
          <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
            No results match your search and filters.
          </div>
        )}

        {!loading && !error && activeTab === 'foods' && foods.map((food) => <FoodCard key={food._id} food={food} />)}

        {!loading &&
          !error &&
          activeTab === 'restaurants' &&
          restaurants.map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant} />)}
      </section>
    </div>
  );
};

export default Search;
