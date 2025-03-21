import React, { useState, useEffect } from "react";
import AdminHeader from '../Component/AdminHeader.jsx';
import UpdateAppointment from './UpdateAppointment';
import { Search, Filter, User, Calendar, Phone, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import './ManagePreRegistration.css';

function ManagePreRegistration() {
    // State management
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit, setLimit] = useState(10);

    // Filter and search states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedStrand, setSelectedStrand] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [expandedRow, setExpandedRow] = useState(null);
    
    // UI state
    const [activeTab, setActiveTab] = useState('table');

    // Fetch data on component mount or when pagination/filters change
    useEffect(() => {
        fetchStudentData();
    }, [currentPage, limit]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/preregistration?page=${currentPage}&limit=${limit}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setStudents(data.preregistration);
            setTotalPages(data.totalPages);
            setTotalRecords(data.totalRecords);
        } catch (err) {
            setError('Failed to fetch student data: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Event handlers
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleGradeChange = (e) => {
        setSelectedGrade(e.target.value);
    };

    const handleStrandChange = (e) => {
        setSelectedStrand(e.target.value);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const handleStatusChange = async (studentId, currentStatus) => {
        try {
            const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";
            
            const response = await fetch(`/preregistration/${studentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            if (newStatus === "Approved") {
                const student = students.find(s => s._id === studentId);
                if (student) {
                    sendEmail(student.email, student.name);
                }
            }
            
            fetchStudentData();
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update status. Please try again.');
        }
    };

    const sendEmail = (email, name) => {
        console.log(`Sending email to ${email} for ${name}...`);
        alert(`Approval email sent to ${email}`);
    };

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    // Filter students based on search and filter criteria
    const filteredStudents = students.filter((student) => {
        const matchesName = student.name?.toLowerCase().includes(searchTerm) || false;
        const matchesGrade =
            selectedGrade === "" || student.grade_level?.toLowerCase() === `grade ${selectedGrade.toLowerCase()}` || false;
        const matchesStrand =
            selectedStrand === "" || student.strand?.toLowerCase() === selectedStrand.toLowerCase() || false;
        const matchesType =
            selectedType === "" || student.isNewStudent?.toLowerCase() === selectedType.toLowerCase() || false;

        return matchesName && matchesGrade && matchesStrand && matchesType;
    });

    // Table renderer
    const renderTable = () => {
        if (loading) return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading student data...</p>
            </div>
        );
        
        if (error) return (
            <div className="error-state">
                <AlertCircle size={24} />
                <p>{error}</p>
            </div>
        );
        
        if (students.length === 0) return (
            <div className="empty-state">
                <User size={48} />
                <h3>No Records Found</h3>
                <p>No student registration records are available.</p>
            </div>
        );

        return (
            <div className="data-table-container">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Gender</th>
                                <th>Type</th>
                                <th>Date of Birth</th>
                                <th>Grade Level</th>
                                <th>Strand</th>
                                <th>Email Address</th>
                                <th>Phone Number</th>
                                <th>Details</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <React.Fragment key={student._id || index}>
                                    <tr className={expandedRow === index ? 'row-expanded' : ''}>
                                        <td className="cell-name">{student.name}</td>
                                        <td className="cell-center">{student.gender}</td>
                                        <td className="cell-center">{student.isNewStudent}</td>
                                        <td className="cell-center">{student.date_of_birth}</td>
                                        <td className="cell-center">{student.grade_level}</td>
                                        <td className="cell-center">{student.strand}</td>
                                        <td className="cell-email">
                                            <div className="email-container">
                                                <Mail size={14} />
                                                <span>{student.email}</span>
                                            </div>
                                        </td>
                                        <td className="cell-phone">
                                            <div className="phone-container">
                                                <Phone size={14} />
                                                <span>{student.phone_number}</span>
                                            </div>
                                        </td>
                                        <td className="cell-action">
                                            <button
                                                className="btn-details"
                                                onClick={() => toggleRow(index)}
                                            >
                                                <Clock size={14} />
                                                {expandedRow === index ? 'Hide' : 'View'}
                                            </button>
                                        </td>
                                        <td className="cell-status">
                                            <button
                                                className={`btn-status ${student.status?.toLowerCase() || 'pending'}`}
                                                onClick={() => handleStatusChange(student._id, student.status)}
                                            >
                                                {student.status === "Approved" ? 
                                                    <><CheckCircle size={14} /> Approved</> : 
                                                    <><AlertCircle size={14} /> Pending</>
                                                }
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRow === index && (
                                        <tr className="details-row">
                                            <td colSpan="10">
                                                <div className="details-content">
                                                    <div className="details-section">
                                                        <h4>Appointment Information</h4>
                                                        <div className="details-grid">
                                                            <div className="details-item">
                                                                <span className="details-label">Date:</span>
                                                                <span className="details-value">{student.appointment_date || "Not scheduled"}</span>
                                                            </div>
                                                            <div className="details-item">
                                                                <span className="details-label">Time:</span>
                                                                <span className="details-value">{student.preferred_time || "Not specified"}</span>
                                                            </div>
                                                            <div className="details-item">
                                                                <span className="details-label">Purpose:</span>
                                                                <span className="details-value">{student.purpose_of_visit || "General inquiry"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="pagination">
                    <button 
                        className="btn-page"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages} ({totalRecords} total)
                    </span>
                    <button 
                        className="btn-page"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="manage-preregistration">
            <AdminHeader />
            
            <div className="content-container">
                <div className="page-header">
                    <h1>Student Pre-Registration Management</h1>
                    <p>View and manage student pre-registration records</p>
                </div>
                
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === "table" ? "active" : ""}`}
                        onClick={() => setActiveTab("table")}
                    >
                        <User size={16} />
                        Student Records
                    </button>
                    <button 
                        className={`tab ${activeTab === "appointment" ? "active" : ""}`}
                        onClick={() => setActiveTab("appointment")}
                    >
                        <Calendar size={16} />
                        Appointment Availability
                    </button>
                </div>
                
                {activeTab === "table" && (
                    <>
                        <div className="filters-container">
                            <div className="search-container">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by student name..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="search-input"
                                />
                            </div>
                            <div className="filter-group">
                                <Filter size={16} />
                                <select value={selectedGrade} onChange={handleGradeChange} className="filter-select">
                                    <option value="">All Grades</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i} value={(i + 1).toString()}>
                                            Grade {i + 1}
                                        </option>
                                    ))}
                                </select>
                                <select value={selectedStrand} onChange={handleStrandChange} className="filter-select">
                                    <option value="">All Strands</option>
                                    <option value="ABM">ABM</option>
                                    <option value="STEM">STEM</option>
                                    <option value="HUMSS">HUMSS</option>
                                </select>
                                <select value={selectedType} onChange={handleTypeChange} className="filter-select">
                                    <option value="">All Types</option>
                                    <option value="NEW">New</option>
                                    <option value="OLD">Old</option>
                                </select>
                            </div>
                        </div>
                        
                        {renderTable()}
                    </>
                )}
                
                {activeTab === "appointment" && <UpdateAppointment />}
            </div>
        </div>
    );
}

export default ManagePreRegistration;