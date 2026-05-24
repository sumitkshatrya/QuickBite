import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    cuisine: { type: String, index: true },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'INDIA' },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    deliveryFee: { type: Number, default: 0, min: 0 },
    categories: [String],
    image: { type: String },
    contact: {
      phone: String,
      email: String,
    },
    openingHours: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: 'text', cuisine: 'text', description: 'text', categories: 'text', 'address.city': 1 });
restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
