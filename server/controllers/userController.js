import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const getUsers = async (req, res) => {
  if (!req.user?.isAdmin) {
    res.status(403);
    throw new Error('Access denied');
  }

  const users = await User.find().select('-password');
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!req.user.isAdmin && user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  res.json(user);
};

export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

export const updateUserProfile = async (req, res) => {
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
  });
};

export const updateUser = async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error('Access denied');
  }

  const { name, email, isAdmin } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const user = await User.findById(req.params.id);

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

  user.name = name?.trim() || user.name;
  user.email = normalizedEmail || user.email;
  if (typeof isAdmin === 'boolean') {
    user.isAdmin = isAdmin;
    user.role = isAdmin ? 'admin' : 'user';
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    role: updatedUser.role,
  });
};

export const deleteUser = async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error('Access denied');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.json({ message: 'User deleted successfully' });
};
