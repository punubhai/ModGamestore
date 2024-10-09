// App.js
import React, { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"; // Import Navigate for redirection
import { AuthProvider, useAuth } from "./AuthContext"; // Import AuthContext
import Body from "./components/Body";
import Login from "./components/Login"; // Import the Login page
import Header from "./components/Navbar";
import Register from "./components/Register"; // Import the Register page
import UploadGames from "./components/UploadGames"; // Upload Games component

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedGenre, setSelectedGenre] = useState('');

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
    <AuthProvider> {/* Wrap with AuthProvider */}
      <Router>
        <div className="App">
          <Header 
            onSearch={handleSearch} 
            onSortOrderChange={handleSortOrder}
            onGenreFilter={handleGenreFilter} 
          />
          <Routes>
            <Route path="/" element={<Body searchTerm={searchTerm} sortOrder={sortOrder} selectedGenre={selectedGenre} />} />
            <Route path="/login" element={<Login />} /> {/* Route for login */}
            <Route path="/register" element={<Register />} /> {/* Route for registration */}
            <Route path="/upload-games" element={<UploadGames />} /> {/* Route for Upload Games */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

// Example of a protected route
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth(); // Get user info from AuthContext
  return user ? element : <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default App;
