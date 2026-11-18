import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use(errorHandler);

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/habit-tracker')
  .then(() => app.listen(port, () => console.log(`mongo db also connected API running on http://localhost:${port}`)))
  .catch((error) => { console.error('MongoDB connection failed:', error.message); app.listen(port, () => console.log(`API running without database on http://localhost:${port}`)); });
