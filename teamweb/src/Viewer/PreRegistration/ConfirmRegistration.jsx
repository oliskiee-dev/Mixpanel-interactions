import React, { useEffect, useState } from 'react';
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import './Pre-registration.css';

function ConfirmRegistration() {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('preRegFormData');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        } else {
            window.location.href = '/preregistration';
        }
    }, []);

    const handleEdit = (e) => {
        e.preventDefault();
        // Keep the data in sessionStorage when going back to edit
        window.location.href = '/preregistration?edit=true';
    };

    const handleConfirm = () => {
        // Store that registration was successful
        sessionStorage.setItem('registrationSuccess', 'true');
        // Clear form data
        sessionStorage.removeItem('preRegFormData');
        // Redirect to success page
        window.location.href = '/success';
    };

    if (!formData) return null;

    return (
        <>
            <Header />
            <div className="pre-reg-confirm-container">
                <h2 className="pre-reg-confirm-title">Review Your Information</h2>
                
                {/* Personal Information Section */}
                <div className="pre-reg-confirm-section">
                    <h3>Personal Information</h3>
                    <div className="pre-reg-confirm-grid">
                        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                        <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                        <p><strong>Gender:</strong> {formData.gender}</p>
                        <p><strong>Nationality:</strong> {formData.nationality}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Mobile Number:</strong> {formData.mobileNumber}</p>
                    </div>
                </div>

                {/* Academic Information Section */}
                <div className="pre-reg-confirm-section">
                    <h3>Academic Information</h3>
                    <div className="pre-reg-confirm-grid">
                        <p><strong>Student Status:</strong> {formData.isNewStudent === 'new' ? 'New Student' : 'Old Student'}</p>
                        <p><strong>Grade Level:</strong> {formData.yearLevel}</p>
                        {formData.strand && <p><strong>Strand:</strong> {formData.strand}</p>}
                    </div>
                </div>

                {/* Parent/Guardian Information Section */}
                <div className="pre-reg-confirm-section">
                    <h3>Parent/Guardian Information</h3>
                    <div className="pre-reg-confirm-grid">
                        <p><strong>Name:</strong> {formData.parentFirstName} {formData.parentLastName}</p>
                        <p><strong>Mobile Number:</strong> {formData.parentMobileNumber}</p>
                    </div>
                </div>

                <div className="pre-reg-confirm-buttons">
                    <button 
                        onClick={handleEdit}
                        className="pre-reg-edit-btn"
                    >
                        Edit Information
                    </button>
                    <button 
                        onClick={handleConfirm}
                        className="pre-reg-confirm-btn"
                    >
                        Confirm & Submit
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ConfirmRegistration;