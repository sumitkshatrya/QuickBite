import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import foodRoutes from './routes/food.js';
import orderRoutes from './routes/orders.js';
import restaurantRoutes from './routes/restaurants.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QuickBite API is running',
  });
});

app.use('/auth', authRoutes);
app.use('/foods', foodRoutes);
app.use('/orders', orderRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/users', userRoutes);
app.use('/uploads', uploadRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/auth') ||
    req.path.startsWith('/foods') ||
    req.path.startsWith('/orders') ||
    req.path.startsWith('/restaurants') ||
    req.path.startsWith('/users') ||
    req.path.startsWith('/uploads')
  ) {
    return next();
  }

  res.sendFile(path.join(distPath, 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

