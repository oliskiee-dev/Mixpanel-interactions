import React, { useState, useEffect } from "react";
import Header from "./Viewer/Component/Header.jsx";
import Footer from "./Viewer/Component/Footer.jsx";
import "./Viewer.css"; 

// Sample images for the slideshow (to be replaced with dynamic uploads later)
const newsImages = [
  "/assets/images/class.png",
  "/assets/images/sample.png",
  "/assets/images/class.png",
];

function Viewer() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + newsImages.length) % newsImages.length);
  };

  return (
    <>
      <Header />

      {/* Main Section */}
      <div className="main-container">
        {/* School Image */}
        <div className="school-image-container">
          <img src="/assets/images/school.jpg" alt="School" className="school-image" />
        </div>

        {/* Welcome Text and Explore Button */}
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
          <button className="prev-btn" onClick={prevSlide}>‹</button>
          <div className="news-item">
            <img src={newsImages[currentIndex]} alt="News" className="news-image" />
            <div className="news-content">
              <h3>Teamian News</h3>
              
            </div>
          </div>
          <button className="next-btn" onClick={nextSlide}>›</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Viewer;
