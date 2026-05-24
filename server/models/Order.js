import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'FoodItem',
          required: true,
        },
        name: { type: String },
        price: { type: Number },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash', 'wallet', 'online'],
      default: 'card',
    },
    shippingAddress: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    status: {
      type: String,
      required: true,
      default: 'booked',
      enum: ['booked', 'preparing', 'on_the_way', 'delivered', 'failed', 'cancelled'],
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
