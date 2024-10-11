// App.js
import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Body from "./components/Body";
import Login from "./components/Login";
import Header from "./components/Navbar";
import Register from "./components/Register";
import UploadGames from "./components/UploadGames";

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5318370501565991";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []); // Correctly using useEffect inside the component

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSortOrder = (sort) => {
    setSortOrder(sort);
  };

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <Router>
      <div className="App">
        <Header 
          onSearch={handleSearch} 
          onSortOrderChange={handleSortOrder}
          onGenreFilter={handleGenreFilter} 
        />
        <Routes>
          <Route path="/" element={<Body searchTerm={searchTerm} sortOrder={sortOrder} selectedGenre={selectedGenre} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload-games" element={<ProtectedRoute element={<UploadGames />} />} />
        </Routes>
      </div>
    </Router>
  );
};

// Example of a protected route
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

export default App;
