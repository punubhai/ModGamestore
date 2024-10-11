import axios from "axios";
import React, { useEffect, useState } from "react";
import "./body.css";

// Popup component...
const Popup = ({ game, onClose }) => { 
  const handleDownload = () => { 
    const link = document.createElement("a"); 
    link.href = `https://gamestorebackend.onrender.com/files/${game.apk}`; 
    link.setAttribute("download", game.apk); 
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link); 
  }; 

  return ( 
    <div className="popup-overlay"> 
      <div className="popup-content"> 
        <h2>{game.title}</h2> 
        <img 
          src={`https://gamestorebackend.onrender.com/images/${game.image}`} 
          alt={game.title} 
          className="popup-image" 
        /> 
        <p>Genre: {game.genre}</p> 
        <p>Description: {game.description || 'No description available'}</p> 
        <button onClick={onClose} className="popup-close-button">Close</button> 
        <button onClick={handleDownload} className="popup-download-button">Download APK</button> 
      </div> 
    </div> 
  ); 
}; 

const Body = ({ searchTerm = '', sortOrder = 'asc', selectedGenre = '' }) => { 
  const [games, setGames] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [filteredGames, setFilteredGames] = useState([]); 
  const [selectedGame, setSelectedGame] = useState(null); 

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://gamestorebackend.onrender.com/get-files');
        if (response.data.status === 'ok') {
          setGames(response.data.data);
        } else {
          console.error(response.data.message);
          setError("Failed to fetch games.");
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Error fetching games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = games.filter(game =>
      game.title.toLowerCase().includes(lowercasedSearchTerm) &&
      (selectedGenre ? game.genre === selectedGenre : true)
    );

    const sortedFilteredGames = filtered.sort((a, b) =>
      sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );

    setFilteredGames(sortedFilteredGames);
  }, [games, searchTerm, sortOrder, selectedGenre]);

  // Define the handleGameClick function
  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleClosePopup = () => {
    setSelectedGame(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="game-container">
          {loading ? (
            <p>Loading games...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : filteredGames.length === 0 ? (
            <p>No games available.</p>
          ) : (
            filteredGames.map((game) => (
              <div key={game._id} className="game-card" onClick={() => handleGameClick(game)}>
                <img
                  src={`https://gamestorebackend.onrender.com/images/${game.image}`}
                  alt={game.title}
                  className="game-image"
                />
                <div className="game-info">
                  <h3>{game.title}</h3>
                  <p>Genre: {game.genre || 'Not specified'}</p>
                  <p>Description: {game.description || 'No description available'}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {selectedGame && (
          <Popup game={selectedGame} onClose={handleClosePopup} />
        )}
      </header>

      {/* AdSense Section */}
      <div className="ads-container" style={{ marginTop: '20px' }}>
        <ins className="adsbygoogle"
          style={{ display: "block", width: "300px", height: "250px" }} // Set explicit width and height
          data-ad-client="ca-pub-5318370501565991"
          data-ad-slot="6963475194"
          data-ad-format="rectangle" // Change to a specific format
          data-full-width-responsive="true"></ins>
      </div>

      {/* Footer section */}
      <footer className="footer">
        <p>GAMEFORGE: A mod games website developed for downloading modded games</p>
        <p>Frontend: Sahil Rasal, Sanchit Raul</p>
        <p>Backend: Punav Shigwan, Pratik Vishe</p>
        <p>© 2024 GameForge. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Body;
