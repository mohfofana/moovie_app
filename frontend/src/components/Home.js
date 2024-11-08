import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const [randomContent, setRandomContent] = useState(null);  // Nouveau state pour le contenu aléatoire
    const [popularMovies, setPopularMovies] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Récupérer un contenu aléatoire (film, série ou anime)
        axios.get('http://localhost:8080/api/random')
            .then(response => {
                setRandomContent(response.data);  // Mettre à jour le state avec la réponse

                // Mettre à jour le background du body avec l'image aléatoire récupérée
                document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${response.data.background})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
            })
            .catch(error => {
                console.error("There was an error fetching the random content!", error);
            });

        // Récupérer les films populaires
        axios.get('http://localhost:8080/api/movies/popular')
            .then(response => {
                setPopularMovies(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the popular movies!", error);
            });

        // Récupérer la watchlist
        axios.get('http://localhost:5000/api/watchlist')
            .then(response => {
                setWatchlist(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the watchlist!", error);
            });  

        // Récupérer les favoris
        axios.get('http://localhost:5000/api/favorites')
            .then(response => {
                setFavorites(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the favorites!", error);
            });
    }, []);

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">tMovies</div>
                <ul className="nav-links">
                    <li className="active">Home</li>
                    <li>Movies</li>
                    <li>Tv Series</li>
                </ul>
                <div className="theme-toggle">
                    <i className="fas fa-moon"></i> {/* Icone de lune pour le mode nuit */}
                </div>
            </nav>

            {/* Affichage du contenu aléatoire */}
            {randomContent && (
                <div className="banner">
                    <div className="banner-content">
                        <h1>{randomContent.title}</h1>
                        <p>{randomContent.overview}</p>
                        <div className="buttons">
                            <button className="watch-now">Watch now</button>
                            <button className="watch-trailer">Watch trailer</button>
                        </div>
                    </div>
                    <div className="poster">
                        <img src={randomContent.image} alt="Movie Poster" />
                    </div>
                </div>
            )}
            

            {/* Section Popular */}
            <div className="popular">
                <h2>Popular Movies</h2>
                <div className="card-slider">
                    {popularMovies.map(movie => (
                        <div key={movie.id} className="card">
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                            <h3>{movie.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Watchlist */}
            <div className="watchlist">
                <h2>Watchlist</h2>
                <div className="cards">
                    {watchlist.map(movie => (
                        <div key={movie.id} className="card">
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                            <h3>{movie.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Favorites */}
            <div className="favorites">
                <h2>Favorites</h2>
                <div className="cards">
                    {favorites.map(movie => (
                        <div key={movie.id} className="card">
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                            <h3>{movie.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
