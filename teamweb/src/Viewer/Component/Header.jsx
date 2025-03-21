import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import TeamLogo from '../../assets/images/TeamLogo.png';

const Header = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set active tab based on current URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/announcement") {
      setActiveTab("announcement");
    } else if (path === "/calendar") {
      setActiveTab("calendar");
    } else if (path === "/preregistration") {
      setActiveTab("preregistration");
    } else if (path === "/schoolinfo") {
      setActiveTab("schoolinfo");
    } else if (path === "/" || path === "") {
      setActiveTab("home");
    }
  }, [window.location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="main-header">
      {/* Top Section: Logo only */}
      <div className="main-top-bar">
        <div className="main-logo-container">
          <img src={TeamLogo} alt="School Logo" className="main-logo" />
          <h1 className="school-name">Team Mission School</h1>
        </div>
        
        <div className="header-controls">
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`main-nav ${menuOpen ? "show" : ""}`}>
        <div className="nav-container">
          <a
            href="/"
            className={activeTab === "home" ? "active" : ""}
            onClick={() => {
              setActiveTab("home");
              setMenuOpen(false);
            }}
          >
            Home
          </a>
          <a
            href="/announcement"
            className={activeTab === "announcement" ? "active" : ""}
            onClick={() => {
              setActiveTab("announcement");
              setMenuOpen(false);
            }}
          >
            Announcements
          </a>
          <a
            href="/calendar"
            className={activeTab === "calendar" ? "active" : ""}
            onClick={() => {
              setActiveTab("calendar");
              setMenuOpen(false);
            }}
          >
            School Calendar
          </a>
          <a
            href="/preregistration"
            className={activeTab === "preregistration" ? "active" : ""}
            onClick={() => {
              setActiveTab("preregistration");
              setMenuOpen(false);
            }}
          >
            Pre-Registration
          </a>
          <a
            href="/schoolinfo"
            className={activeTab === "schoolinfo" ? "active" : ""}
            onClick={() => {
              setActiveTab("schoolinfo");
              setMenuOpen(false);
            }}
          >
            School Information
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;