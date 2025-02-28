import React, { useState, useEffect } from "react";
import AdminHeader from "./Component/AdminHeader.jsx";
import "./Homepage.css"; // Ensure to apply styles properly

function Homepage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:3000/homepage/images");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      console.log("Fetched images:", data);
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3000/upload-image", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        fetchImages();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await fetch(`http://localhost:3000/delete-image/${filename}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchImages();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="admin-container">
        <h2 className="news-title">LATEST NEWS</h2>

        {/* Upload Section */}
        <div className="upload-card">
          <h3>Upload an Image</h3>
          <label className="custom-file-upload">
            <input type="file" onChange={handleUpload} />
            📂 Choose Image
          </label>
        </div>

        {/* Image List Grid */}
        <div className="image-list">
          {images.map((img) => {
            const imagePath = `http://localhost:3000/homepage/${img.image_url}`;
            console.log("Rendering image from:", imagePath);
            return (
              <div key={img._id} className="image-box">
                <img src={imagePath} alt="Uploaded" className="preview-image" />
                <button onClick={() => handleDelete(img.image_url)} className="delete-btn">🗑 Delete</button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Homepage;
