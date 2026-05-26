export const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = [
      {
        id: 'rest1',
        name: 'Stella Kitchen',
        cuisine: 'Italian Bistro',
        description: 'Warm atmosphere with pasta, pizzas, and craft cocktails.',
        rating: 4.8,
        time: 22,
        delivery: 'Free delivery',
        categories: ['Italian', 'Pizza', 'Pastas'],
        image: 'https://images.unsplash.com/photo-1555992336-03a23c13fdb8?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'rest2',
        name: 'Urban Bites',
        cuisine: 'Street Food',
        description: 'Creative bowls, loaded tacos, and bold flavor combinations.',
        rating: 4.7,
        time: 18,
        delivery: 'Low delivery fee',
        categories: ['Street food', 'Burgers', 'Tacos'],
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'rest3',
        name: 'Green Harbor',
        cuisine: 'Vegan & Healthy',
        description: 'Seasonal salads, nutrient bowls, and wellness drinks.',
        rating: 4.9,
        time: 20,
        delivery: 'Fast delivery',
        categories: ['Healthy', 'Vegan', 'Bowls'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'rest4',
        name: 'Spice Route',
        cuisine: 'Indian Fusion',
        description: 'Bold spices, rich curries, and handcrafted naan.',
        rating: 4.6,
        time: 28,
        delivery: 'Free delivery over $30',
        categories: ['Indian', 'Curry', 'Fusion'],
        image: 'https://images.unsplash.com/photo-1547592180-0a1351780621?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'rest5',
        name: 'Seaside Sushi',
        cuisine: 'Japanese',
        description: 'Fresh rolls, sashimi platters, and premium seafood.',
        rating: 4.85,
        time: 24,
        delivery: 'Premium packaging',
        categories: ['Sushi', 'Japanese', 'Seafood'],
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
      },
    ];

    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};
