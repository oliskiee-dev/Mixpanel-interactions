import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import React, { useState, useEffect } from "react";
import "./Announcement.css";

function Announcement() {
    const [announcements, setAnnouncements] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        // Mock data with placeholder images
        setAnnouncements([
            {
                text: "School event on February 15th - Join us!",
                image: "https://picsum.photos/800/400?random=1"
            },
            {
                text: "New guidelines for the upcoming semester released.",
                image: "https://picsum.photos/800/400?random=2"
            },
            {
                text: "Important notice about upcoming exams.",
                image: "https://picsum.photos/800/400?random=3"
            },
            {
                text: "Library hours extended for finals week.",
                image: "https://picsum.photos/800/400?random=4"
            },
            {
                text: "Sports fest registration now open!",
                image: "https://picsum.photos/800/400?random=5"
            }
        ]);
    }, []);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const displayedAnnouncements = showAll 
        ? announcements 
        : announcements.slice(0, 3);

    return (
        <>
            <Header />
            <div className="announcement-main-container">
                <div className="announcement-header">
                    <h2 className="announcement-title">ANNOUNCEMENTS</h2>
                </div>
                
                <div className="announcements-list">
                    {displayedAnnouncements.map((announcement, index) => (
                        <div key={index} className="announcement-card">
                            <div className="announcement-image-container">
                                <img 
                                    src={announcement.image} 
                                    alt={`Announcement ${index + 1}`} 
                                    className="announcement-image"
                                />
                            </div>
                            <div className="announcement-content">
                                <span className="announcement-number">ANNOUNCEMENT #{index + 1}</span>
                                <p>{announcement.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="button-container">
                    <button className="view-all-button" onClick={toggleShowAll}>
                        {showAll ? "Show Less" : "View All Announcements"}
                    </button>
                </div>
            </div>
            <Footer className="announcement-footer" />
        </>
    );
}

export default Announcement;