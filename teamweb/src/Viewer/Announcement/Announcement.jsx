import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import React, { useState, useEffect } from "react";
import "./Announcement.css";

function Announcement() {
    const [announcements, setAnnouncements] = useState([]);
    const [showAll, setShowAll] = useState(false); // Set false for three announcements

    useEffect(() => {
        // Fetch announcements from API or database (mock data for now)
        setAnnouncements([
            "School event on February 15th - Join us!",
            "New guidelines for the upcoming semester released.",
            "Important notice about upcoming exams.",
            "Library hours extended for finals week.",
            "Sports fest registration now open!",
            "New courses available for next semester.",
        ]);
    }, []);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const displayedAnnouncements = showAll 
        ? announcements 
        : announcements.slice(0, 5);

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
                            <div className="announcement-content">
                                <span className="announcement-number">ANNOUNCEMENT #{index + 1}</span>
                                <p>{announcement}</p>
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