import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FoodCard from '../components/FoodCard';
import HeroBanner from '../components/HeroBanner';
import SectionHeader from '../components/SectionHeader';
import CategoryCard from '../components/CategoryCard';
import RestaurantCard from '../components/RestaurantCard';
import OfferCard from '../components/OfferCard';
import Loader from '../components/Loader';

import { fetchPopularFoods } from '../store/restaurantSlice.js';

const categories = [
  { id: 'pizza', name: 'Pizza', description: 'Wood-fired pies and cheesy crusts', icon: 'PZ' },
  { id: 'sushi', name: 'Sushi', description: 'Fresh rolls and sashimi', icon: 'SU' },
  { id: 'burger', name: 'Burgers', description: 'Juicy patties with crisp toppings', icon: 'BG' },
  { id: 'vegan', name: 'Vegan', description: 'Plant-based favorites', icon: 'VG' },
  { id: 'dessert', name: 'Desserts', description: 'Sweet treats for every craving', icon: 'DS' },
  { id: 'drinks', name: 'Drinks', description: 'Refreshing beverages', icon: 'DR' },
];

const restaurants = [
  {
    id: '1',
    name: 'Stella Kitchen',
    cuisine: 'Italian Bistro',
    description: 'Warm atmosphere with pasta, pizzas, and craft cocktails.',
    rating: '4.8',
    time: 22,
    delivery: 'Free delivery',
    image: 'https://images.unsplash.com/photo-1555992336-03a23c13fdb8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    name: 'Urban Bites',
    cuisine: 'Street Food',
    description: 'Creative bowls, loaded tacos, and bold flavor combinations.',
    rating: '4.7',
    time: 18,
    delivery: 'Low delivery fee',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    name: 'Green Harbor',
    cuisine: 'Vegan and Healthy',
    description: 'Seasonal salads, nutrient bowls, and wellness drinks.',
    rating: '4.9',
    time: 20,
    delivery: 'Fast delivery',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  },
];

const offers = [
  {
    id: 'offer1',
    tag: 'Limited time',
    title: 'Free delivery on orders above $25',
    description: 'Enjoy no delivery fee from popular restaurants for a limited time.',
    button: 'Activate offer',
    icon: 'FD',
  },
  {
    id: 'offer2',
    tag: 'Hot deal',
    title: "Up to 30% off chef's favorites",
    description: 'Save on premium dishes handpicked by our culinary experts.',
    button: 'View deals',
    icon: 'HD',
  },
  {
    id: 'offer3',
    tag: 'Seasonal',
    title: 'Breakfast bundles starting at $12',
    description: 'Start the day with fresh coffee, pastries, and hearty bowls.',
    button: 'See breakfast',
    icon: 'AM',
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { popularFoods = [], popularFoodsStatus = 'idle' } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchPopularFoods());
  }, [dispatch]);

  return (
    <div className="space-y-16">
      <HeroBanner />

      <section className="space-y-8">
        <SectionHeader title="Discover your next meal" subtitle="Popular categories" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader title="Top restaurant partners" subtitle="Handpicked for you" />
        <div className="grid gap-6 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Popular foods</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Trending dishes this week</h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/search?tab=foods')}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Browse full menu
          </button>
        </div>

        {popularFoodsStatus === 'loading' ? (
          <Loader />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {popularFoods.length > 0 ? (
              popularFoods.map((food) => <FoodCard key={food._id} food={food} />)
            ) : (
              <p className="text-slate-600">No popular foods available.</p>
            )}
          </div>
        )}
      </section>

      <section className="space-y-8">
        <SectionHeader title="Featured offers" subtitle="Delicious savings" />
        <div className="grid gap-6 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
