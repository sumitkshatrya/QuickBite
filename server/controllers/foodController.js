import FoodItem from '../models/FoodItem.js';

export const getFoods = async (req, res, next) => {
  const {
    search,
    category,
    restaurant,
    minPrice,
    maxPrice,
    minRating,
    isVegetarian,
    sort,
  } = req.query;

  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (restaurant) {
    query.restaurant = restaurant;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (minRating) {
    query['rating.avg'] = { $gte: Number(minRating) };
  }

  if (isVegetarian === 'true') {
    query.isVegetarian = true;
  } else if (isVegetarian === 'false') {
    query.isVegetarian = false;
  }

  const sortOptions = {};
  if (sort === 'price_asc') sortOptions.price = 1;
  else if (sort === 'price_desc') sortOptions.price = -1;
  else if (sort === 'rating_asc') sortOptions['rating.avg'] = 1;
  else if (sort === 'rating_desc') sortOptions['rating.avg'] = -1;
  else if (sort === 'newest') sortOptions.createdAt = -1;
  else if (search) sortOptions.score = { $meta: 'textScore' };
  else sortOptions.createdAt = -1;

  const foods = await FoodItem.find(query).sort(sortOptions).lean();

  if (foods.length === 0) {
    const total = await FoodItem.countDocuments();
    if (total === 0) {
      await FoodItem.insertMany([
        {
          name: 'Classic Margherita Pizza',
          description: 'Tomato sauce, fresh mozzarella, basil and olive oil.',
          price: 14.99,
          category: 'Pizza',
          isVegetarian: true,
          rating: { avg: 4.6, count: 120 },
          image: 'https://images.unsplash.com/photo-1601924572997-9f6a7ec5c7e4?auto=format&fit=crop&w=900&q=80',
        },
        {
          name: 'Spicy Chicken Burger',
          description: 'Seared chicken breast, crisp lettuce, and spicy aioli.',
          price: 12.5,
          category: 'Burger',
          isVegetarian: false,
          rating: { avg: 4.4, count: 94 },
          image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
        },
        {
          name: 'Vegan Buddha Bowl',
          description: 'Quinoa, roasted vegetables, chickpeas and tahini dressing.',
          price: 11.25,
          category: 'Vegan',
          isVegetarian: true,
          rating: { avg: 4.8, count: 76 },
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
        },
      ]);
      return res.json(await FoodItem.find(query).sort(sortOptions).lean());
    }
  }

  res.json(foods);
};

export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if id is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    const food = await FoodItem.findById(id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(food);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching food item' });
  }
};

export const createFood = async (req, res) => {
  const {
    name,
    description,
    price,
    image,
    category,
    restaurant,
    tags,
    isVegetarian,
    available,
    prepTime,
    calories,
  } = req.body;

  if (!name?.trim() || !description?.trim() || price == null) {
    res.status(400);
    throw new Error('Name, description, and price are required');
  }

  const normalizedPrice = Number(price);
  if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
    res.status(400);
    throw new Error('Price must be a valid non-negative number');
  }

  const food = await FoodItem.create({
    name: name.trim(),
    description: description.trim(),
    price: normalizedPrice,
    image: image || '',
    category: category?.trim() || '',
    restaurant: restaurant || undefined,
    tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
    isVegetarian: Boolean(isVegetarian),
    available: available ?? true,
    prepTime: Number.isFinite(Number(prepTime)) ? Number(prepTime) : undefined,
    calories: Number.isFinite(Number(calories)) ? Number(calories) : undefined,
  });
  res.status(201).json(food);
};

export const createFoodsBulk = async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (items.length === 0) {
    res.status(400);
    throw new Error('At least one food item is required');
  }

  const normalizedItems = items.map((item, index) => {
    const name = item?.name?.trim();
    const description = item?.description?.trim();
    const normalizedPrice = Number(item?.price);

    if (!name || !description || item?.price == null) {
      res.status(400);
      throw new Error(`Food item ${index + 1} requires name, description, and price`);
    }

    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      res.status(400);
      throw new Error(`Food item ${index + 1} must have a valid non-negative price`);
    }

    return {
      name,
      description,
      price: normalizedPrice,
      image: item?.image || '',
      category: item?.category?.trim() || '',
      restaurant: item?.restaurant || undefined,
      tags: Array.isArray(item?.tags) ? item.tags.filter(Boolean) : [],
      isVegetarian: Boolean(item?.isVegetarian),
      available: item?.available ?? true,
      prepTime: Number.isFinite(Number(item?.prepTime)) ? Number(item.prepTime) : undefined,
      calories: Number.isFinite(Number(item?.calories)) ? Number(item.calories) : undefined,
    };
  });

  const foods = await FoodItem.insertMany(normalizedItems);
  res.status(201).json(foods);
};

export const updateFood = async (req, res) => {
  const {
    name,
    description,
    price,
    image,
    category,
    restaurant,
    tags,
    isVegetarian,
    available,
    prepTime,
    calories,
  } = req.body;
  const food = await FoodItem.findById(req.params.id);

  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }

  if (price != null) {
    const normalizedPrice = Number(price);
    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      res.status(400);
      throw new Error('Price must be a valid non-negative number');
    }
    food.price = normalizedPrice;
  }

  food.name = name?.trim() || food.name;
  food.description = description?.trim() || food.description;
  food.image = image ?? food.image;
  food.category = category?.trim() || food.category;
  food.restaurant = restaurant ?? food.restaurant;
  food.tags = Array.isArray(tags) ? tags.filter(Boolean) : food.tags;
  if (typeof isVegetarian === 'boolean') food.isVegetarian = isVegetarian;
  if (typeof available === 'boolean') food.available = available;
  if (prepTime != null) food.prepTime = Number(prepTime);
  if (calories != null) food.calories = Number(calories);

  const updatedFood = await food.save();
  res.json(updatedFood);
};

export const deleteFood = async (req, res) => {
  const food = await FoodItem.findById(req.params.id);

  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }

  await food.deleteOne();
  res.json({ message: 'Food item deleted successfully' });
};
