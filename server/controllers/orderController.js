import Order from '../models/Order.js';
import FoodItem from '../models/FoodItem.js';

export const getUserOrders = async (req, res, next) => {
  const query = req.user.isAdmin ? {} : { user: req.user._id };
  const orders = await Order.find(query).populate('items.food');
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.food');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  res.json(order);
};

export const createOrder = async (req, res) => {
  const { items, shippingAddress = {}, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Order items are required');
  }

  const orderItems = items.map((item) => ({
    food: item.food || item.foodId || item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity || 1,
  }));

  if (orderItems.some((item) => !item.food || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) < 1)) {
    res.status(400);
    throw new Error('Each order item must include a valid food reference and quantity');
  }

  const foodIds = orderItems.map((item) => item.food);
  const foods = await FoodItem.find({ _id: { $in: foodIds } });
  const missingItems = orderItems.filter(
    (item) => !foods.find((food) => food._id.toString() === item.food.toString())
  );

  if (missingItems.length > 0) {
    res.status(400);
    throw new Error('One or more food items are invalid');
  }

  const priceMap = new Map(foods.map((food) => [food._id.toString(), food]));
  const normalizedOrderItems = orderItems.map((item) => {
    const food = priceMap.get(item.food.toString());
    return {
      food: item.food,
      name: food.name,
      price: food.price,
      quantity: Number(item.quantity),
    };
  });

  const subtotal = normalizedOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const safePaymentMethod = ['card', 'cash', 'wallet', 'online'].includes(paymentMethod) ? paymentMethod : 'card';

  const order = await Order.create({
    user: req.user._id,
    items: normalizedOrderItems,
    subtotal,
    deliveryFee: 0,
    total: subtotal,
    paymentMethod: safePaymentMethod,
    shippingAddress: {
      name: shippingAddress.name?.trim() || '',
      email: shippingAddress.email?.trim().toLowerCase() || '',
      address: shippingAddress.address?.trim() || '',
      city: shippingAddress.city?.trim() || '',
      postalCode: shippingAddress.postalCode?.trim() || '',
    },
    status: 'booked',
  });

  await order.populate('items.food');
  res.status(201).json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const valid = ['booked', 'preparing', 'on_the_way', 'delivered', 'failed', 'cancelled'];

  if (!valid.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error('Admin access required');
  }

  order.status = status;
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.failedAt = null;
  }
  if (status === 'failed') {
    order.failedAt = new Date();
    order.deliveredAt = null;
  }

  await order.save();
  const updated = await Order.findById(order._id).populate('items.food');
  res.json(updated);
};

export const getOrderTracking = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.food');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only owner or admin
  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  // Return light tracking payload
  res.json({
    _id: order._id,
    status: order.status,
    items: order.items.map((i) => ({ name: i.name || i.food.name, quantity: i.quantity })),
    subtotal: order.subtotal,
    total: order.total,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    deliveredAt: order.deliveredAt || null,
  });
};
