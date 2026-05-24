import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: false,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    tags: [String],
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
    prepTime: {
      type: Number,
      default: 15,
      min: 0,
    },
    calories: {
      type: Number,
      min: 0,
    },
    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

foodItemSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });
foodItemSchema.index({ restaurant: 1, category: 1 });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
export default FoodItem;
