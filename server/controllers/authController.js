import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

const createToken = (user) => jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

export const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

export async function register(req, res, next) {
  try {
    const email = String(req.body.email|| '').trim().toLowerCase();
    const password = String(req.body.password|| '').trim();

    if (await User.exists({ email })) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = await User.create({ ...req.body, email, password });
    return res.status(201).json({
      success: true,
      token: createToken(user),
      user: serializeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '').trim();

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    return res.status(200).json({
      success: true,
      token: createToken(user),
      user: serializeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

export function getMe(req, res) {
  return res.status(200).json({ success: true, user: serializeUser(req.user) });
}

export async function forgotPassword(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ success: true, message: 'If that email exists, a reset link is ready.' });
    const resetToken = crypto.randomBytes(24).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    return res.status(200).json({ success: true, message: 'Reset link created. Use the code below.', resetToken });
  } catch (error) { return next(error); }
}

export async function resetPassword(req, res, next) {
  try {
    const token = crypto.createHash('sha256').update(String(req.body.token || '')).digest('hex');
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }).select('+password +resetPasswordToken +resetPasswordExpires');
    if (!user) return res.status(400).json({ message: 'This reset code is invalid or has expired.' });
    user.password = String(req.body.password || '');
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.status(200).json({ success: true, message: 'Password updated. You can sign in now.' });
  } catch (error) { return next(error); }
}