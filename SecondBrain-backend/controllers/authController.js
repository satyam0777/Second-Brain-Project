import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


//registeruser
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar: `https://api.multiavatar.com/${name}.svg`
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User created', token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch {
    res.status(500).json({ error: 'Registration failed' });
  }
};

//loginuser
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};

//getinfo
export const getMe = async (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email, avatar: req.user.avatar, createdAt: req.user.createdAt });
};
