import React, { useState, useEffect } from "react";
import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import '../PreRegistration/Pre-registration.css';


//Link them to
//href = "appointment"


function PreRegistration() {
    const [activeTab, setActiveTab] = useState('details');
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
    const [selectedTab, setSelectedTab] = useState('pre-registration');
    const [successType, setSuccessType] = useState(null); // 'registration' or 'appointment'

    const [appointmentData, setAppointmentData] = useState({
        appointmentDate: "",
        appointmentTime: "",
        appointmentReason: ""
    });
    const [appointmentErrors, setAppointmentErrors] = useState({});

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
        setFormErrors({...formErrors, [e.target.name]: "" });
    };

    const handleAppointmentChange = (e) => {
        setAppointmentData({
            ...appointmentData,
            [e.target.name]: e.target.value
        });
        setAppointmentErrors({
            ...appointmentErrors,
            [e.target.name]: ""
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log("Form submitted:", formData);

            setTimeout(() => {
                setRegistrationSuccess(true);
                setSuccessType('registration');
                setFormData({
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
                setProgress(0); // Reset progress on success
            }, 1000);
        }
    };

    const handleAppointmentSubmit = (e) => {
        e.preventDefault();
        const errors = validateAppointment(appointmentData);
        setAppointmentErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log("Appointment submitted:", appointmentData);
            setTimeout(() => {
                setRegistrationSuccess(true);
                setSuccessType('appointment');
                setAppointmentData({
                    appointmentDate: "",
                    appointmentTime: "",
                    appointmentReason: ""
                });
            }, 1000);
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

    const validateAppointment = (data) => {
        let errors = {};

        if (!data.appointmentDate) {
            errors.appointmentDate = "Appointment Date is required";
        }
        if (!data.appointmentTime) {
            errors.appointmentTime = "Appointment Time is required";
        }
        if (!data.appointmentReason?.trim()) {
            errors.appointmentReason = "Purpose of Visit is required";
        }

        return errors;
    };

    useEffect(() => {
        const totalFields = Object.keys(formData).length;
        const filledFields = Object.values(formData).filter(value => value!== "").length;
        const calculatedProgress = filledFields / totalFields * 100;
        setProgress(calculatedProgress);
    }, [formData]);

    const renderDetailsTab = () => (
        <div className="pre-reg-form-container">
            <div className="pre-reg-title">Personal Information</div>
            <form onSubmit={handleSubmit}>
                <div className="pre-reg-form-grid">
                    <div className="form-group">
                        <label htmlFor="firstName">FIRST NAME</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                        {formErrors.firstName && <div className="error">{formErrors.firstName}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">LAST NAME</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                        {formErrors.lastName && <div className="error">{formErrors.lastName}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">DATE OF BIRTH</label>
                        <input 
                            type="date" 
                            id="dateOfBirth" 
                            name="dateOfBirth" 
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]} // Prevents future dates
                        />
                        {formErrors.dateOfBirth && <div className="error">{formErrors.dateOfBirth}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">GENDER</label>
                        <input type="text" id="gender" name="gender" value={formData.gender} onChange={handleChange} />
                        {formErrors.gender && <div className="error">{formErrors.gender}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="nationality">NATIONALITY</label>
                        <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                        {formErrors.nationality && <div className="error">{formErrors.nationality}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="yearLevel">GRADE LEVEL</label>
                        <select
                            id="yearLevel"
                            name="yearLevel"
                            value={formData.yearLevel}
                            onChange={handleChange}
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
                        <div className="form-group">
                            <label htmlFor="strand">STRAND</label>
                            <select
                                id="strand"
                                name="strand"
                                value={formData.strand}
                                onChange={handleChange}
                            >
                                <option value="">Select Strand</option>
                                <option value="abm">ABM (Accountancy, Business and Management)</option>
                                <option value="stem">STEM (Science, Technology, Engineering and Mathematics)</option>
                                <option value="humss">HUMSS (Humanities and Social Sciences)</option>
                            </select>
                            {formErrors.strand && <div className="error">{formErrors.strand}</div>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">EMAIL</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                        {formErrors.email && <div className="error">{formErrors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="mobileNumber">MOBILE NUMBER</label>
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
                        />
                        {formErrors.mobileNumber && <div className="error">{formErrors.mobileNumber}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="isNewStudent">ARE YOU NEW OR AN OLD STUDENT?</label>
                        <div className="radio-group">
                            <label>
                                <input type="radio" name="isNewStudent" value="new" onChange={handleChange} /> NEW
                            </label>
                            <label>
                                <input type="radio" name="isNewStudent" value="old" onChange={handleChange} /> OLD
                            </label>
                        </div>
                        {formErrors.isNewStudent && <div className="error">{formErrors.isNewStudent}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="parentFirstName">NAME OF PARENT OR GUARDIAN (FIRST NAME)</label>
                        <input type="text" id="parentFirstName" name="parentFirstName" value={formData.parentFirstName} onChange={handleChange} />
                        {formErrors.parentFirstName && <div className="error">{formErrors.parentFirstName}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="parentLastName">LAST NAME</label>
                        <input type="text" id="parentLastName" name="parentLastName" value={formData.parentLastName} onChange={handleChange} />
                        {formErrors.parentLastName && <div className="error">{formErrors.parentLastName}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="parentMobileNumber">MOBILE NUMBER</label>
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
                        />
                        {formErrors.parentMobileNumber && <div className="error">{formErrors.parentMobileNumber}</div>}
                    </div>
                </div>
                <button 
                    className="pre-reg-submit-btn" 
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );

    const renderAppointmentTab = () => (
        <div className="pre-reg-appointment-container">
            <div className="pre-reg-title">Schedule Appointment</div>
            <form onSubmit={handleAppointmentSubmit} className="appointment-form">
                <div className="form-group">
                    <label htmlFor="appointmentDate">Preferred Date *</label>
                    <input 
                        type="date" 
                        id="appointmentDate" 
                        name="appointmentDate"
                        value={appointmentData.appointmentDate}
                        onChange={handleAppointmentChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                    {appointmentErrors.appointmentDate && 
                        <div className="error">{appointmentErrors.appointmentDate}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="appointmentTime">Preferred Time *</label>
                    <select 
                        id="appointmentTime" 
                        name="appointmentTime"
                        value={appointmentData.appointmentTime}
                        onChange={handleAppointmentChange}
                        required
                    >
                        <option value="">Select Time</option>
                        <option value="9:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                    </select>
                    {appointmentErrors.appointmentTime && 
                        <div className="error">{appointmentErrors.appointmentTime}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="appointmentReason">Purpose of Visit *</label>
                    <textarea 
                        id="appointmentReason" 
                        name="appointmentReason"
                        value={appointmentData.appointmentReason}
                        onChange={handleAppointmentChange}
                        rows="4"
                        placeholder="Please describe the reason for your appointment"
                        required
                    ></textarea>
                    {appointmentErrors.appointmentReason && 
                        <div className="error">{appointmentErrors.appointmentReason}</div>}
                </div>
                <button 
                    className="pre-reg-submit-btn"
                    type="submit"
                >
                    Book Appointment
                </button>
            </form>
        </div>
    );

    const renderConfirmTab = () => (
        <div className="pre-reg-confirm-container">
            <div className="pre-reg-title">Confirm Details</div>
            {/* Add confirmation summary */}
            <div className="pre-reg-btn-group">
                <button 
                    className="pre-reg-back-btn" 
                    onClick={() => setActiveTab('appointment')}
                >
                    Back
                </button>
                <button 
                    className="pre-reg-submit-btn" 
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );

    const renderSuccessTab = () => (
        <div className="pre-reg-success-container">
            <div className="pre-reg-success-icon">✓</div>
            <div className="pre-reg-success-title">Registration Successful!</div>
            <div className="pre-reg-success-message">
                Thank you for pre-registering! We will contact you soon.
            </div>
        </div>
    );

    const renderSuccessPage = () => (
        <div className="pre-reg-success-wrapper">
            <div className="pre-reg-success-card">
                <div className="pre-reg-success-checkmark">✓</div>
                <h1 className="pre-reg-success-heading">
                    {successType === 'registration' ? 'Pre-Registration Successful!' : 'Appointment Booked Successfully!'}
                </h1>
                <div className="pre-reg-success-details">
                    <p>{successType === 'registration' 
                        ? 'Thank you for pre-registering with us.' 
                        : 'Your appointment has been scheduled successfully.'}
                    </p>
                    <div className="pre-reg-success-info">
                        <p>What happens next?</p>
                        <ul>
                            {successType === 'registration' ? (
                                <>
                                    <li>You will receive a confirmation email shortly</li>
                                    <li>Our admissions team will review your application</li>
                                    <li>We will contact you within 2-3 business days</li>
                                </>
                            ) : (
                                <>
                                    <li>You will receive an appointment confirmation email</li>
                                    <li>Please arrive 15 minutes before your scheduled time</li>
                                    <li>Bring any relevant documents with you</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="pre-reg-success-buttons">
                    <button 
                        className="pre-reg-success-home-btn"
                        onClick={() => {
                            setRegistrationSuccess(false);
                            setSuccessType(null);
                            setSelectedTab('pre-registration');
                        }}
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="pre-reg-main-container">
                {registrationSuccess ? (
                    renderSuccessPage()
                ) : (
                    <>
                        <div className="pre-reg-tab-buttons">
                            <button 
                                className={`pre-reg-tab-btn ${selectedTab === 'pre-registration' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('pre-registration')}
                            >
                                Pre-Registration
                            </button>
                            <button 
                                className={`pre-reg-tab-btn ${selectedTab === 'appointment' ? 'active' : ''}`}
                                onClick={() => setSelectedTab('appointment')}
                            >
                                Book Appointment
                            </button>
                        </div>

                        {selectedTab === 'pre-registration' && (
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

                                {activeTab === 'details' && renderDetailsTab()}
                                {activeTab === 'confirm' && renderConfirmTab()}
                                {registrationSuccess && renderSuccessTab()}
                            </div>
                        )}

                        {selectedTab === 'appointment' && (
                            <div className="pre-reg-appointment-section">
                                <div className="pre-reg-title">Book an Appointment</div>
                                <div className="appointment-form">
                                    <div className="form-group">
                                        <label htmlFor="appointmentDate">Preferred Date</label>
                                        <input 
                                            type="date" 
                                            id="appointmentDate" 
                                            name="appointmentDate"
                                            value={appointmentData.appointmentDate}
                                            onChange={handleAppointmentChange}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="appointmentTime">Preferred Time</label>
                                        <select 
                                            id="appointmentTime" 
                                            name="appointmentTime"
                                            value={appointmentData.appointmentTime}
                                            onChange={handleAppointmentChange}
                                        >
                                            <option value="">Select Time</option>
                                            <option value="9:00">9:00 AM</option>
                                            <option value="10:00">10:00 AM</option>
                                            <option value="11:00">11:00 AM</option>
                                            <option value="13:00">1:00 PM</option>
                                            <option value="14:00">2:00 PM</option>
                                            <option value="15:00">3:00 PM</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="appointmentReason">Purpose of Visit</label>
                                        <textarea 
                                            id="appointmentReason" 
                                            name="appointmentReason"
                                            value={appointmentData.appointmentReason}
                                            onChange={handleAppointmentChange}
                                            rows="4"
                                            placeholder="Please describe the reason for your appointment"
                                        ></textarea>
                                    </div>
                                    <button 
                                        className="pre-reg-submit-btn"
                                        onClick={handleAppointmentSubmit}
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}

export default PreRegistration;