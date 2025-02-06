import React, { useState } from "react";
import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import '../PreRegistration/Pre-registration.css';

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
    });

    const [formErrors, setFormErrors] = useState({});
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
        setFormErrors({...formErrors, [e.target.name]: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log("Form submitted:", formData);

            setTimeout(() => {
                setRegistrationSuccess(true);
                setFormData({ // Clear form after successful registration
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
                });
            }, 1000);
        }
    };

    const validateForm = (data) => {
        let errors = {};
        // Add your validation logic here if needed
        return errors;
    };

    return (
        <>{/* Input Here */}
        <Header/>{/* Input Here */}
        <div className="pre-registration-container">
            <h1>PRE-REGISTRATION</h1>
            <div className="progress-bar">
                <div className="progress"></div>
            </div>
            <h2>FILL UP THIS FORM</h2>
            {registrationSuccess && (
                <div className="success-message">
                    Thank you for pre-registering! We will contact you soon.
                </div>
            )}

            {!registrationSuccess && (
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
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
                            <input type="text" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
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
                            <label htmlFor="email">EMAIL</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                            {formErrors.email && <div className="error">{formErrors.email}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobileNumber">MOBILE NUMBER</label>
                            <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
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
                            <input type="tel" id="parentMobileNumber" name="parentMobileNumber" value={formData.parentMobileNumber} onChange={handleChange} />
                            {formErrors.parentMobileNumber && <div className="error">{formErrors.parentMobileNumber}</div>}
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>\
        <Footer/>
        </>
    );
}

export default PreRegistration;