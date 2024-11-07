// streaming-site/models/Movie.js

import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
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

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
