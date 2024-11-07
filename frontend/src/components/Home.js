// src/components/Home.js
import React from 'react';
import './Home.css';

const Home = () => {
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
                    <i className="fas fa-moon"></i>
                </div>
            </nav>

            <div className="main-content">
                <div className="banner">
                    <img className="banner-background" src="image_url" alt="Background" />
                    <div className="banner-content">
                        <h1>Chicken Run: Dawn of the Nugget</h1>
                        <p>A band of fearless chickens flock together to save poultry-kind from an unsettling new threat.</p>
                        <div className="buttons">
                            <button className="watch-now">Watch now</button>
                            <button className="watch-trailer">Watch trailer</button>
                        </div>
                    </div>
                    <div className="poster">
                        <img src="https://image.tmdb.org/t/p/w500/dDBTUSl3tRsOeKC1jZugBSFHy9I.jpg" alt="Movie Poster" />
                    </div>
                </div>

                <div className="popular-section">
                    <h2>Popular</h2>
                    <div className="card-container no-scroll">
                        {[...Array(8)].map((_, index) => (
                            <div className="card" key={index}>
                                <img src="https://via.placeholder.com/150" alt={`Movie ${index + 1}`} />
                                <p>Movie {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="watchlist-section">
                    <h2>Watchlist</h2>
                    <div className="card-container">
                        {[...Array(6)].map((_, index) => (
                            <div className="card" key={index}>
                                <img src="https://via.placeholder.com/150" alt={`Watchlist ${index + 1}`} />
                                <p>Watchlist {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="favorites-section">
                    <h2>Favorites</h2>
                    <div className="card-container">
                        {[...Array(6)].map((_, index) => (
                            <div className="card" key={index}>
                                <img src="https://via.placeholder.com/150" alt={`Favorite ${index + 1}`} />
                                <p>Favorite {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
