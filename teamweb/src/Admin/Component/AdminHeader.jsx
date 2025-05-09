// src/Admin/Component/AdminHeader.jsx
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

  // Set active tab based on URL
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
    Analytics.track('Menu Toggle', {
      state: menuOpen ? 'closed' : 'opened'
    });
    setMenuOpen(!menuOpen);
  };

  const handleUserClick = () => {
    Analytics.track('User Profile Click');
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    // Track logout
    Analytics.track('Logout');
    Analytics.reset();
    
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    navigate("/login");
  };

  // Helper for nav attributes
  const getNavAttributes = (menuItem) => {
    return {
      'data-mp-event': "Navigation Click",
      'data-mp-menu-item': menuItem,
      'data-mp-category': "navigation"
    };
  };

  // Handle menu item click
  const handleMenuClick = (tab) => {
    Analytics.track('Navigation Click', {
      menu_item: tab,
      previous_page: activeTab
    });
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <header className="admin-header">
      {/* Top Section: Logo & User Profile */}
      <div className="admin-top-bar">
        <div className="admin-logo-container">
          <img src={TeamLogo} alt="School Logo" className="admin-logo" />
          <h1 className="admin-title">Admin Dashboard</h1>
        </div>
        
        <div className="admin-controls">
          <div 
            className="user-profile-container" 
            onClick={handleUserClick}
            data-mp-event="User Profile Click"
          >
            <div className="user-profile">
              <div className="user-avatar">
                <FaUser />
              </div>
              <span className="username">{username}</span>
            </div>
            
            {showLogout && (
              <div className="logout-dropdown">
                <button 
                  className="logout-btn" 
                  onClick={handleLogout}
                  data-mp-event="Logout Click"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
          
          <button 
            className="menu-toggle" 
            onClick={toggleMenu} 
            aria-label="Toggle navigation menu"
            data-mp-event="Menu Toggle"
            data-mp-state={menuOpen ? "open" : "closed"}
          >
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
            onClick={() => handleMenuClick("home")}
            {...getNavAttributes("home")}
          >
            Manage Home
          </a>
          <a
            href="/manage-announcement"
            className={activeTab === "manageannouncement" ? "active" : ""}
            onClick={() => handleMenuClick("manageannouncement")}
            {...getNavAttributes("manageannouncement")}
          >
            Manage Announcements
          </a>
          <a
            href="/manage-calendar"
            className={activeTab === "managecalendar" ? "active" : ""}
            onClick={() => handleMenuClick("managecalendar")}
            {...getNavAttributes("managecalendar")}
          >
            Manage School Calendar
          </a>
          <a
            href="/manage-preregistration"
            className={activeTab === "managepreregistration" ? "active" : ""}
            onClick={() => handleMenuClick("managepreregistration")}
            {...getNavAttributes("managepreregistration")}
          >
            Manage Pre-Registration
          </a>
          <a
            href="/manage-account"
            className={activeTab === "manageaccount" ? "active" : ""}
            onClick={() => handleMenuClick("manageaccount")}
            {...getNavAttributes("manageaccount")}
          >
            Manage Accounts
          </a>
          <a
            href="/view-report"
            className={activeTab === "viewreport" ? "active" : ""}
            onClick={() => handleMenuClick("viewreport")}
            {...getNavAttributes("viewreport")}
          >
            Admin Logs
          </a>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;