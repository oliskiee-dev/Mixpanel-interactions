import { useState } from "react";
import "./Header.css"; // Import CSS

const Header = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <header className="header">
      {/* Top Section: Logo & Search Bar */}
      <div className="top-bar">
        <img src="/logo.png" alt="School Logo" className="logo" />
        <div className="search">
          <input type="text" placeholder="🔍" />
          <button className="clear-btn">✖</button>
        </div>
      </div>

      {/* Bottom Section: Navigation Bar */}
      <nav className="nav">
        <a href="home.html" className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>Home</a>
        <a href="announcements.html" className={activeTab === "announcements" ? "active" : ""} onClick={() => setActiveTab("announcements")}>Announcements</a>
        <a href="calendar.html" className={activeTab === "calendar" ? "active" : ""} onClick={() => setActiveTab("calendar")}>School Calendar</a>
        <a href="pre-registration.html" className={activeTab === "pre-registration" ? "active" : ""} onClick={() => setActiveTab("pre-registration")}>Pre-Registration</a>
        <a href="info.html" className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>School Information</a>
      </nav>
    </header>
  );
};

export default Header;
