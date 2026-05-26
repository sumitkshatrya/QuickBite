import { useEffect, useState } from 'react';
import { fetchRestaurants, request } from '../../services/api.js';
import ImageUpload from '../../components/ImageUpload.jsx';
import { getImageSrc } from '../../utils/getImageSrc.js';

const createRestaurant = (data) => request('/restaurants', { method: 'POST', body: JSON.stringify(data) });
const deleteRestaurant = (id) => request(`/restaurants/${id}`, { method: 'DELETE' });

export default function RestaurantsAdmin() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ name: '', cuisine: '', description: '', image: '' });
  const [menuItems, setMenuItems] = useState([]);
  const [foodItem, setFoodItem] = useState({ name: '', description: '', price: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      setRestaurants(await fetchRestaurants());
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Unable to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setMessage('Restaurant name is required');
      return;
    }

    if (!form.cuisine.trim()) {
      setMessage('Cuisine is required');
      return;
    }

    try {
      await createRestaurant({ ...form, foods: menuItems });
      setMessage('Restaurant added');
      setForm({ name: '', cuisine: '', description: '', image: '' });
      setMenuItems([]);
      setFoodItem({ name: '', description: '', price: '', image: '' });
      await load();
    } catch (err) {
      setMessage(err.message || 'Unable to add restaurant');
    }
  };

  const addMenuItem = () => {
    if (!foodItem.name.trim() || !foodItem.price.trim()) {
      setMessage('Food name and price are required');
      return;
    }

    setMenuItems((current) => [
      ...current,
      { ...foodItem, price: parseFloat(foodItem.price) || 0 },
    ]);
    setFoodItem({ name: '', description: '', price: '', image: '' });
    setMessage(null);
  };

  const removeMenuItem = (index) => {
    setMenuItems((current) => current.filter((_, idx) => idx !== index));
  };

  const remove = async (id) => {
    const confirmDelete = window.confirm('Delete this restaurant? This cannot be undone.');
    if (!confirmDelete) return;

    try {
      await deleteRestaurant(id);
      setMessage('Restaurant deleted');
      await load();
    } catch (err) {
      setMessage(err.message || 'Unable to delete restaurant');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Restaurants</h2>
            <p className="text-sm text-slate-500">Add, remove, and manage restaurant data.</p>
          </div>
        </div>
        {message && <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-slate-700">{message}</div>}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-slate-500">Loading restaurants…</div>
              ) : (
                restaurants.map((rest) => (
                  <div key={rest._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    <img
                      src={getImageSrc(rest.image, `https://placehold.co/800x400/e2e8f0/334155?text=${encodeURIComponent(rest.name || 'Restaurant')}`)}
                      alt={rest.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold">{rest.name}</p>
                          <p className="text-sm text-slate-500">{rest.cuisine}</p>
                        </div>
                        <button onClick={() => remove(rest._id)} className="rounded-xl bg-rose-500 px-3 py-2 text-sm text-white transition hover:bg-rose-600">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
            <h3 className="text-lg font-semibold">New Restaurant</h3>
            <div className="mt-4 space-y-4">
              {['name', 'cuisine', 'description'].map((field) => (
                <label key={field} className="block text-sm text-slate-700">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">{field}</span>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-500"
                  />
                </label>
              ))}
              <ImageUpload
                label="Restaurant Image"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Menu Items</h4>
                    <p className="text-xs text-slate-500">Add food items to this restaurant before saving.</p>
                  </div>
                </div>
                {menuItems.length > 0 ? (
                  <div className="space-y-3">
                    {menuItems.map((item, index) => (
                      <div key={`${item.name}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.description || 'No description'}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMenuItem(index)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Price: ${item.price.toFixed(2)}</p>
                        <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                          <img
                            src={getImageSrc(item.image, `https://placehold.co/500x250/f8fafc/334155?text=${encodeURIComponent(item.name || 'Food')}`)}
                            alt={item.name}
                            className="h-28 w-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No menu items added yet.</p>
                )}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-700">
                    <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Food name</span>
                    <input
                      type="text"
                      value={foodItem.name}
                      onChange={(e) => setFoodItem({ ...foodItem, name: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-500"
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Price</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={foodItem.price}
                      onChange={(e) => setFoodItem({ ...foodItem, price: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-500"
                    />
                  </label>
                </div>
                <label className="mt-4 block text-sm text-slate-700">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Description</span>
                  <textarea
                    value={foodItem.description}
                    onChange={(e) => setFoodItem({ ...foodItem, description: e.target.value })}
                    className="mt-2 h-24 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-500"
                  />
                </label>
                <div className="mt-4">
                  <ImageUpload
                    label="Food Image"
                    value={foodItem.image}
                    onChange={(url) => setFoodItem({ ...foodItem, image: url })}
                  />
                </div>
                <button
                  type="button"
                  onClick={addMenuItem}
                  className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Add Menu Item
                </button>
              </div>
            </div>
            <button type="submit" className="mt-5 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Add Restaurant
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
