import React, { useState } from "react";
import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import "./SchoolInfo.css";
import Pres from "../../assets/images/FacultyMembers/President.png";
import Vice from "../../assets/images/FacultyMembers/Vice.png";
import Bishop from "../../assets/images/FacultyMembers/TMPIboard1.png";
import Josephine from "../../assets/images/FacultyMembers/TMPIboard2.png";
import Principal from "../../assets/images/FacultyMembers/Principal.png";
import Dyna from "../../assets/images/FacultyMembers/Dyna.png";
import Claire from "../../assets/images/FacultyMembers/Claire.png";
import Shirley from "../../assets/images/FacultyMembers/Shirley.png";
import Maria from "../../assets/images/FacultyMembers/Maria.png";
import Hasel from "../../assets/images/FacultyMembers/Hasel.png";
import Marvelyn from "../../assets/images/FacultyMembers/Marvelyn.png";
import Katherine from "../../assets/images/FacultyMembers/Katherine.png";
import Monica from "../../assets/images/FacultyMembers/Monica.png";
import Louie from "../../assets/images/FacultyMembers/Louie.png";
import Nikka from "../../assets/images/FacultyMembers/Nikka.png";
import Alejandria from "../../assets/images/FacultyMembers/Alejandria.png";
import Jhanuarie from "../../assets/images/FacultyMembers/Jhanuarie.png";
import Charmaine from "../../assets/images/FacultyMembers/Charmaine.png";
import Teresita  from "../../assets/images/FacultyMembers/Teresita.png";
import Gertrudes from "../../assets/images/FacultyMembers/LiaisonOfficer.png";
import Flor from "../../assets/images/FacultyMembers/Flor.png";
import Raquela from "../../assets/images/FacultyMembers/Registrar.png";



// Data for subjects per grade
const subjectsData = {
    "KINDERGARTEN 1": ["Alphabet Recognition", "Basic Counting", "Arts & Crafts"],
    "KINDERGARTEN 2": ["Reading Readiness", "Numbers & Shapes", "Music & Movement"],
    "GRADE 1": ["Math", "English", "Science", "Filipino", "PE"],
    "GRADE 2": ["Math", "English", "Science", "Filipino", "Araling Panlipunan"],
    "GRADE 3": ["Math", "English", "Science", "Filipino", "Computer"],
    "GRADE 4": ["Math", "English", "Science", "Filipino", "HELE"],
    "GRADE 5": ["Math", "English", "Science", "Filipino", "Social Studies"],
    "GRADE 6": ["Math", "English", "Science", "Filipino", "ICT"],
    "GRADE 7": ["Math", "English", "Science", "History", "TLE"],
    "GRADE 8": ["Math", "English", "Science", "History", "TLE"],
    "GRADE 9": ["Math", "English", "Science", "History", "TLE"],
    "GRADE 10": ["Math", "English", "Science", "History", "TLE"],
};

// Senior High School Strands
const seniorHighStrands = [
    "Science, Technology, Engineering & Mathematics (STEM)",
    "Accountancy, Business, and Management (ABM)",
    "Humanities and Social Sciences (HUMSS)"
];

// Data for Facilities
const facilitiesData = {
    "Lab": "/path-to-lab-image.jpg",
    "Music Room": "/path-to-music-room-image.jpg",
    "Church": "/path-to-church-image.jpg",
    "Clinic": "/path-to-clinic-image.jpg",
    "Lounge": "/path-to-lounge-image.jpg",
    "Canteen": "/path-to-canteen-image.jpg",
    "Court": "/path-to-court-image.jpg",
};

