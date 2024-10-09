import React, { useState } from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth for authentication
import './Login.css'; // Ensure CSS file exists

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth(); // Use login from context

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event) => {
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

    setErrorMessage('');
    login(); // Call login on form submission if validations pass
  };

  const handleGoogleLogin = () => {
    window.open('https://accounts.google.com/signin/v2/identifier', '_blank');
  };

  const handleFacebookLogin = () => {
    window.open('https://www.facebook.com/login', '_blank');
  };

  const handleTwitterLogin = () => {
    window.open('https://twitter.com/login', '_blank');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>
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
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display validation error messages */}
        <button type="submit" className="login-button">Sign In</button>
        <div className="sign-in-options">
          <p className="sign-in-text">Sign in using:</p>
          <div className="social-icons">
            <img
              src="https://static.vecteezy.com/system/resources/previews/013/948/549/large_2x/google-logo-on-transparent-white-background-free-vector.jpg"
              alt="Google"
              className="social-icon"
              onClick={handleGoogleLogin}
              style={{ cursor: 'pointer' }}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/X_icon_2.svg/600px-X_icon_2.svg.png?20231002152819"
              alt="Twitter"
              className="social-icon"
              onClick={handleTwitterLogin}
              style={{ cursor: 'pointer' }}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/600px-2023_Facebook_icon.svg.png"
              alt="Facebook"
              className="social-icon"
              onClick={handleFacebookLogin}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
