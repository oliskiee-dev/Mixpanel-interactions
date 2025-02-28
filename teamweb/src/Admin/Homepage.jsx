import React, { useState, useEffect } from "react";
import AdminHeader from "./Component/AdminHeader.jsx";
import "./Homepage.css"; // Ensure to apply styles properly

function Homepage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const response = await fetch("http://localhost:5000/images");
    const data = await response.json();
    setImages(data);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      fetchImages();
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchImages();
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
            📂 Choose File
          </label>
        </div>

        {/* Image List Grid */}
        <div className="image-list">
          {images.map((img) => (
            <div key={img._id} className="image-box">
              <img src={`http://localhost:5000${img.filepath}`} alt="Uploaded" className="preview-image" />
              <button onClick={() => handleDelete(img._id)} className="delete-btn">🗑 Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Homepage;