function SchoolInfo() {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);

    // Function to open grade modal
    const openModal = (grade) => {
        setSelectedGrade(grade);
        setIsModalOpen(true);
    };

    // Function to close grade modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGrade(null);
    };

    // Function to open facility modal
    const openFacilityModal = (facility) => {
        setSelectedFacility(facility);
        setIsFacilityModalOpen(true);
    };

    // Function to close facility modal
    const closeFacilityModal = () => {
        setIsFacilityModalOpen(false);
        setSelectedFacility(null);
    };

    return (
        <>
            <Header />

            {/* About Us Section */}
            <section className="about-us">
                <div className="about-content">
                    <div className="about-text">
                        <h2 className="h2-title">ABOUT US</h2>
                        <p>
                            Team Mission Christian School was established with a vision to provide high-quality education rooted in Christian values.
                            Founded by a dedicated group of educators and faith-driven individuals, the school aimed to create a learning environment 
                            that nurtures both academic excellence and spiritual growth. 
                        </p>
                    </div>
                    <div className="about-image">
                        <img src="/path-to-blank-image.jpg" alt="Placeholder" />
                    </div>
                </div>
            </section>

            {/* Offered Courses Section */}
            <section className="section-border">
                <h2 className="h2-title">OFFERED COURSES</h2>

                <div className="courses-container">
                    <div className="course-list">
                        {Object.keys(subjectsData).map((grade) => (
                            <button key={grade} className="course-box" onClick={() => openModal(grade)}>
                                {grade}
                            </button>
                        ))}
                    </div>

                    <div className="senior-high">
                        <h3>SENIOR HIGH SCHOOL STRANDS</h3>
                        <ul>
                            {seniorHighStrands.map((strand, index) => (
                                <li key={index}>{strand}</li>
                            ))}
                        </ul>
                        <div className="esc-subsidy">With ESC Subsidy!</div>
                    </div>
                </div>
            </section>

            {/* School Facilities Section */}
            <section className="section-border">
                <h2 className="h2-title">SCHOOL AMENITIES</h2>
                <div className="facilities-container">
                    {Object.keys(facilitiesData).map((facility) => (
                        <button key={facility} className="facility-box" onClick={() => openFacilityModal(facility)}>
                            {facility}
                        </button>
                    ))}
                </div>
            </section>

            {/* Faculty and Staff Section */}
            <section className="section-border">
                <h2 className="h2-title">FACULTY AND STAFF</h2>
                <div className="faculty-grid">
                    {[
                        { name: "Engr. Romeo A.Corpuz, Jr.", role: "President", img: Pres },
                        { name: "Ptra. Lenora A. Corpuz", role: "Vice President", img: Vice },
                        { name: "Bishop Florante A. Rola", role: "TMPI Board", img: Bishop },
                        { name: "Ptra. Josephine D. Bermeo", role: "TMPI Board", img: Josephine },
                        { name: "Mrs. Erlinda C. Gonzales", role: "Principal", img: Principal },
                        { name: "Mrs. Dyna Lyn B. Tangalin", role: "Teacher", img: Dyna },
                        { name: "Mrs. Claire Bloom P. Faraon", role: "Teacher", img: Claire },
                        { name: "Mrs. Shirley V. Maximo", role: "Teacher", img: Shirley },
                        { name: "Mrs. Maria Cristina M.Guinto", role: "Teacher", img: Maria },
                        { name: "Ms. Hasel Marco", role: "Teacher", img: Hasel },
                        { name: "Ms. Marvelyn Joy Bumatay", role: "Teacher", img: Marvelyn },
                        { name: "Mrs. Kathrine Joy Prado", role: "Teacher", img: Katherine },
                        { name: "Ms. Monica Amascual", role: "Teacher", img: Monica },
                        { name: "Ms. Louie Anna Dianan", role: "Teacher", img: Louie },
                        { name: "Ms. Nikka Bless Hulguin", role: "Teacher", img: Nikka },
                        { name: "Mrs. Alejandria Jandoc", role: "Teacher", img: Alejandria },
                        { name: "Ms. Jhanuarie Mae Borja", role: "Teacher", img: Jhanuarie },
                        { name: "Ms. Charmaine Suarez", role: "Teacher", img: Charmaine },
                        { name: "Mrs. Maria Teresita L.", role: "Subject Teacher", img: Teresita },
                        { name: "Mrs. Gertrudes Corpuz", role: "Liaison Officer", img: Gertrudes },
                        { name: "Mrs. Flor Parungao", role: "Cashier", img: Flor },
                        { name: "Mrs. Raquela Pangyarihan", role: "Registrar", img: Raquela}
                        
                    ].map((faculty, index) => (
                        <div key={index} className="faculty-box">
                            <img src={faculty.img} alt={faculty.name} className="faculty-img" />
                            <h3>{faculty.name}</h3>
                            <p>{faculty.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Grade Modal Popup */}
            {isModalOpen && selectedGrade && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>×</button>
                        <h3>{selectedGrade} Subjects</h3>
                        <ul>
                            {subjectsData[selectedGrade].map((subject, index) => (
                                <li key={index}>{subject}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Facility Modal Popup */}
            {isFacilityModalOpen && selectedFacility && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeFacilityModal}>×</button>
                        <h3>{selectedFacility}</h3>
                        <img src={facilitiesData[selectedFacility]} alt={selectedFacility} className="facility-img" />
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default SchoolInfo;
