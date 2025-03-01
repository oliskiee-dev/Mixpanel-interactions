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
            console.log("Fetched announcements:", data);

            if (data.announcement && Array.isArray(data.announcement)) {
                setAnnouncements(data.announcement);
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
                    {currentAnnouncements.map((announcement, index) => {
                        const imagePath = `http://localhost:3000/announcement/${announcement.image_url}`;
                        console.log("Rendering image from:", imagePath);

                        return (
                            <div key={indexOfFirstAnnouncement + index} className="announcement-card">
                                {announcement.image_url && (
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
                    })}
                </div>

                {/* Pagination */}
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
