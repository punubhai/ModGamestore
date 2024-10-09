import React, { useState } from "react";
import './UploadGames.css'; // Ensure this file has the necessary styles

const UploadGames = () => {
  const [file, setFile] = useState(null); // For the APK file
  const [image, setImage] = useState(null); // For the game image
  const [gameTitle, setGameTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState(''); // Genre state
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showOptions, setShowOptions] = useState(false); // Show dropdown options

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.android.package-archive') {
        setFile(selectedFile);
        setUploadStatus('');
      } else {
        setUploadStatus('Please upload a valid APK file.');
        setFile(null);
      }
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage)); // Set image preview
    }
  };

  const handleUpload = async () => {
    // Ensure both files and all fields are filled
    if (!file || !image || !gameTitle || !description || !genre) {
      setUploadStatus('Please fill out all fields and select both an APK and an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('apk', file); // Add APK file to FormData
    formData.append('image', image); // Add image file to FormData
    formData.append('title', gameTitle); // Add game title to FormData
    formData.append('description', description); // Add game description to FormData
    formData.append('genre', genre); // Add genre to FormData

    try {
      setIsLoading(true); // Set loading state to true
      setUploadStatus('Uploading...'); // Set upload status to loading message

      const response = await fetch('https://gamestorebackend.onrender.com/upload-files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Upload successful! Your game has been uploaded.'); // Success message
        // Reset form fields
        setFile(null);
        setImage(null);
        setImagePreview(null); // Reset image preview
        setGameTitle('');
        setDescription('');
        setGenre(''); // Reset genre
      } else {
        const errorData = await response.json();
        setUploadStatus(`Upload failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      setUploadStatus('An error occurred during upload. Please check your connection.');
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Custom dropdown handler
  const handleGenreSelect = (selectedGenre) => {
    setGenre(selectedGenre);
    setShowOptions(false);
  };

  return (
    <div className="upload-games-container">
      <div className="upload-games">
        <h1>Upload Game</h1>
        <input
          type="text"
          placeholder="Game Title"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Game Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Custom Dropdown for genre selection */}
        <label htmlFor="genre" style={{ margin: '10px 0', color: '#fff' }}>Select Genre:</label>
        <div className="custom-dropdown" onClick={() => setShowOptions(!showOptions)}>
          <div className="selected">{genre || 'Select a genre'}</div>
          {showOptions && (
            <div className="options">
              {['Action', 'RPG', 'Strategy', 'Adventure'].map((option) => (
                <div key={option} className="option" onClick={() => handleGenreSelect(option)}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add text message above the image upload input */}
        <p style={{ margin: '10px 0', color: '#fff' }}>Upload the image of the game</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {/* Image preview */}
        {imagePreview && <img src={imagePreview} alt="Game Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', margin: '10px 0' }} />}

        {/* Label for APK upload */}
        <p style={{ margin: '10px 0', color: '#fff' }}>Upload APK</p>
        <input
          type="file"
          accept=".apk"
          onChange={handleFileChange}
          required
        />

        <button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
        {uploadStatus && <p aria-live="assertive">{uploadStatus}</p>} {/* Accessibility for upload status */}
      </div>

      {/* Footer section */}
      <footer className="footer">
        <h3>GAMEFORGE, a mod games website developed for downloading modded games</h3>
        <p>Frontend: Sahil Rasal, Sanchit Raul</p>
        <p>Backend: Punav Shigwan, Pratik Vishe</p>
        <p>© 2024 GameForge. All rights reserved.</p>

        <div className="social-media-icons">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/X_icon_2.svg/600px-X_icon_2.svg.png?20231002152819" alt="Twitter" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1024px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png" alt="Instagram" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1024px-Octicons-mark-github.svg.png" alt="GitHub" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default UploadGames;
