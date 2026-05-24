import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name?.trim() || !normalizedEmail || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long');
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Only allow 'user' or 'owner' to be created via public registration. Admins must be created via admin flows.
  const safeRole = role === 'owner' ? 'owner' : 'user';

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: safeRole,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const registerAdmin = async (req, res) => {
  const { name, email, password, phone, adminSecret } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name?.trim() || !normalizedEmail || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long');
  }

  if (process.env.ADMIN_SECRET && adminSecret !== process.env.ADMIN_SECRET) {
    res.status(403);
    throw new Error('Invalid admin registration secret');
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    phone: phone?.trim() || undefined,
    role: 'admin',
    isAdmin: true,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  if (user.role !== 'admin') {
    res.status(403);
    throw new Error('Not an admin account');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const logoutUser = async (req, res) => {
  // For stateless JWT, logout is handled client-side by removing token.
  res.json({ message: 'Logged out' });
};

export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(req.user);
};

export const updateCurrentUser = async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const { name, email, password } = req.body;
  const user = await User.findById(req.user._id);
  const normalizedEmail = email?.trim().toLowerCase();

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (normalizedEmail && normalizedEmail !== user.email) {
    const emailTaken = await User.findOne({ email: normalizedEmail });
    if (emailTaken) {
      res.status(400);
      throw new Error('Email already in use');
    }
  }

  if (password && password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long');
  }

  user.name = name?.trim() || user.name;
  user.email = normalizedEmail || user.email;

  if (password) {
    user.password = await bcrypt.hash(password, 12);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    role: updatedUser.role,
    token: generateToken(updatedUser._id),
  });
};
