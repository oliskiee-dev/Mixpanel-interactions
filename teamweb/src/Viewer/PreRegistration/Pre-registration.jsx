import React, { useState, useEffect } from "react";
import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import Appointment from './Appointment';
import './Pre-registration.css';

function PreRegistration() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        email: "",
        mobileNumber: "",
        isNewStudent: "",
        parentFirstName: "",
        parentLastName: "",
        parentMobileNumber: "",
        yearLevel: "",
        strand: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('pre-reg');

    useEffect(() => {
        // Check for existing form data when component mounts
        const storedData = sessionStorage.getItem('preRegFormData');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
        setFormErrors({...formErrors, [e.target.name]: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            sessionStorage.setItem('preRegFormData', JSON.stringify(formData));
            window.location.href = '/confirmregistration';
        }
    };

    const validateForm = (data) => {
        let errors = {};

        if (!data.firstName?.trim()) {
            errors.firstName = "First Name is required";
        }
        if (!data.lastName?.trim()) {
            errors.lastName = "Last Name is required";
        }
        if (!data.dateOfBirth?.trim()) {
            errors.dateOfBirth = "Date of Birth is required";
        }
        if (!data.gender?.trim()) {
            errors.gender = "Gender is required";
        }
        if (!data.nationality?.trim()) {
            errors.nationality = "Nationality is required";
        }
        if (!data.email?.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = "Email is invalid";
        }
        if (!data.mobileNumber?.trim()) {
            errors.mobileNumber = "Mobile Number is required";
        }
        if (!data.isNewStudent) {
            errors.isNewStudent = "Please select if you are a new or old student";
        }
        if (!data.parentFirstName?.trim()) {
            errors.parentFirstName = "Parent's First Name is required";
        }
        if (!data.parentLastName?.trim()) {
            errors.parentLastName = "Parent's Last Name is required";
        }
        if (!data.parentMobileNumber?.trim()) {
            errors.parentMobileNumber = "Parent's Mobile Number is required";
        }
        if (!data.yearLevel) {
            errors.yearLevel = "Grade Level is required";
        }
        if ((data.yearLevel === '11' || data.yearLevel === '12') && !data.strand) {
            errors.strand = "Strand is required for Senior High School students";
        }

        return errors;
    };

    useEffect(() => {
        const totalFields = 12; // Base number of required fields excluding strand
        let filledFields = Object.entries(formData).filter(([key, value]) => {
            // Don't count strand field for grades below 11
            if (key === 'strand' && !['11', '12'].includes(formData.yearLevel)) {
                return false;
            }
            return value !== "";
        }).length;

        // If grade 11 or 12 is selected, include strand in total required fields
        const adjustedTotalFields = ['11', '12'].includes(formData.yearLevel) ? totalFields + 1 : totalFields;
        
        const calculatedProgress = (filledFields / adjustedTotalFields) * 100;
        setProgress(Math.min(calculatedProgress, 100)); // Ensure progress doesn't exceed 100%
    }, [formData]);

    const renderDetailsTab = () => (
        <div className="pre-reg-form-container">
            <div className="pre-reg-title">Personal Information</div>
            <form onSubmit={handleSubmit}>
                <div className="pre-reg-form-grid">
                    <div className="pre-reg-form-group">
                        <label htmlFor="firstName">
                            FIRST NAME <span className="pre-reg-required">*</span>
                        </label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="pre-reg-input" />
                        {formErrors.firstName && <div className="error">{formErrors.firstName}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                        <label htmlFor="lastName">
                            LAST NAME <span className="pre-reg-required">*</span>
                        </label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="pre-reg-input" />
                        {formErrors.lastName && <div className="error">{formErrors.lastName}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                        <label htmlFor="dateOfBirth">
                            DATE OF BIRTH <span className="pre-reg-required">*</span>
                        </label>
                        <input 
                            type="date" 
                            id="dateOfBirth" 
                            name="dateOfBirth" 
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]} // Prevents future dates
                            className="pre-reg-input"
                        />
                        {formErrors.dateOfBirth && <div className="error">{formErrors.dateOfBirth}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                    <label htmlFor="gender">GENDER</label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {formErrors.gender && <div className="error">{formErrors.gender}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                        <label htmlFor="nationality">
                            NATIONALITY <span className="pre-reg-required">*</span>
                        </label>
                        <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} className="pre-reg-input" />
                        {formErrors.nationality && <div className="error">{formErrors.nationality}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                        <label htmlFor="yearLevel">
                            GRADE LEVEL <span className="pre-reg-required">*</span>
                        </label>
                        <select
                            id="yearLevel"
                            name="yearLevel"
                            value={formData.yearLevel}
                            onChange={handleChange}
                            className="pre-reg-select"
                        >
                            <option value="">Select Grade Level</option>
                            <option value="nursery">Nursery</option>
                            <option value="kinder1">Kinder 1</option>
                            <option value="kinder2">Kinder 2</option>
                            <option value="1">Grade 1</option>
                            <option value="2">Grade 2</option>
                            <option value="3">Grade 3</option>
                            <option value="4">Grade 4</option>
                            <option value="5">Grade 5</option>
                            <option value="6">Grade 6</option>
                            <option value="7">Grade 7</option>
                            <option value="8">Grade 8</option>
                            <option value="9">Grade 9</option>
                            <option value="10">Grade 10</option>
                            <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                        </select>
                        {formErrors.yearLevel && <div className="error">{formErrors.yearLevel}</div>}
                    </div>

                    {(formData.yearLevel === '11' || formData.yearLevel === '12') && (
                        <div className="pre-reg-form-group">
                            <label htmlFor="strand">
                                STRAND <span className="pre-reg-required">*</span>
                            </label>
                            <select
                                id="strand"
                                name="strand"
                                value={formData.strand}
                                onChange={handleChange}
                                className="pre-reg-select"
                            >
                                <option value="">Select Strand</option>
                                <option value="abm">ABM (Accountancy, Business and Management)</option>
                                <option value="stem">STEM (Science, Technology, Engineering and Mathematics)</option>
                                <option value="humss">HUMSS (Humanities and Social Sciences)</option>
                            </select>
                            {formErrors.strand && <div className="error">{formErrors.strand}</div>}
                        </div>
                    )}

                    <div className="pre-reg-form-group">
                        <label htmlFor="email">
                            EMAIL <span className="pre-reg-required">*</span>
                        </label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="pre-reg-input" />
                        {formErrors.email && <div className="error">{formErrors.email}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                        <label htmlFor="mobileNumber">
                            MOBILE NUMBER <span className="pre-reg-required">*</span>
                        </label>
                        <input 
                            type="tel" 
                            id="mobileNumber" 
                            name="mobileNumber" 
                            value={formData.mobileNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Only allows digits
                                setFormData({...formData, mobileNumber: value});
                                setFormErrors({...formErrors, mobileNumber: ""});
                            }}
                            pattern="[0-9]*"
                            maxLength="11" // Adjust this based on your country's phone number length
                            placeholder="Enter numbers only"
                            className="pre-reg-input"
                        />
                        {formErrors.mobileNumber && <div className="error">{formErrors.mobileNumber}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                        <label htmlFor="isNewStudent">
                            ARE YOU NEW OR AN OLD STUDENT? <span className="pre-reg-required">*</span>
                        </label>
                        <div className="pre-reg-radio-group">
                            <label className="pre-reg-radio-label">
                                <input 
                                    type="radio" 
                                    name="isNewStudent" 
                                    value="new" 
                                    checked={formData?.isNewStudent === "new"} 
                                    onChange={handleChange} 
                                    className="pre-reg-radio-input"
                                />
                                <span className="pre-reg-radio-text">NEW</span>
                            </label>
                            <label className="pre-reg-radio-label">
                                <input 
                                    type="radio" 
                                    name="isNewStudent" 
                                    value="old" 
                                    checked={formData?.isNewStudent === "old"} 
                                    onChange={handleChange} 
                                    className="pre-reg-radio-input"
                                />
                                <span className="pre-reg-radio-text">OLD</span>
                            </label>
                        </div>
                        {formErrors.isNewStudent && <div className="pre-reg-error">{formErrors.isNewStudent}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                        <label htmlFor="parentFirstName">
                            NAME OF PARENT OR GUARDIAN (FIRST NAME) <span className="pre-reg-required">*</span>
                        </label>
                        <input type="text" id="parentFirstName" name="parentFirstName" value={formData.parentFirstName} onChange={handleChange} className="pre-reg-input" />
                        {formErrors.parentFirstName && <div className="error">{formErrors.parentFirstName}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                        <label htmlFor="parentLastName">
                            LAST NAME <span className="pre-reg-required">*</span>
                        </label>
                        <input type="text" id="parentLastName" name="parentLastName" value={formData.parentLastName} onChange={handleChange} className="pre-reg-input" />
                        {formErrors.parentLastName && <div className="error">{formErrors.parentLastName}</div>}
                    </div>
                    <div className="pre-reg-form-group">
                        <label htmlFor="parentMobileNumber">
                            MOBILE NUMBER <span className="pre-reg-required">*</span>
                        </label>
                        <input 
                            type="tel" 
                            id="parentMobileNumber" 
                            name="parentMobileNumber" 
                            value={formData.parentMobileNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Only allows digits
                                setFormData({...formData, parentMobileNumber: value});
                                setFormErrors({...formErrors, parentMobileNumber: ""});
                            }}
                            pattern="[0-9]*"
                            maxLength="11" // Adjust this based on your country's phone number length
                            placeholder="Enter numbers only"
                            className="pre-reg-input"
                        />
                        {formErrors.parentMobileNumber && <div className="error">{formErrors.parentMobileNumber}</div>}
                    </div>
                </div>
                <button 
                    className="pre-reg-submit-btn" 
                    type="submit"
                >
                    Review Information
                </button>
            </form>
        </div>
    );

    const renderSuccessPage = () => (
        <div className="pre-reg-success-wrapper">
            <div className="pre-reg-success-card">
                <div className="pre-reg-success-checkmark">✓</div>
                <h1 className="pre-reg-success-heading">Pre-Registration Successful!</h1>
                <div className="pre-reg-success-details">
                    <p>Thank you for pre-registering with us.</p>
                    <div className="pre-reg-success-info">
                        <p>What happens next?</p>
                        <ul>
                            <li>You will receive a confirmation email shortly</li>
                            <li>Our admissions team will review your application</li>
                            <li>We will contact you within 2-3 business days</li>
                        </ul>
                    </div>
                </div>
                <div className="pre-reg-success-buttons">
                    <a href="/" className="pre-reg-success-home-btn">
                        Return to Homepage
                    </a>
                    <a href="/appointment" className="pre-reg-success-appointment-btn">
                        Book an Appointment
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="pre-reg-main-container">
                <div className="pre-reg-tabs">
                    <button 
                        className={`pre-reg-tab ${activeTab === 'pre-reg' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pre-reg')}
                    >
                        Pre-Registration
                    </button>
                    <button 
                        className={`pre-reg-tab ${activeTab === 'appointment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointment')}
                    >
                        Book Appointment
                    </button>
                </div>

                {activeTab === 'pre-reg' ? (
                    registrationSuccess ? (
                        renderSuccessPage()
                    ) : (
                        <div className="pre-reg-container">
                            <div className="pre-reg-progress-bar">
                                <div
                                    className="pre-reg-progress"
                                    style={{ width: `${progress}%` }}
                                    aria-valuenow={progress}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <div className="pre-reg-progress-percentage">
                                {progress.toFixed(0)}%
                            </div>

                            {renderDetailsTab()}
                        </div>
                    )
                ) : (
                    <Appointment />
                )}
            </div>
            <Footer />
        </>
    );
}

export default PreRegistration;