import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import "./AdminHeader.css"; // Import CSS
import TeamLogo from '../../assets/images/TeamLogo.jpg'

const AdminHeader = () => {
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

  // Set the active tab based on the current URL path
  useEffect(() => {
    const path = window.location.pathname; // Get the current pathname
    if (path === "/manage-announcement") {
      setActiveTab("manageannouncement");
    } else if (path === "/manage-calendar") {
      setActiveTab("managecalendar");
    } else if (path === "/manage-preregistration") {
      setActiveTab("managepreregistration");
    } else if (path === "/manage-schoolinfo") {
      setActiveTab("manageschoolinfo");
    } else {
      setActiveTab("home"); // Default to home if no match
    }
  }, []); // This runs once on mount

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
        {/* <div className="search">
          <input
            type="text"
            placeholder="🔍"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)} // Handle search input
          />
          <button className="clear-btn" onClick={handleClear}>
            ✖
          </button>
        </div> */}
        <div className="current-admin-user">
          <span>Hi, Zandro</span>
          <FaUser className="user-icon" />
        </div>



        {/* Hamburger icon next to search */}
        <button className="nav-toggle-btn" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Top Navigation (Visible on Desktop) */}
      <nav className={`nav ${menuOpen ? "show" : ""}`}>
        <a
          href="/admin-homepage"
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("admin-homepage")}
        >
          Manage Home
        </a>
        <a
          href="/manage-announcement"
          className={activeTab === "manageannouncement" ? "active" : ""}
          onClick={() => setActiveTab("manageannouncement")}
        >
          Manage Announcements
        </a>
        <a
          href="/manage-calendar"
          className={activeTab === "managecalendar" ? "active" : ""}
          onClick={() => setActiveTab("managecalendar")}
        >
          Manage School Calendar
        </a>
        <a
          href="/manage-preregistration"
          className={activeTab === "managepreregistration" ? "active" : ""}
          onClick={() => setActiveTab("managepreregistration")}
        >
          Manage Pre-Registration
        </a>
        <a
          href="/manage-schoolinfo"
          className={activeTab === "manageschoolinfo" ? "active" : ""}
          onClick={() => setActiveTab("manageschoolinfo")}
        >
          Manage School Information
        </a>
      </nav>
    </header>
  );
};

export default AdminHeader;
