import React, { useState, useEffect } from "react";
import AdminHeader from '../Component/AdminHeader.jsx';
import './ManageAnnouncement.css';

function ManageAnnouncement() {
    const [announcements, setAnnouncements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [newAnnouncement, setNewAnnouncement] = useState({ text: '', image: null });
    const [editingId, setEditingId] = useState(null);
    const announcementsPerPage = 10;
    const initialDisplayCount = 5;

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch("http://localhost:5000/announcements");
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setNewAnnouncement(prev => ({ ...prev, image: data.filepath }));
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const handleCreateAnnouncement = async () => {
        try {
            const response = await fetch("http://localhost:5000/announcements", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAnnouncement),
            });
            if (response.ok) {
                setNewAnnouncement({ text: '', image: null });
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Error creating announcement:", error);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/announcements/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
        }
    };

    const handleUpdateAnnouncement = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/announcements/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAnnouncement),
            });
            if (response.ok) {
                setEditingId(null);
                setNewAnnouncement({ text: '', image: null });
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Error updating announcement:", error);
        }
    };

    // Pagination logic
    const indexOfLastAnnouncement = currentPage * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    
    const getCurrentPageAnnouncements = () => {
        return announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
    };

    const currentAnnouncements = getCurrentPageAnnouncements();
    const totalPages = Math.ceil(announcements.length / announcementsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <AdminHeader />
            <div className="announcement-main-container">
                <div className="announcement-header">
                    <h2 className="announcement-title">MANAGE ANNOUNCEMENTS</h2>
                </div>

                {/* Create/Edit Announcement Form */}
                <div className="announcement-form">
                    <h3 className="announcement-form-title">
                        {editingId ? "Edit Announcement" : "Create New Announcement"}
                    </h3>
                    
                    <div className="form-group">
                        <label>Announcement Text</label>
                        <input
                            type="text"
                            value={newAnnouncement.text}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, text: e.target.value }))}
                            placeholder="Enter announcement text"
                        />
                    </div>

                    <div className="form-group">
                        <label className="custom-file-upload">
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                            Choose Image
                        </label>
                        {newAnnouncement.image && (
                            <div className="preview-container">
                                <img
                                    src={`http://localhost:5000${newAnnouncement.image}`}
                                    alt="Preview"
                                    className="preview-image"
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-buttons">
                        {editingId ? (
                            <>
                                <button 
                                    className="submit-button" 
                                    onClick={() => handleUpdateAnnouncement(editingId)}
                                >
                                    Update Announcement
                                </button>
                                <button 
                                    className="cancel-button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setNewAnnouncement({ text: '', image: null });
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button 
                                className="submit-button" 
                                onClick={handleCreateAnnouncement}
                            >
                                Create Announcement
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="announcements-list">
                    {currentAnnouncements.map((announcement, index) => (
                        <div key={announcement._id} className="announcement-card">
                            <div className="announcement-image-container">
                                <img 
                                    src={`http://localhost:5000${announcement.image}`}
                                    alt={`Announcement ${indexOfFirstAnnouncement + index + 1}`} 
                                    className="announcement-image"
                                />
                            </div>
                            <div className="announcement-content">
                                <span className="announcement-number">
                                    ANNOUNCEMENT #{indexOfFirstAnnouncement + index + 1}
                                </span>
                                <p>{announcement.text}</p>
                                <div className="announcement-actions">
                                    <button onClick={() => {
                                        setEditingId(announcement._id);
                                        setNewAnnouncement({
                                            text: announcement.text,
                                            image: announcement.image
                                        });
                                    }}>Edit</button>
                                    <button onClick={() => handleDeleteAnnouncement(announcement._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
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
        </>
    );
}

export default ManageAnnouncement;