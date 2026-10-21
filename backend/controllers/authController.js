const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
const safe = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, sites: u.sites });

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matches(password))) return res.status(401).json({ message: 'Incorrect email or password' });
    res.json({ token: sign(user), user: safe(user) });
  } catch (e) { next(e); }
};

// Admin creates accounts (no public sign-up in a compliance tool)
exports.createUser = async (req, res, next) => {
  try { res.status(201).json(safe(await User.create(req.body))); } catch (e) { next(e); }
};

exports.listUsers = async (req, res, next) => {
  try { res.json(await User.find().select('name email role sites')); } catch (e) { next(e); }
};

exports.me = (req, res) => res.json(safe(req.user));
