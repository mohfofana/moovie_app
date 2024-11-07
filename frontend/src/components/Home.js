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
                    <i className="fas fa-moon"></i> {/* Icone de lune pour le mode nuit */}
                </div>
            </nav>

            <div className="banner">
                <img className="banner-background" src="image_url" alt="Background" />
                <div className="banner-content">
                    <h1>Chicken Run: Dawn of the Nugget</h1>
                    <p>
                        A band of fearless chickens flock together to save poultry-kind from an unsettling new threat: 
                        a nearby farm that's cooking up something suspicious.
                    </p>
                    <div className="buttons">
                        <button className="watch-now">Watch now</button>
                        <button className="watch-trailer">Watch trailer</button>
                    </div>
                </div>
                <div className="poster">
                    <img src="https://image.tmdb.org/t/p/w500/dDBTUSl3tRsOeKC1jZugBSFHy9I.jpg" alt="Movie Poster" />
                </div>
            </div>
        </div>
    );
};

export default Home;
