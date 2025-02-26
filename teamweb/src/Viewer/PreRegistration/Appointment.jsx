import React, { useState } from 'react';
import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';
import './Appointment.css';

function Appointment() {
    const [appointmentData, setAppointmentData] = useState({
        appointmentDate: "",
        appointmentTime: "",
        appointmentReason: "",
        status: "pending"
    });
    const [appointmentErrors, setAppointmentErrors] = useState({});
    const [appointmentSuccess, setAppointmentSuccess] = useState(false);

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

    const validateAppointment = (data) => {
        let errors = {};
        if (!data.appointmentDate) errors.appointmentDate = "Appointment Date is required";
        if (!data.appointmentTime) errors.appointmentTime = "Appointment Time is required";
        if (!data.appointmentReason?.trim()) errors.appointmentReason = "Purpose of Visit is required";
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateAppointment(appointmentData);
        setAppointmentErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log("Appointment submitted:", appointmentData);
            setTimeout(() => {
                setAppointmentSuccess(true);
            }, 1000);
        }
    };

    const renderSuccessPage = () => (
        <div className="appointment-success-wrapper">
            <div className="appointment-success-card">
                <div className="appointment-success-checkmark">✓</div>
                <h1 className="appointment-success-heading">Appointment Booked Successfully!</h1>
                <div className="appointment-success-details">
                    <p>Your appointment has been scheduled successfully.</p>
                    <div className="appointment-success-info">
                        <p>What happens next?</p>
                        <ul>
                            <li>You will receive an appointment confirmation email</li>
                            <li>Please arrive 15 minutes before your scheduled time</li>
                            <li>Bring any relevant documents with you</li>
                        </ul>
                    </div>
                </div>
                <div className="appointment-success-buttons">
                    <a href="/" className="appointment-success-home-btn">
                        Return to Homepage
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="appointment-main-container">
                {appointmentSuccess ? (
                    renderSuccessPage()
                ) : (
                    <div className="appointment-section">
                        <div className="appointment-title">Book an Appointment</div>
                        <form onSubmit={handleSubmit} className="appointment-form">
                            <div className="appointment-form-group">
                                <label htmlFor="appointmentDate">
                                    Preferred Date <span className="appointment-required">*</span>
                                </label>
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
                                    <div className="appointment-error">{appointmentErrors.appointmentDate}</div>}
                            </div>
                            <div className="appointment-form-group">
                                <label htmlFor="appointmentTime">
                                    Preferred Time <span className="appointment-required">*</span>
                                </label>
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
                                    <div className="appointment-error">{appointmentErrors.appointmentTime}</div>}
                            </div>
                            <div className="appointment-form-group">
                                <label htmlFor="appointmentReason">
                                    Purpose of Visit <span className="appointment-required">*</span>
                                </label>
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
                                    <div className="appointment-error">{appointmentErrors.appointmentReason}</div>}
                            </div>
                            <div className="appointment-btn-group">
                                <button 
                                    type="submit"
                                    className="appointment-submit-btn"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

        </>
    );
}

export default Appointment;