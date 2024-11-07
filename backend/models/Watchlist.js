import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
    mediaId: { type: String, required: true }, // ID unique du média (ex: ID de TMDB)
    title: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String, required: true },
    releaseDate: { type: Date },
    genre: { type: [String] }
    // Ajoutez d'autres champs pertinents pour le média
}, { _id: false });

const WatchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    items: [MediaSchema] // Contient une liste d'objets médias
});

export default mongoose.model('Watchlist', WatchlistSchema);
