import React, { useState, useEffect } from "react";
import AdminHeader from "../Component/AdminHeader.jsx";
import "./ManageAnnouncement.css";

function ManageAnnouncement() {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ 
        title: "", 
        description: "", 
        image: null, 
        preview: null 
    });
    const [editingId, setEditingId] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const announcementsPerPage = 6;

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch("http://localhost:3000/announcements");
            if (!response.ok) throw new Error("Failed to fetch announcements");
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setNewAnnouncement(prev => ({ ...prev, preview: previewURL, image: file }));
        }
    };

    const handleCreateAnnouncement = async () => {
        if (!newAnnouncement.title || !newAnnouncement.description) {
            alert("Please fill in both title and description fields");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", newAnnouncement.title);
            formData.append("description", newAnnouncement.description);
            if (newAnnouncement.image) {
                formData.append("image", newAnnouncement.image);
            }

            const response = await fetch("http://localhost:3000/addAnnouncement", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setNewAnnouncement({ title: "", description: "", image: null, preview: null });
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Error creating announcement:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            try {
                const response = await fetch(`http://localhost:3000/delete-announcement/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    fetchAnnouncements();
                }
            } catch (error) {
                console.error("Error deleting announcement:", error);
            }
        }
    };

    // Calculate pagination
    const indexOfLastAnnouncement = pageNumber * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
    const totalPages = Math.ceil(announcements.length / announcementsPerPage);

    const paginate = (pageNum) => setPageNumber(pageNum);

    return (
        <>
            <AdminHeader />
            <div className="admin-container">
                <div className="announcement-header">
                    <h2 className="announcement-title">MANAGE ANNOUNCEMENTS</h2>
                    <p className="announcement-subtitle">Create, view and manage all school announcements</p>
                </div>

                {/* Create/Edit Announcement Form */}
                <div className="announcement-form">
                    <h3 className="form-section-title">{editingId ? "Edit Announcement" : "Create New Announcement"}</h3>
                    
                    <div className="form-group">
                        <label htmlFor="announcement-title">Title</label>
                        <input
                            id="announcement-title"
                            type="text"
                            placeholder="Enter announcement title"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                            maxLength={100}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="announcement-description">Description</label>
                        <textarea
                            id="announcement-description"
                            placeholder="Enter announcement details"
                            value={newAnnouncement.description}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, description: e.target.value }))}
                            className="description-textarea"
                            maxLength={500}
                        />
                        <small className="char-count">{newAnnouncement.description.length}/500 characters</small>
                    </div>
                    
                    <div className="form-group">
                        <label className="custom-file-upload">
                            <input type="file" onChange={handleFileChange} accept="image/*" />
                            <i className="fa fa-cloud-upload"></i> Upload Image
                        </label>
                        {newAnnouncement.preview && (
                            <div className="preview-container">
                                <img src={newAnnouncement.preview} alt="Preview" className="preview-image" />
                                <button 
                                    className="remove-image-btn"
                                    onClick={() => setNewAnnouncement(prev => ({ ...prev, image: null, preview: null }))}
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            onClick={handleCreateAnnouncement}
                            className="submit-button"
                        >
                            {editingId ? "Update Announcement" : "Post Announcement"}
                        </button>
                        {editingId && (
                            <button 
                                onClick={() => {
                                    setEditingId(null);
                                    setNewAnnouncement({ title: "", description: "", image: null, preview: null });
                                }}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <h3 className="section-title">Current Announcements</h3>

                {/* Announcement List Grid */}
                <div className="announcements-grid">
                    {currentAnnouncements.length > 0 ? (
                        currentAnnouncements.map((announcement) => {
                            const imagePath = `http://localhost:3000/announcement/${announcement.image}`;
                            return (
                                <div key={announcement._id} className="announcement-card">
                                    {announcement.image && (
                                        <div className="card-image-container">
                                            <img src={imagePath} alt={announcement.title} className="card-image" />
                                        </div>
                                    )}
                                    <div className="card-content">
                                        <h4 className="card-title">{announcement.title}</h4>
                                        <div className="card-description-container">
                                            <p className="card-description">{announcement.description}</p>
                                        </div>
                                        <div className="card-actions">
                                            <button 
                                                onClick={() => {
                                                    setEditingId(announcement._id);
                                                    setNewAnnouncement({
                                                        title: announcement.title,
                                                        description: announcement.description,
                                                        image: null,
                                                        preview: announcement.image ? imagePath : null
                                                    });
                                                }} 
                                                className="edit-btn"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(announcement._id)} 
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-announcements">
                            <p>No announcements available. Create your first announcement above.</p>
                        </div>
                    )}
                </div>
                
                {/* Pagination */}
                {announcements.length > announcementsPerPage && (
                    <div className="pagination">
                        <button 
                            onClick={() => paginate(pageNumber > 1 ? pageNumber - 1 : 1)}
                            disabled={pageNumber === 1}
                            className="page-button"
                        >
                            Previous
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={`page-button ${pageNumber === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => paginate(pageNumber < totalPages ? pageNumber + 1 : totalPages)}
                            disabled={pageNumber === totalPages}
                            className="page-button"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default ManageAnnouncement;