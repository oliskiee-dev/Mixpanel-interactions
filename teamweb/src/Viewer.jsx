import React, { useState, useEffect } from "react";
import Header from "./Viewer/Component/Header.jsx";
import Footer from "./Viewer/Component/Footer.jsx";
import "./Viewer.css"; 

function Viewer() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      <Header />

      {/* Main Section */}
      <div className="main-container">
        <div className="school-image-container">
          <img src="/assets/images/school.jpg" alt="School" className="school-image" />
        </div>

        <div className="welcome-section">
          <h1 className="welcome-text">
            <span className="welcome-small">WELCOME TO</span> <br />
            <span className="teamian-text">Teamian</span> <span className="web-text">Web</span>
          </h1>
          <a href="announcement" className="explore-btn">Explore →</a>
        </div>
      </div>

      {/* Latest News Section with Slideshow */}
      <div className="latest-news">
        <h2>LATEST NEWS</h2>
        <div className="news-container">
          {/* Left Arrow */}
          <button className="prev-btn" onClick={prevSlide}>‹</button>

          {images.length > 0 ? (
            <div className="news-item">
              {console.log("Rendering image from:", `http://localhost:3000/homepage/${images[currentIndex].image_url}`)}
              <img 
                src={`http://localhost:3000/homepage/${images[currentIndex].image_url}`} 
                alt="News" 
                className="news-image" 
              />
            </div>
          ) : (
            <p>No news images uploaded yet.</p>
          )}

          {/* Right Arrow */}
          <button className="next-btn" onClick={nextSlide}>›</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Viewer;
