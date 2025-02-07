import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import React, { useState, useEffect } from "react";
import "./Announcement.css"; // Ensure you have a CSS file for styling

function Announcement() {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        // Fetch announcements from API or database (mock data for now)
        setAnnouncements([
            "School event on February 15th - Join us!",
            "New guidelines for the upcoming semester released.",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",
            "Lorem Ipsum et dolor sit amet, consectetur adipiscing elit",

        ]);
    }, []);

    return (
        <>
            <Header />
            <div className="announcement-container">
                <h2 className="announcement-title">Announcements</h2>
                {announcements.map((announcement, index) => (
                    <div key={index} className="announcement-card">
                        {announcement}
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
}

export default Announcement;
