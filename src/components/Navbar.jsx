import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook 
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios"; // Import axios for API requests  
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Header.css';
import logoImage from './image/download (1).png';
 
const Header = ({ onSearch, sortOrder, onGenreFilter }) => { 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isGamesDropdownOpen, setGamesDropdownOpen] = useState(false); 
  const [filteredGames, setFilteredGames] = useState([]); 
  const [allGames, setAllGames] = useState([]); // Store all games from backend 
  const [loading, setLoading] = useState(false); // Track loading state 
  const [error, setError] = useState(null); // Track error state 
 
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0(); // Destructure Auth0 hooks
  const navigate = useNavigate();

  // Fetch games from backend on component mount
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://gamestorebackend.onrender.com/get-files');
        if (response.data.status === 'ok') {
          setAllGames(response.data.data);
        } else {
          setError("Failed to fetch games.");
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Error fetching games.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchTerm, sortOrder);
    setFilteredGames([]);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  };

  const handleGenreSelect = (genre) => {
    onGenreFilter(genre);
    setGamesDropdownOpen(false);
    if (genre === 'All') {
      onGenreFilter('');
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = allGames.filter(game =>
        game.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGames(filtered);
    } else {
      setFilteredGames([]);
    }
  };

  const handleSuggestionClick = (game) => {
    setSearchTerm(game.title);
    onSearch(game.title, sortOrder);
    setFilteredGames([]);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredGames([]);
  };

  const handleUploadClick = () => {
    navigate('/upload-games');
  };

  return (
    <header className="header">
      <div className="header__logo">
        <img src={logoImage} alt="GameForge Logo" />
        <span className="header__logo-text">PRGAMES</span>
      </div>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li
            className="header__nav-item"
            onMouseEnter={() => setGamesDropdownOpen(true)}
            onMouseLeave={() => setGamesDropdownOpen(false)}
          >
            <button className="header__nav-button" aria-haspopup="true" aria-expanded={isGamesDropdownOpen}>
              Games
              <i className="fas fa-chevron-down"></i>
            </button>
            {isGamesDropdownOpen && (
              <div className="header__dropdown">
                <button className="header__dropdown-item" onClick={() => handleGenreSelect('All')}>All</button>
                <button className="header__dropdown-item" onClick={() => handleGenreSelect('Action')}>Action</button>
                <button className="header__dropdown-item" onClick={() => handleGenreSelect('Adventure')}>Adventure</button>
                <button className="header__dropdown-item" onClick={() => handleGenreSelect('RPG')}>RPG</button>
                <button className="header__dropdown-item" onClick={() => handleGenreSelect('Strategy')}>Strategy</button>
              </div>
            )}
          </li>
          <li className="header__nav-item">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder="Search games..."
              className="header__search-input"
            />
            {filteredGames.length > 0 && (
              <ul className="header__suggestions">
                {filteredGames.map((game) => (
                  <li key={game._id} onClick={() => handleSuggestionClick(game)}>
                    <img src={`https://gamestorebackend.onrender.com/images/${game.image}`} alt={game.title} className="header__suggestion-image" />
                    {game.title}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={handleClearSearch} className="header__clear-button">Clear</button>
          </li>
          {isAuthenticated ? (
            <>
              <li className="header__nav-item">
                <span className="user-name">Welcome, {user.name}!</span>
              </li>
              <li className="header__nav-item" onClick={handleUploadClick}>
                <button className="header__nav-button">
                  Upload Games
                </button>
              </li>
              <li className="header__nav-item">
                <button
                  className="header__nav-button"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  <i className="fas fa-user-circle"></i> Logout
                </button>
              </li>
            </>
          ) : (
            <li className="header__nav-item">
              <button
                className="header__nav-button"
                onClick={() => loginWithRedirect()}
              >
                <i className="fas fa-user-circle"></i> Login
              </button>
            </li>
          )}
        </ul>
      </nav>
      {loading && <p>Loading games...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </header>
  );
};
 
export default Header;
