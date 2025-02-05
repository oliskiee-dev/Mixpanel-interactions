import { useState, useEffect } from "react";
import "./Header.css"; // Import CSS
import TeamLogo from '../../assets/images/TeamLogo.jpg'

const Header = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [searchText, setSearchText] = useState(""); // State to manage search text
  const [menuOpen, setMenuOpen] = useState(false); // State to handle menu toggle

  // Close the menu by default on small screens when component mounts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false); // Close the menu if the screen is larger than 768px
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on mount if screen size is larger than 768px

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClear = () => {
    setSearchText(""); // Clear the search input
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu open/close
  };

  return (
    <header className="header">
      {/* Top Section: Logo & Search Bar */}
      <div className="top-bar">
        <img src={TeamLogo} alt="School Logo" className="logo" />
        <div className="search">
          <input
            type="text"
            placeholder="🔍"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)} // Handle search input
          />
          <button className="clear-btn" onClick={handleClear}>
            ✖
          </button>
        </div>
        {/* Hamburger icon next to search */}
        <button className="nav-toggle-btn" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Top Navigation (Visible on Desktop) */}
      <nav className={`nav ${menuOpen ? "show" : ""}`}>
        <a
          href="/"
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("home")}
        >
          Home
        </a>
        <a
          href="announcement"
          className={activeTab === "announcement" ? "active" : ""}
          onClick={() => setActiveTab("announcement")}
        >
          Announcements
        </a>
        <a
          href="calendar"
          className={activeTab === "calendar" ? "active" : ""}
          onClick={() => setActiveTab("calendar")}
        >
          School Calendar
        </a>
        <a
          href="preregistration"
          className={activeTab === "preregistration" ? "active" : ""}
          onClick={() => setActiveTab("preregistration")}
        >
          Pre-Registration
        </a>
        <a
          href="info"
          className={activeTab === "info" ? "active" : ""}
          onClick={() => setActiveTab("info")}
        >
          School Information
        </a>
      </nav>
    </header>
  );
};

export default Header;
