import React, { useState, useEffect } from 'react';
import './Appointment.css';

function Appointment() {
    const [appointmentData, setAppointmentData] = useState({
        email: "",
        appointmentDate: "",
        appointmentTime: "",
        appointmentReason: "",
        status: "pending"
    });
    const [appointmentErrors, setAppointmentErrors] = useState({});
    const [appointmentSuccess, setAppointmentSuccess] = useState(false);
    const [availabilityData, setAvailabilityData] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [availableDays, setAvailableDays] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch availability data on component mount
    useEffect(() => {
        fetchAvailabilityData();
    }, []);

    // Update available times when appointment date changes
    useEffect(() => {
        if (appointmentData.appointmentDate && availabilityData) {
            updateAvailableTimes(appointmentData.appointmentDate);
        }
    }, [appointmentData.appointmentDate, availabilityData]);

    const fetchAvailabilityData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/booking/bookingAvailability');
            const data = await response.json();
            
            if (data && data.length > 0) {
                setAvailabilityData(data[0]);
                generateAvailableDays(data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching availability data:', error);
            setLoading(false);
        }
    };

    const generateAvailableDays = (availabilityData) => {
        if (!availabilityData || !availabilityData.availability) return;

        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date();
        const availableDaysList = [];

        // Look ahead 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            const dayName = daysOfWeek[date.getDay()];
            
            // Check if this day has any availability slots
            if (availabilityData.availability[dayName] && 
                availabilityData.availability[dayName].length > 0) {
                
                availableDaysList.push({
                    dateString: date.toISOString().split('T')[0],
                    dayName,
                    formattedDate: formatDate(date)
                });
            }
        }

        setAvailableDays(availableDaysList);
    };

    const formatDate = (date) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const updateAvailableTimes = (dateString) => {
        if (!dateString || !availabilityData) return;

        // Convert date string to day of week
        const date = new Date(dateString);
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeek = daysOfWeek[date.getDay()];

        // Get times for selected day
        const times = availabilityData.availability[dayOfWeek] || [];
        
        // Extract start times from availability format "X:XX AM/PM - Y:YY AM/PM"
        const startTimes = times.map(timeRange => {
            const startTime = timeRange.split(' - ')[0];
            return convertTo24HourFormat(startTime);
        });

        setAvailableTimes(startTimes);
        
        // Reset selected time if it's not available
        if (appointmentData.appointmentTime && !startTimes.includes(appointmentData.appointmentTime)) {
            setAppointmentData({
                ...appointmentData,
                appointmentTime: ""
            });
        }
    };

    // Helper to convert "X:XX AM/PM" to 24-hour format
    const convertTo24HourFormat = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    };

    // Convert 24-hour format back to 12-hour format for display
    const convertTo12HourFormat = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
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

    const handleDateSelection = (dateString) => {
        setAppointmentData({
            ...appointmentData,
            appointmentDate: dateString,
            appointmentTime: ""
        });
        setAppointmentErrors({
            ...appointmentErrors,
            appointmentDate: ""
        });
    };

    const validateAppointment = (data) => {
        let errors = {};
        if (!data.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Invalid email format";
        if (!data.appointmentDate) errors.appointmentDate = "Appointment Date is required";
        if (!data.appointmentTime) errors.appointmentTime = "Appointment Time is required";
        if (!data.appointmentReason?.trim()) errors.appointmentReason = "Purpose of Visit is required";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateAppointment(appointmentData);
        setAppointmentErrors(errors);
    
        if (Object.keys(errors).length === 0) {
            try {
                const response = await fetch('http://localhost:3000/preregistration/addBooking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: appointmentData.email,
                        appointment_date: appointmentData.appointmentDate,
                        preferred_time: appointmentData.appointmentTime,
                        purpose_of_visit: appointmentData.appointmentReason,
                    }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    setAppointmentSuccess(true);
                } else {
                    alert(result.error || 'Failed to book appointment. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting appointment:', error);
                alert('Failed to connect to the server. Please try again.');
            }
        }
    };

    return (
        <>
            <div className="appointment-main-container">
                {appointmentSuccess ? (
                    <div className="appointment-success-wrapper">
                        <div className="appointment-success-card">
                            <div className="appointment-success-checkmark">✓</div>
                            <h1 className="appointment-success-heading">Appointment Booked Successfully!</h1>
                            <p>You will receive an appointment confirmation email at {appointmentData.email}.</p>
                            <br />
                            <br />
                            <a href="/" className="appointment-success-home-btn">Return to Homepage</a>
                        </div>
                    </div>
                ) : (
                    <div className="appointment-section">
                        <div className="appointment-title">Book an Appointment</div>
                        {loading ? (
                            <div className="appointment-loading">Loading availability data...</div>
                        ) : (
                            <form onSubmit={handleSubmit} className="appointment-form">
                                <div className="appointment-form-group">
                                    <label htmlFor="email">Email <span className="appointment-required">*</span></label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        value={appointmentData.email}
                                        onChange={handleAppointmentChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                    {appointmentErrors.email && 
                                        <div className="appointment-error">{appointmentErrors.email}</div>}
                                </div>
                                
                                <div className="appointment-form-group">
                                    <label>Preferred Date <span className="appointment-required">*</span></label>
                                    <div className="appointment-date-selection">
                                        {availableDays.length > 0 ? (
                                            availableDays.map(day => (
                                                <div 
                                                    key={day.dateString}
                                                    className={`appointment-date-option ${appointmentData.appointmentDate === day.dateString ? 'active' : ''}`}
                                                    onClick={() => handleDateSelection(day.dateString)}
                                                >
                                                    <div className="date-option-weekday">{day.dayName}</div>
                                                    <div className="date-option-date">{day.formattedDate}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="appointment-no-dates">No available dates within the next 7 days</div>
                                        )}
                                    </div>
                                    {appointmentErrors.appointmentDate && 
                                        <div className="appointment-error">{appointmentErrors.appointmentDate}</div>}
                                </div>
                                
                                <div className="appointment-form-group">
                                    <label htmlFor="appointmentTime">Preferred Time <span className="appointment-required">*</span></label>
                                    <div className="appointment-time-selection">
                                        {!appointmentData.appointmentDate ? (
                                            <div className="appointment-select-date-first">Please select a date first</div>
                                        ) : availableTimes.length === 0 ? (
                                            <div className="appointment-no-times">No available times for this date</div>
                                        ) : (
                                            <div className="appointment-time-options">
                                                {availableTimes.map(time => (
                                                    <div 
                                                        key={time}
                                                        className={`appointment-time-option ${appointmentData.appointmentTime === time ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setAppointmentData({
                                                                ...appointmentData,
                                                                appointmentTime: time
                                                            });
                                                            setAppointmentErrors({
                                                                ...appointmentErrors,
                                                                appointmentTime: ""
                                                            });
                                                        }}
                                                    >
                                                        {convertTo12HourFormat(time)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {appointmentErrors.appointmentTime && 
                                        <div className="appointment-error">{appointmentErrors.appointmentTime}</div>}
                                </div>
                                
                                <div className="appointment-form-group">
                                    <label htmlFor="appointmentReason">Purpose of Visit <span className="appointment-required">*</span></label>
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
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default Appointment;