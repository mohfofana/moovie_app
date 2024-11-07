// streaming-site/models/TvShow.js

import mongoose from 'mongoose';

const tvShowSchema = new mongoose.Schema({
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

const TvShow = mongoose.model('TvShow', tvShowSchema);
export default TvShow;
