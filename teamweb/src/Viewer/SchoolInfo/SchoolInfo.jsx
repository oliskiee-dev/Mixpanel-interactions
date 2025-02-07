import React from "react";
import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import "./SchoolInfo.css";

function SchoolInfo() {
    return (
        <>
            <Header />
                {/* About Us Section */}
                <section className="about-us">
                    <div className="about-content">
                        <div className="about-text">
                            <h2 className="h2-title">ABOUT US</h2>
                            <p>
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
                            </p>
                        </div>
                        <div className="about-image">
                            <img src="/path-to-blank-image.jpg" alt="Placeholder" />
                        </div>
                    </div>
                </section>

                {/* Offered Courses Section */}
                <section className="offered-courses">
                    <h2 className="h2-title">OFFERED COURSES</h2>
                    <div className="courses-container">
                        <ul className="course-list">
                            <li>KINDERGARTEN 2</li>
                            <li>ELEMENTARY (gr 1-6)</li>
                            <li>JUNIOR HIGH SCHOOL (GR. 7-10)</li>
                        </ul>
                        <div className="senior-high">
                            <h3>SENIOR HIGH SCHOOL (GR. 11-12)</h3>
                            <ul>
                                <li>Science, Technology, Engineering & Mathematics</li>
                                <li>Accountancy, Business, and Management</li>
                                <li>Humanities and Social Sciences</li>
                            </ul>
                            <div className="esc-subsidy">With ESC Subsidy!</div>
                        </div>
                    </div>
                </section>

                {/* School Images Section */}
                <section className="school-images">
                    <img src="/path-to-image1.jpg" alt="School Image 1" />
                    <img src="/path-to-image2.jpg" alt="School Image 2" />
                </section>

                {/* Faculty and Staff Section */}
                <section className="faculty-staff">
                    <h2 className="h2-title">FACULTY AND STAFF</h2>
                    <div className="faculty-grid">
                        {['President', 'Faculty 1', 'Faculty 2', 'Faculty 3', 'Faculty 4', 'Faculty 5', 'Faculty 6', 'Faculty 7', 'Faculty 8'].map((name, index) => (
                            <div key={index} className="faculty-box">{name}</div>
                        ))}
                    </div>
                </section>
            <Footer />
        </>
    );
}

export default SchoolInfo;