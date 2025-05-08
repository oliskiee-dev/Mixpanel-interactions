import { useState, useEffect } from "react";
import { FaUser, FaSignOutAlt, FaTimes, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router";
import "./AdminHeader.css";
import TeamLogo from '../../assets/images/TeamLogo.png';
import Analytics from "../../utils/analytics";


const AdminHeader = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

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
    if (path === "/manage-announcement") {
      setActiveTab("manageannouncement");
    } else if (path === "/manage-calendar") {
      setActiveTab("managecalendar");
    } else if (path === "/manage-preregistration") {
      setActiveTab("managepreregistration");
    } else if (path === "/manage-schoolinfo") {
      setActiveTab("manageschoolinfo");
    } else if (path === "/manage-account"){
      setActiveTab("manageaccount");
    } else if (path === "/view-report"){
      setActiveTab("viewreport");
    } else if (path === "/admin-homepage") {
      setActiveTab("home");
    } else {
      setActiveTab("home");
    }
  }, [window.location.pathname]);

  // Fetch username from localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUsername(loggedInUser);
    } else {
      setUsername("Admin");
    }
  }, []);



  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleUserClick = (menuItem) => {
    Analytics.track('Navigation Click', {
      menu_item: menuItem
    });
    setShowLogout(!showLogout);
  };

// Inside the handleLogout function
const handleLogout = () => {
    // Track logout event
    Analytics.track('Logout');
    
    // Reset Mixpanel user identification
    Analytics.reset();
    
    // Existing logout code
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    navigate("/login");
};

  // Close logout dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLogout && !event.target.closest('.user-profile-container')) {
        setShowLogout(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogout]);

  return (
    <header className="admin-header">
      {/* Top Section: Logo & User Profile */}
      <div className="admin-top-bar">
        <div className="admin-logo-container">
          <img src={TeamLogo} alt="School Logo" className="admin-logo" />
          <h1 className="admin-title">Admin Dashboard</h1>
        </div>
        
        <div className="admin-controls">
          <div className="user-profile-container" onClick={handleUserClick}>
            <div className="user-profile">
              <div className="user-avatar">
                <FaUser />
              </div>
              <span className="username">{username}</span>
            </div>
            
            {showLogout && (
              <div className="logout-dropdown">
                <button className="logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
          
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`admin-nav ${menuOpen ? "show" : ""}`}>
        <div className="admin-nav-container">
          <a
            href="/admin-homepage"
            className={activeTab === "home" ? "active" : ""}
            onClick={() => {
              setActiveTab("home");
              setMenuOpen(false);
            }}
          >
            Manage Home
          </a>
          <a
            href="/manage-announcement"
            className={activeTab === "manageannouncement" ? "active" : ""}
            onClick={() => {
              setActiveTab("manageannouncement");
              setMenuOpen(false);
            }}
          >
            Manage Announcements
          </a>
          <a
            href="/manage-calendar"
            className={activeTab === "managecalendar" ? "active" : ""}
            onClick={() => {
              setActiveTab("managecalendar");
              setMenuOpen(false);
            }}
          >
            Manage School Calendar
          </a>
          <a
            href="/manage-preregistration"
            className={activeTab === "managepreregistration" ? "active" : ""}
            onClick={() => {
              setActiveTab("managepreregistration");
              setMenuOpen(false);
            }}
          >
            Manage Pre-Registration
          </a>
          <a
            href="/manage-account"
            className={activeTab === "manageaccount" ? "active" : ""}
            onClick={() => {
              setActiveTab("manageaccount");
              setMenuOpen(false);
            }}
          >
            Manage Accounts
          </a>
          <a
            href="/view-report"
            className={activeTab === "viewreport" ? "active" : ""}
            onClick={() => {
              setActiveTab("viewreport");
              setMenuOpen(false);
            }}
          >
            Admin Logs
          </a>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;