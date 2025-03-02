import React, { useState, useEffect } from "react";
import AdminHeader from "../Component/AdminHeader.jsx";
import "./ManageAnnouncement.css";

function ManageAnnouncement() {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ 
        title: "", 
        description: "", 
        image_url: null, 
        preview: null 
    });
    const [editingId, setEditingId] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const announcementsPerPage = 6;

    useEffect(() => {
        fetchAnnouncements();
    }, []);
    
    const fetchAnnouncements = async () => {
        try {
            const response = await fetch("http://localhost:3000/announcement");
            if (!response.ok) throw new Error("Failed to fetch announcements");
            const data = await response.json();
            setAnnouncements(Array.isArray(data.announcements) ? data.announcements : []);
        } catch (error) {
            console.error("Error fetching announcements:", error);
            setAnnouncements([]);
        }
    };
    
    const handleCreateOrUpdateAnnouncement = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append("title", newAnnouncement.title);
        formData.append("description", newAnnouncement.description);
        if (newAnnouncement.image_url) {
            formData.append("image", newAnnouncement.image_url);
        }
    
        try {
            const url = editingId
                ? `http://localhost:3000/announcement/edit/${editingId}`
                : "http://localhost:3000/announcement/add";
            const method = editingId ? "PUT" : "POST";
    
            const response = await fetch(url, {
                method,
                body: formData,
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
            }
    
            if (response.ok) {
                resetForm();
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Error submitting announcement:", error);
        }
    };
    
    const resetForm = () => {
        setNewAnnouncement({ title: "", description: "", image_url: null, preview: null });
        setEditingId(null);
        setShowFormModal(false);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/announcement/delete/${deleteId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchAnnouncements();
                setShowDeleteModal(false);
                setDeleteId(null);
            } else {
                console.error("Failed to delete announcement:", await response.text());
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
        }
    };
    
    const openDeleteModal = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };
    
    const handleEdit = (announcements) => {
        setEditingId(announcements._id);
        setNewAnnouncement({ 
            title: announcements.title, 
            description: announcements.description, 
            image_url: null, 
            preview: announcements.image_url ? `http://localhost:3000/announcement/${announcements.image_url}` : null 
        });
        setShowFormModal(true);
    };

    const openAddModal = () => {
        resetForm();
        setShowFormModal(true);
    };

    // Pagination calculations
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
                    <div className="header-flex">
                        <h2 className="announcement-title">Announcements</h2>
                        <button 
                            className="add-post-btn"
                            onClick={openAddModal}
                        >
                            + Add Post
                        </button>
                    </div>
                    <p className="announcement-subtitle">Manage school announcements and communications</p>
                </div>

                {/* Announcement List Section */}
                <div className="announcement-list-section">
                    <h3 className="section-title">Current Announcements</h3>

                    {/* Announcement List */}
                    <div className="announcements-grid">
                        {currentAnnouncements.length > 0 ? (
                            currentAnnouncements.map((announcements) => {
                                const imagePath = announcements.image_url
                                ? `http://localhost:3000/announcement/${announcements.image_url}`
                                : null;
                                const formattedDate = new Date(announcements.created_at).toLocaleDateString();

                                return (
                                <div key={announcements._id} className="announcement-card">
                                    <div className="card-image-container">
                                    {imagePath ? (
                                        <img 
                                            src={imagePath} 
                                            alt={announcements.title} 
                                            className="card-image" 
                                        />
                                    ) : (
                                        <div className="no-image-placeholder">
                                            <i className="fa fa-image"></i>
                                            <p>No Image</p>
                                        </div>
                                    )}
                                    </div>
                                    <div className="card-content">
                                        <h4 className="card-title">{announcements.title}</h4>
                                        <p className="announcement-date">
                                            <i className="fa fa-calendar"></i> {formattedDate}
                                        </p>
                                        <div className="card-description-container">
                                            <p className="card-description">{announcements.description}</p>
                                        </div>
                                        <div className="card-actions">
                                            <button onClick={() => handleEdit(announcements)} className="edit-btn">
                                                <i className="fa fa-pencil"></i> Edit
                                            </button>
                                            <button onClick={() => openDeleteModal(announcements._id)} className="delete-btn">
                                                <i className="fa fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                );
                            })
                        ) : (
                            <div className="no-announcements">
                                <i className="fa fa-info-circle"></i>
                                <p>No announcements available.</p>
                                <button 
                                    className="create-first-btn"
                                    onClick={openAddModal}
                                >
                                    Create your first announcement
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="page-nav" 
                                onClick={() => paginate(Math.max(1, pageNumber - 1))}
                                disabled={pageNumber === 1}
                            >
                                <i className="fa fa-chevron-left"></i>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button 
                                    key={i + 1} 
                                    className={`page-button ${pageNumber === i + 1 ? "active" : ""}`} 
                                    onClick={() => paginate(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                className="page-nav" 
                                onClick={() => paginate(Math.min(totalPages, pageNumber + 1))}
                                disabled={pageNumber === totalPages}
                            >
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Announcement Modal */}
            {showFormModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>{editingId ? "Edit Announcement" : "Create New Announcement"}</h3>
                            <button className="modal-close" onClick={resetForm}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreateOrUpdateAnnouncement}>
                                <div className="form-group">
                                    <label htmlFor="announcement-title">Title</label>
                                    <input
                                        id="announcement-title"
                                        type="text"
                                        placeholder="Enter announcement title"
                                        value={newAnnouncement.title}
                                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                                        maxLength={100}
                                        required
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
                                        required
                                    />
                                    <small className="char-count">{newAnnouncement.description.length}/500 characters</small>
                                </div>

                                <div className="form-group">
                                    <label className="custom-file-upload">
                                        <input 
                                            type="file" 
                                            onChange={(e) => setNewAnnouncement(prev => ({ 
                                                ...prev, 
                                                image_url: e.target.files[0], 
                                                preview: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : prev.preview 
                                            }))} 
                                            accept="image/*" 
                                        />
                                        <i className="fa fa-cloud-upload"></i> Upload Image
                                    </label>

                                    {(newAnnouncement.preview || newAnnouncement.image_url) && (
                                        <div className="preview-container">
                                            <img 
                                                src={newAnnouncement.preview} 
                                                alt="Preview" 
                                                className="preview-image" 
                                            />
                                            <button 
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => setNewAnnouncement(prev => ({ ...prev, image_url: null, preview: null }))}
                                            >
                                                Remove Image
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button type="submit" className="submit-button">
                                        {editingId ? "Update Announcement" : "Post Announcement"}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={resetForm}
                                        className="cancel-button"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-container delete-modal">
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="delete-warning">
                                <i className="fa fa-exclamation-triangle"></i>
                                <p>Are you sure you want to delete this announcement?</p>
                                <p className="delete-note">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleDelete} className="delete-confirm-btn">
                                Yes, Delete
                            </button>
                            <button 
                                onClick={() => setShowDeleteModal(false)} 
                                className="delete-cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageAnnouncement;