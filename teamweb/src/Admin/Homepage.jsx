import React, { useState, useEffect } from "react";
import AdminHeader from "./Component/AdminHeader.jsx";
import "./Homepage.css";

function Homepage() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:3000/homepage/images");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Simulate upload progress
      const uploadTimer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadTimer);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("http://localhost:3000/homepage/upload-image", {
        method: "POST",
        body: formData,
      });
      
      clearInterval(uploadTimer);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      
      if (response.ok) {
        fetchImages();
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading image:", error);
    }
  };

  const confirmDelete = (image) => {
    setSelectedImage(image);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedImage) return;
    
    try {
      const response = await fetch(`http://localhost:3000/homepage/delete-image/${selectedImage.image_url}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchImages();
        setShowDeleteConfirm(false);
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="admin-container">
        <div className="admin-header">
          <h2 className="news-title">LATEST NEWS</h2>
          <p className="subtitle">Manage the images that appear in the news section</p>
        </div>

        {/* Upload Section */}
        <div className="upload-card">
          <div className="upload-header">
            <h3>Upload New Image</h3>
            <p>Accepted formats: JPG, PNG, GIF (Max: 5MB)</p>
          </div>
          
          {isUploading ? (
            <div className="upload-progress-container">
              <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
              <span className="upload-progress-text">{uploadProgress}%</span>
            </div>
          ) : (
            <label className="custom-file-upload">
              <input type="file" accept="image/*" onChange={handleUpload} />
              <span className="upload-icon">📷</span> Choose Image
            </label>
          )}
        </div>

        {/* Image List Grid */}
        <div className="images-container">
          <h3 className="section-title">Current Images ({images.length})</h3>
          
          {images.length === 0 ? (
            <div className="no-images">
              <p>No images uploaded yet. Add your first image to get started.</p>
            </div>
          ) : (
            <div className="image-list">
              {images.map((img) => {
                const imagePath = `http://localhost:3000/homepage/${img.image_url}`;
                return (
                  <div key={img._id} className="image-box">
                    <div className="image-container">
                      <img src={imagePath} alt="News" className="preview-image" />
                    </div>
                    <div className="image-info">
                      <span className="image-filename">{img.image_url.split('/').pop()}</span>
                      <button onClick={() => confirmDelete(img)} className="delete-btn">
                        <span className="delete-icon">🗑</span> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-backdrop">
          <div className="delete-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button className="close-modal" onClick={() => setShowDeleteConfirm(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this image?</p>
              {selectedImage && (
                <div className="confirm-image-preview">
                  <img 
                    src={`http://localhost:3000/homepage/${selectedImage.image_url}`} 
                    alt="To be deleted" 
                    className="confirm-preview"
                  />
                </div>
              )}
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="confirm-delete-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Homepage;