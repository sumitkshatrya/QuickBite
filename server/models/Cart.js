import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    name: { type: String },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    coupon: {
      code: String,
      discountAmount: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 });

cartSchema.methods.recalculate = function () {
  const subtotal = this.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);
  this.subtotal = Math.max(0, subtotal);
  this.total = Math.max(0, this.subtotal + (this.deliveryFee || 0) - (this.coupon?.discountAmount || 0));
  return this.total;
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
