import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import animeRoutes from './routes/animeRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import tvShowRoutes from './routes/tvShowRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js'; 

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/animes', animeRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tvshows', tvShowRoutes);
app.use('/api/watchlist', watchlistRoutes); 

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
