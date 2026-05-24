import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFoodDetails, clearSelectedFood } from '../store/restaurantSlice.js';
import { addItem } from '../store/cartSlice.js';
import { formatPrice } from '../utils/formatPrice.js';
import { getImageSrc } from '../utils/getImageSrc.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const FoodDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedFood, foodStatus, error } = useSelector((state) => state.restaurants);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchFoodDetails(id));
    }

    return () => {
      dispatch(clearSelectedFood());
    };
  }, [dispatch, id]);

  if (foodStatus === 'loading') {
    return <Loader />;
  }

  if (foodStatus === 'failed') {
    return <ErrorMessage title="Unable to load food item" message={error || 'Please try again later.'} />;
  }

  if (!selectedFood) {
    return (
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Food not found</h1>
        <p className="text-slate-600">The food item could not be loaded. Please try again or browse other restaurants.</p>
        <button
          type="button"
          onClick={() => navigate('/restaurants')}
          className="rounded-full border border-slate-200 bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Browse more
        </button>
      </div>
    );
  }

  const imageSrc = getImageSrc(
    selectedFood.image,
    `https://placehold.co/900x600/e2e8f0/334155?text=${encodeURIComponent(selectedFood.name || 'Food Item')}`
  );

  const handleAddToCart = () => {
    dispatch(
      addItem({
        _id: selectedFood._id,
        name: selectedFood.name,
        description: selectedFood.description,
        price: selectedFood.price,
        image: selectedFood.image,
        quantity,
      })
    );
    navigate('/cart');
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <img
            src={imageSrc}
            alt={selectedFood.name || 'Food item'}
            className="h-96 w-full object-cover"
          />
        </div>

        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {selectedFood.category && (
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {selectedFood.category}
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              <span>*</span>
              {selectedFood.rating?.avg ? selectedFood.rating.avg.toFixed(1) : 'N/A'}
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-slate-950">{selectedFood.name}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{selectedFood.description}</p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-50 p-6">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Price</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{formatPrice(selectedFood.price)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quantity</p>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-lg font-semibold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => navigate('/restaurants')}
              className="w-full rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50 sm:w-auto"
            >
              Browse more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
