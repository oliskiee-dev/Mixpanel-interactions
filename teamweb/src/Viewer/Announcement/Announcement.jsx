import Header from "../Component/Header.jsx";
import Footer from "../Component/Footer.jsx";
import React, { useState, useEffect } from "react";
import "./Announcement.css";

function Announcement() {
    const [announcements, setAnnouncements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const announcementsPerPage = 5; // Show 5 announcements per page

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch("http://localhost:3000/announcement");
            if (!response.ok) throw new Error("Failed to fetch announcements");
    
            const data = await response.json();
            console.log("Fetched announcements:", data); // Check API response
    
            if (data.announcements && Array.isArray(data.announcements)) {
                setAnnouncements(data.announcements); // ✅ Correct key
                console.log("State updated with:", data.announcements); // Check if state updates
            } else {
                console.error("Invalid data format:", data);
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    // Calculate pagination
    const indexOfLastAnnouncement = currentPage * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    
    // Get current page's announcements
    const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
    const totalPages = Math.ceil(announcements.length / announcementsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Header />
            <div className="announcement-main-container">
                <div className="announcement-header">
                    <h2 className="announcement-title">ANNOUNCEMENTS</h2>
                </div>
                
                <div className="announcements-list">
                    {currentAnnouncements.length > 0 ? (
                        currentAnnouncements.map((announcement, index) => {
                            const imagePath = announcement.image_url 
                                ? `http://localhost:3000/announcement/${announcement.image_url}` 
                                : null;
                            console.log("Rendering image from:", imagePath);

                            return (
                                <div key={announcement._id} className="announcement-card">
                                    {imagePath && (
                                        <div className="announcement-image-container">
                                            <img 
                                                src={imagePath} 
                                                alt={announcement.title} 
                                                className="announcement-image"
                                            />
                                        </div>
                                    )}
                                    <div className="announcement-content">
                                        <span className="announcement-number">
                                            ANNOUNCEMENT #{indexOfFirstAnnouncement + index + 1}
                                        </span>
                                        <h3>{announcement.title}</h3>
                                        <p>{announcement.description}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-announcements">No announcements available.</p>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
                )}
            </div>
            <Footer className="announcement-footer" />
        </>
    );
}

export default Announcement;
