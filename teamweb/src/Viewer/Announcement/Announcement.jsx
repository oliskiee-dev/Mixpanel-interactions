import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import React, { useState, useEffect } from "react";
import "./Announcement.css";

function Announcement() {
    const [announcements, setAnnouncements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAll, setShowAll] = useState(false);
    const announcementsPerPage = 10;
    const initialDisplayCount = 5; // Number of announcements to show initially

    useEffect(() => {
        // Generate 30 announcements with mock data
        const mockAnnouncements = Array.from({ length: 30 }, (_, index) => ({
            text: `Announcement ${index + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
            image: `https://picsum.photos/800/400?random=${index + 1}`
        }));
        setAnnouncements(mockAnnouncements);
    }, []);

    // Calculate pagination and display logic
    const indexOfLastAnnouncement = currentPage * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    
    // Get current page's announcements
    const getCurrentPageAnnouncements = () => {
        const pageAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
        return showAll ? pageAnnouncements : pageAnnouncements.slice(0, initialDisplayCount);
    };

    const currentAnnouncements = getCurrentPageAnnouncements();
    const totalPages = Math.ceil(announcements.length / announcementsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setShowAll(false); // Reset show all when changing pages
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <>
            <Header />
            <div className="announcement-main-container">
                <div className="announcement-header">
                    <h2 className="announcement-title">ANNOUNCEMENTS</h2>
                </div>
                
                <div className="announcements-list">
                    {currentAnnouncements.map((announcement, index) => (
                        <div key={indexOfFirstAnnouncement + index} className="announcement-card">
                            <div className="announcement-image-container">
                                <img 
                                    src={announcement.image} 
                                    alt={`Announcement ${indexOfFirstAnnouncement + index + 1}`} 
                                    className="announcement-image"
                                />
                            </div>
                            <div className="announcement-content">
                                <span className="announcement-number">
                                    ANNOUNCEMENT #{indexOfFirstAnnouncement + index + 1}
                                </span>
                                <p>{announcement.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="button-container">
                    <button className="view-all-button" onClick={toggleShowAll}>
                        {showAll ? "Show Less" : `Show All Announcements (${announcementsPerPage - initialDisplayCount} more)`}
                    </button>
                </div>

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
            <Footer className="announcement-footer" />
        </>
    );
}

export default Announcement;