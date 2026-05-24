import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import FoodItem from '../models/FoodItem.js';

export const getRestaurants = async (req, res) => {
  const { search, category, minRating, sort } = req.query;
  const query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }

  if (category && category !== 'All') {
    query.categories = category;
  }

  if (minRating) {
    query['rating.avg'] = { $gte: Number(minRating) };
  }

  const sortOptions = {};
  if (sort === 'rating_desc') sortOptions['rating.avg'] = -1;
  else if (sort === 'rating_asc') sortOptions['rating.avg'] = 1;
  else if (sort === 'newest') sortOptions.createdAt = -1;
  else if (search) sortOptions.score = { $meta: 'textScore' };
  else sortOptions.createdAt = -1;

  const restaurants = await Restaurant.find(query).sort(sortOptions).lean();
  res.json(restaurants);
};

export const getRestaurantById = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.json(restaurant);
};

export const createRestaurant = async (req, res) => {
  const { name, description, cuisine, address, location, deliveryFee, categories, image, contact, openingHours, foods } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Name is required');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [restaurant] = await Restaurant.create([
      {
        name,
        description: description || '',
        cuisine: cuisine || '',
        address: address || {},
        location: location || { type: 'Point', coordinates: [0, 0] },
        deliveryFee: deliveryFee || 0,
        categories: categories || [],
        image: image || '',
        contact: contact || {},
        openingHours: openingHours || '',
      },
    ], { session });

    if (Array.isArray(foods) && foods.length > 0) {
      const validFoods = foods
        .filter((item) => item && item.name && item.price !== undefined && item.price !== null)
        .map((item) => ({
          name: item.name,
          description: item.description || '',
          price: Number(item.price) || 0,
          image: item.image || '',
          restaurant: restaurant._id,
          category: item.category || '',
          isVegetarian: item.isVegetarian || false,
        }));

      if (validFoods.length > 0) {
        await FoodItem.insertMany(validFoods, { session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(restaurant);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const updateRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  restaurant.name = req.body.name ?? restaurant.name;
  restaurant.description = req.body.description ?? restaurant.description;
  restaurant.cuisine = req.body.cuisine ?? restaurant.cuisine;
  restaurant.address = req.body.address ?? restaurant.address;
  restaurant.location = req.body.location ?? restaurant.location;
  restaurant.deliveryFee = req.body.deliveryFee ?? restaurant.deliveryFee;
  restaurant.categories = req.body.categories ?? restaurant.categories;
  restaurant.image = req.body.image ?? restaurant.image;
  restaurant.contact = req.body.contact ?? restaurant.contact;
  restaurant.openingHours = req.body.openingHours ?? restaurant.openingHours;
  restaurant.isActive = req.body.isActive ?? restaurant.isActive;

  const updatedRestaurant = await restaurant.save();
  res.json(updatedRestaurant);
};

export const deleteRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  await FoodItem.deleteMany({ restaurant: restaurant._id });
  await Restaurant.findByIdAndDelete(req.params.id);
  res.json({ message: 'Restaurant deleted' });
};
