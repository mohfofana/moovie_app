// streaming-site/models/Anime.js

import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  releaseDate: {
    type: Date,
  },
  imageUrl: {
    type: String,
  },
});

const Anime = mongoose.model('Anime', animeSchema);
export default Anime;
