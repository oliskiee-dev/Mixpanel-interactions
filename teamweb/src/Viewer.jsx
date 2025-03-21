import React, { useState, useEffect, useCallback } from "react";
import Header from "./Viewer/Component/Header.jsx";
import Footer from "./Viewer/Component/Footer.jsx";
import "./Viewer.css";

function Viewer() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images using a more robust approach
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/homepage/images");
      if (!response.ok) throw new Error(`Failed to fetch images: ${response.status}`);
      const data = await response.json();
      setImages(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to load news images. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Auto rotation for carousel
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

  // Simplified - only active or not active
  const getItemClassName = (index) => {
    return index === currentIndex ? "news-item active" : "news-item";
  };

  return (
    <div className="page-container">
      <Header />

      {/* Main Hero Section */}
      <div className="main-container">
        <div className="welcome-section">
          <h1 className="welcome-text">
            <span className="welcome-small">WELCOME TO</span> <br />
            <span className="teamian-text">Teamian</span> <span className="web-text">Web</span>
          </h1>
          <p className="welcome-description">
            Empowering students through innovative education and technology
          </p>
          <a href="announcement" className="explore-btn">Explore →</a>
        </div>

        <div className="school-image-container">
          <img src="/assets/images/school.jpg" alt="School" className="school-image" />
        </div>
      </div>

      {/* Latest News Section with Simplified Slideshow */}
      <div className="latest-news">
        <h2>LATEST NEWS</h2>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading news...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : images.length > 0 ? (
          <>
            <div className="news-container">
              {/* Navigation Buttons */}
              <button className="prev-btn" onClick={prevSlide} aria-label="Previous slide">‹</button>
              
              {/* Display only the current image */}
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className={getItemClassName(index)}
                >
                  <img 
                    src={`http://localhost:3000/homepage/${image.image_url}`} 
                    alt={`News ${index + 1}`} 
                    className="news-image" 
                  />
                </div>
              ))}
              
              <button className="next-btn" onClick={nextSlide} aria-label="Next slide">›</button>
            </div>
            
            {/* Carousel Dots for Navigation */}
            <div className="carousel-dots">
              {images.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${index === currentIndex ? 'active' : ''}`} 
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                ></span>
              ))}
            </div>
          </>
        ) : (
          <div className="no-content-message">
            <p>No news items available at this time.</p>
            <button className="refresh-btn" onClick={fetchImages}>Refresh</button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Viewer;