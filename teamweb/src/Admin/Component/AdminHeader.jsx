import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router"; // Import useNavigate for navigation
import "./AdminHeader.css"; // Import CSS
import TeamLogo from '../../assets/images/TeamLogo.jpg';

const AdminHeader = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [searchText, setSearchText] = useState(""); // State to manage search text
  const [menuOpen, setMenuOpen] = useState(false); // State to handle menu toggle
  const [username, setUsername] = useState(""); // State to store the logged-in username
  const [showLogout, setShowLogout] = useState(false); // State to toggle logout button
  const navigate = useNavigate(); // Hook for navigation

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

  // Fetch the username from localStorage or set it to a default value
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUsername(loggedInUser); // Set the username from localStorage
    } else {
      setUsername("User"); // Default if username not found
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu open/close
  };

  const handleUserClick = () => {
    setShowLogout(!showLogout); // Toggle the visibility of the logout button
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    localStorage.removeItem("username"); // Clear username from localStorage
    setUsername(""); // Reset username state
    navigate("/login"); // Navigate to login page
  };

  return (
    <header className="header">
      {/* Top Section: Logo & Search Bar */}
      <div className="top-bar">
        <img src={TeamLogo} alt="School Logo" className="logo" />
        <div className="current-admin-user" onClick={handleUserClick}>
          <span>Hi, {username}</span>
          <FaUser className="user-icon" />
        </div>

        {/* Floating logout button */}
        {showLogout && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}

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
