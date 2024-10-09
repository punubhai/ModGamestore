import React, { useState } from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth for authentication
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import './Login.css'; // Use the same CSS file or create a new one for registration

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { register } = useAuth(); // Assume register is available in your context
  const navigate = useNavigate(); // Initialize navigate

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the email is valid
    if (!isValidEmail(username)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Check if the password is at least 8 characters long
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage('');
    try {
      await register(username, password); // Call register on form submission if validations pass
      navigate('/'); // Redirect to main body after successful registration
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.'); // Handle registration errors
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Create Account</h1>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="8" // Enforces a minimum length of 8 characters
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Confirm Password</label>
          <input
            type="password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength="8"
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display validation error messages */}
        <button type="submit" className="login-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
