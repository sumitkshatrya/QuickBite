import { useEffect, useMemo, useState } from 'react';
import { createFoodsBulk, fetchFoods, fetchRestaurants, request } from '../../services/api.js';
import ImageUpload from '../../components/ImageUpload.jsx';
import { getImageSrc } from '../../utils/getImageSrc.js';

const deleteFoodItem = (id) => request(`/foods/${id}`, { method: 'DELETE' });

const initialFoodForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  restaurant: '',
  isVegetarian: false,
};

export default function FoodsAdmin() {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(initialFoodForm);
  const [queuedItems, setQueuedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const restaurantOptions = useMemo(
    () => restaurants.map((restaurant) => ({ id: restaurant._id, name: restaurant.name })),
    [restaurants]
  );

  const load = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const [foodData, restaurantData] = await Promise.all([fetchFoods(), fetchRestaurants()]);
      setFoods(Array.isArray(foodData) ? foodData : []);
      setRestaurants(Array.isArray(restaurantData) ? restaurantData : []);
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Unable to load food items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm((current) => ({
      ...initialFoodForm,
      restaurant: current.restaurant,
    }));
  };

  const addToQueue = () => {
    if (!form.name.trim() || !form.description.trim() || !form.price.trim()) {
      setMessage('Food name, description, and price are required');
      return;
    }

    if (!form.restaurant) {
      setMessage('Please choose a restaurant for this menu item');
      return;
    }

    setQueuedItems((current) => [
      ...current,
      {
        ...form,
        price: parseFloat(form.price) || 0,
      },
    ]);
    resetForm();
    setMessage(null);
  };

  const removeQueuedItem = (index) => {
    setQueuedItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (queuedItems.length === 0) {
      addToQueue();
      return;
    }

    try {
      await createFoodsBulk(queuedItems);
      setMessage(`${queuedItems.length} food item(s) created`);
      setQueuedItems([]);
      resetForm();
      await load();
    } catch (err) {
      setMessage(err.message || 'Unable to create food items');
    }
  };

  const remove = async (id) => {
    try {
      await deleteFoodItem(id);
      setMessage('Food item deleted');
      await load();
    } catch (err) {
      setMessage(err.message || 'Unable to delete food item');
    }
  };

  const resolveRestaurantName = (restaurantId) =>
    restaurantOptions.find((restaurant) => restaurant.id === restaurantId)?.name || 'Unassigned restaurant';

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Food Items</h2>
            <p className="text-sm text-slate-500">Create many menu items and assign them to restaurants in one save.</p>
          </div>
        </div>

        {message && <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-slate-700">{message}</div>}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Queued Menu Items</h3>
                  <p className="text-sm text-slate-500">Add many items, then create them together.</p>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  {queuedItems.length} queued
                </span>
              </div>

              {queuedItems.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                  No food items queued yet.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {queuedItems.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <img
                        src={getImageSrc(item.image, `https://placehold.co/700x350/f8fafc/334155?text=${encodeURIComponent(item.name || 'Food Item')}`)}
                        alt={item.name}
                        className="h-36 w-full object-cover"
                      />
                      <div className="space-y-3 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-500">{resolveRestaurantName(item.restaurant)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQueuedItem(index)}
                            className="rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-sm text-slate-600">{item.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span>${Number(item.price).toFixed(2)}</span>
                          {item.category && <span>{item.category}</span>}
                          <span>{item.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-slate-900">Existing Food Items</h3>
              {loading ? (
                <div className="mt-4 text-slate-500">Loading food items...</div>
              ) : (
                <div className="mt-4 space-y-4">
                  {foods.map((food) => (
                    <div key={food._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <img
                        src={getImageSrc(food.image, `https://placehold.co/700x400/f1f5f9/334155?text=${encodeURIComponent(food.name || 'Food Item')}`)}
                        alt={food.name}
                        className="h-44 w-full object-cover"
                      />
                      <div className="space-y-3 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{food.name}</p>
                            <p className="text-sm text-slate-500">{resolveRestaurantName(food.restaurant)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(food._id)}
                            className="rounded-xl bg-rose-500 px-3 py-2 text-sm text-white transition hover:bg-rose-600"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-sm text-slate-600">{food.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span>${food.price?.toFixed(2)}</span>
                          {food.category && <span>{food.category}</span>}
                          <span>{food.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
            <h3 className="text-lg font-semibold">New Food Item</h3>

            <div className="mt-4 space-y-4">
              <label className="block text-sm text-slate-700">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Restaurant</span>
                <select
                  value={form.restaurant}
                  onChange={(event) => setForm({ ...form, restaurant: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-500"
                >
                  <option value="">Select a restaurant</option>
                  {restaurantOptions.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </label>

              {[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
                { key: 'price', label: 'Price', type: 'number' },
                { key: 'category', label: 'Category', type: 'text' },
              ].map(({ key, label, type }) => (
                <label key={key} className="block text-sm text-slate-700">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
                  <input
                    type={type}
                    min={type === 'number' ? '0' : undefined}
                    step={type === 'number' ? '0.01' : undefined}
                    value={form[key]}
                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-500"
                  />
                </label>
              ))}

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isVegetarian}
                  onChange={(event) => setForm({ ...form, isVegetarian: event.target.checked })}
                  className="h-4 w-4"
                />
                Vegetarian item
              </label>

              <ImageUpload
                label="Food Image"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={addToQueue}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Add To Queue
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {queuedItems.length > 0 ? `Create ${queuedItems.length} Food Item(s)` : 'Create Food Item'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
