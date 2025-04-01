import React, { useState, useEffect } from 'react';
import './updateappointment.css';
import { Calendar, Clock, AlertCircle, User, Users, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const UpdateAppointment = (props) => {
  // Initial state for calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentForm, setAppointmentForm] = useState({
    timeSlots: [],
    purpose: '',
    maxAppointments: 5
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('availability');

  // Generate time slots from 9 AM to 4 PM in 1-hour intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  };

  const availableTimeSlots = generateTimeSlots();

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Get the next 7 days starting from the current date
  const getNextSevenDays = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Load appointment data
  useEffect(() => {
    fetchAvailabilityData();
    fetchBookingsData();
  }, [props.studentData, currentDate]);

  const fetchAvailabilityData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/booking/bookingAvailability');
      if (!response.ok) {
        throw new Error('Failed to fetch availability data');
      }
      const data = await response.json();
      
      setAvailabilityData(data);
      
      const formattedAppointments = {};
      data.forEach(item => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekDays = getNextSevenDays(currentDate);
        
        weekDays.forEach(date => {
          const dayName = days[date.getDay()];
          if (item.availability[dayName] && item.availability[dayName].length > 0) {
            const dateStr = formatDate(date);
            
            if (!formattedAppointments[dateStr]) {
              formattedAppointments[dateStr] = [];
            }
            
            formattedAppointments[dateStr].push({
              id: item._id,
              timeSlots: item.availability[dayName] || [],
              purpose: 'Available Slots',
              maxAppointments: 5
            });
          }
        });
      });
      
      setAppointments(formattedAppointments);
    } catch (err) {
      setError('Failed to fetch appointment data: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchBookingsData = async () => {
    try {
      if (props.studentData && props.studentData.length > 0) {
        const studentBookings = props.studentData.map(student => {
          if (student.appointment_date) {
            return {
              _id: student._id,
              date: new Date(student.appointment_date),
              timeSlot: student.preferred_time || "09:00",
              studentName: student.name,
              studentEmail: student.email,
              studentPhone: student.phone_number,
              purpose: student.purpose_of_visit || "Registration",
              status: student.status === "approved" ? "confirmed" : "pending",
              grade_level: student.grade_level,
              strand: student.strand,
              gender: student.gender,
            };
          }
          return null;
        }).filter(booking => booking !== null);
        
        if (studentBookings.length > 0) {
          setBookingsData(studentBookings);
          return;
        }
      }
      
      // Fallback to mock data
      const today = new Date();
      const mockBookings = [];
      for (let i = 0; i < 14; i++) {
        const bookingDate = new Date(today);
        bookingDate.setDate(today.getDate() + i);
        
        const numBookings = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < numBookings; j++) {
          const hour = Math.floor(Math.random() * 8) + 9;
          const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
          
          mockBookings.push({
            _id: `booking_${i}_${j}`,
            date: bookingDate,
            timeSlot: timeSlot,
            studentName: `Student ${Math.floor(Math.random() * 100) + 1}`,
            studentEmail: `student${Math.floor(Math.random() * 100) + 1}@example.com`,
            studentPhone: `+63 9${Math.floor(Math.random() * 100000000) + 900000000}`,
            purpose: ["Registration", "Document Submission", "Consultation"][Math.floor(Math.random() * 3)],
            status: Math.random() > 0.2 ? "confirmed" : "pending",
            grade_level: ["11", "12", "10", "9"][Math.floor(Math.random() * 4)],
            strand: ["ABM", "STEM", "HUMSS", ""][Math.floor(Math.random() * 4)]
          });
        }
      }
      
      setBookingsData(mockBookings);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  // Get current date + next 6 days
  const getCurrentWeekDays = () => {
    return getNextSevenDays(currentDate);
  };

  // Navigate between date ranges
  const navigateDays = (step) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (step * 7));
    setCurrentDate(newDate);
  };

  // Handle click on a calendar day
  const handleDayClick = (day) => {
    setSelectedDate(day);
    setEditingAppointmentId(null);
    
    if (viewMode === 'availability') {
      setAppointmentForm({
        timeSlots: [''],
        purpose: '',
        maxAppointments: 5
      });
    }
    
    setIsFormVisible(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'maxAppointments') {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) return;
      
      setAppointmentForm({
        ...appointmentForm,
        [name]: Math.min(Math.max(1, numValue), 20)
      });
    } else {
      setAppointmentForm({
        ...appointmentForm,
        [name]: value
      });
    }
  };

  // Save appointment
  const saveAppointment = async () => {
    if (!appointmentForm.timeSlots || appointmentForm.timeSlots.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      const availabilityUpdate = {
        [dayOfWeek]: appointmentForm.timeSlots
      };
      
      let response;
      if (editingAppointmentId) {
        response = await fetch(`http://localhost:3000/booking/editBookingAvailability/${editingAppointmentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ availability: availabilityUpdate })
        });
      } else {
        response = await fetch('http://localhost:3000/booking/addBookingAvailability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ availability: availabilityUpdate })
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to save appointment');
      }
      
      await fetchAvailabilityData();
      
      setIsFormVisible(false);
      setEditingAppointmentId(null);
      
      toast.success(editingAppointmentId ? 'Appointment updated successfully' : 'Appointment created successfully');
    } catch (err) {
      toast.error('Failed to save appointment: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit appointment
  const editAppointment = (appointment) => {
    setAppointmentForm({
      timeSlots: appointment.timeSlots || [],
      purpose: appointment.purpose || '',
      maxAppointments: appointment.maxAppointments || 5
    });
    setEditingAppointmentId(appointment.id);
    setIsFormVisible(true);
  };

  // Delete appointment
  const deleteAppointment = async (appointmentId) => {
    try {
      setIsLoading(true);
      
      const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      const availabilityUpdate = {
        [dayOfWeek]: []
      };
      
      const response = await fetch(`http://localhost:3000/booking/editBookingAvailability/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability: availabilityUpdate })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
      
      await fetchAvailabilityData();
      
      toast.success('Appointment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete appointment: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add time slot
  const addTimeSlot = () => {
    const newTimeSlots = [...appointmentForm.timeSlots, ''];
    setAppointmentForm({
      ...appointmentForm,
      timeSlots: newTimeSlots
    });
  };
  
  // Remove time slot
  const removeTimeSlot = (index) => {
    const newTimeSlots = [...appointmentForm.timeSlots];
    newTimeSlots.splice(index, 1);
    setAppointmentForm({
      ...appointmentForm,
      timeSlots: newTimeSlots
    });
  };
  
  // Update time slot
  const updateTimeSlot = (index, value) => {
    const newTimeSlots = [...appointmentForm.timeSlots];
    newTimeSlots[index] = value;
    setAppointmentForm({
      ...appointmentForm,
      timeSlots: newTimeSlots
    });
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    
    return bookingsData.filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === dateObj.getTime();
    });
  };
  
  // Get bookings organized by time slot
  const getBookingsByTimeSlot = (date) => {
    const bookings = getBookingsForDate(date);
    const slotMap = {};
    
    bookings.forEach(booking => {
      if (!slotMap[booking.timeSlot]) {
        slotMap[booking.timeSlot] = [];
      }
      slotMap[booking.timeSlot].push(booking);
    });
    
    return Object.entries(slotMap)
      .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
      .map(([time, bookings]) => ({ time, bookings }));
  };

  // Render week days
  const renderWeekDays = () => {
    const days = getCurrentWeekDays();
    
    return days.map((day, index) => {
      const dayNumber = day.getDate();
      const isToday = day.toDateString() === new Date().toDateString();
      const dateStr = formatDate(day);
      
      // Check if this day is selected
      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
      
      const hasAppointments = appointments[dateStr] && appointments[dateStr].length > 0;
      const bookings = getBookingsForDate(day);
      
      return (
        <div 
          key={index}
          className={`calendar-day 
            ${isToday ? 'today' : ''}
            ${isSelected ? 'selected' : ''}
            ${viewMode === 'availability' && hasAppointments ? 'has-appointments' : ''}
            ${viewMode === 'bookings' && bookings.length > 0 ? 'has-bookings' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <div className="weekday-name">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}
          </div>
          <span className="day-number">{dayNumber}</span>
          {viewMode === 'availability' && hasAppointments && (
            <span className="appointment-count">
              {appointments[dateStr].reduce((sum, appt) => sum + (appt.timeSlots?.length || 0), 0)}
            </span>
          )}
          {viewMode === 'bookings' && bookings.length > 0 && (
            <span className="booking-count">{bookings.length}</span>
          )}
        </div>
      );
    });
  };

  // Render bookings for selected date
  const renderBookings = () => {
    const bookingsBySlot = getBookingsByTimeSlot(selectedDate);
    
    if (bookingsBySlot.length === 0) {
      return <div className="no-bookings">No bookings found for this date.</div>;
    }
    
    return (
      <div className="bookings-by-slot">
        {bookingsBySlot.map(({ time, bookings }, index) => (
          <div key={index} className="time-slot-bookings">
            <h4 className="time-slot-header">
              <Clock size={16} />
              {time}
              <span className="booking-count">{bookings.length} booking(s)</span>
            </h4>
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking._id} className={`booking-item ${booking.status}`}>
                  <div className="booking-student-info">
                    <div className="booking-student-name">
                      <User size={16} />
                      {booking.studentName}
                    </div>
                    <div className="booking-purpose">{booking.purpose}</div>
                    <div className="booking-contact">
                      <div className="booking-email">{booking.studentEmail}</div>
                      <div className="booking-phone">{booking.studentPhone}</div>
                    </div>
                  </div>
                  <div className="booking-actions">
                    <div className="booking-status-badge">
                      {booking.status}
                    </div>
                    <button 
                      className="btn-view-details"
                      onClick={() => props.onViewStudentDetails?.(booking._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render calendar header with date range
  const renderCalendarHeader = () => {
    const days = getCurrentWeekDays();
    const startDate = days[0];
    const endDate = days[6];
    const options = { month: 'short', day: 'numeric' };
    
    return (
      <div className="calendar-header">
        <button onClick={() => navigateDays(-1)}>&lt; Previous 7 Days</button>
        <h2>
          {startDate.toLocaleDateString('default', options)} - {endDate.toLocaleDateString('default', options)}
        </h2>
        <button onClick={() => navigateDays(1)}>Next 7 Days &gt;</button>
      </div>
    );
  };

  return (
    <div className="appointment-calendar">
      <div className="section-header">
        <h2>Manage Appointment System</h2>
        <p>Configure and view appointments for student pre-registration</p>
      </div>
      
      <div className="view-mode-tabs">
        <button 
          className={`view-tab ${viewMode === 'availability' ? 'active' : ''}`}
          onClick={() => setViewMode('availability')}
        >
          <Calendar size={18} />
          Availability Settings
        </button>
        <button 
          className={`view-tab ${viewMode === 'bookings' ? 'active' : ''}`}
          onClick={() => setViewMode('bookings')}
        >
          <Users size={18} />
          Booked Appointments
        </button>
      </div>
      
      {renderCalendarHeader()}
      
      <div className="calendar-days">
        {renderWeekDays()}
      </div>
      
      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading appointment data...</p>
        </div>
      )}
      
      {error && (
        <div className="error-state">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}
      
      {selectedDate && !isLoading && !error && viewMode === 'availability' && (
        <div className="appointment-section">
          <h3>
            <Calendar size={20} />
            Appointment Slots for {selectedDate.toLocaleDateString('default', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </h3>
          
          {appointments[formatDate(selectedDate)]?.length > 0 ? (
            <div className="appointment-list">
              {appointments[formatDate(selectedDate)].map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <div className="appointment-purpose">
                      <strong>Purpose:</strong> {appointment.purpose}
                    </div>
                    <div className="appointment-slots">
                      <strong>Available Time Slots:</strong>
                      <div className="time-slots-container">
                        {appointment.timeSlots?.length > 0 ? (
                          appointment.timeSlots.map((slot, index) => {
                            const hour = parseInt(slot.split(':')[0]);
                            const ampm = hour >= 12 ? 'PM' : 'AM';
                            const displayHour = hour > 12 ? hour - 12 : hour;
                            return (
                              <div key={index} className="time-slot">
                                <Clock size={14} />
                                <span>{`${displayHour}:00 ${ampm}`}</span>
                              </div>
                            );
                          })
                        ) : (
                          <span className="no-slots">No time slots defined</span>
                        )}
                      </div>
                    </div>
                    <div className="appointment-limit">
                      <strong>Max Appointments Per Slot:</strong> {appointment.maxAppointments}
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <button onClick={() => editAppointment(appointment)}>Edit</button>
                    <button onClick={() => deleteAppointment(appointment.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <p>No appointment slots configured for this date.</p>
              <p>Click the button below to add availability.</p>
            </div>
          )}
          
          <button 
            className="add-appointment-button"
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              setEditingAppointmentId(null);
              if (!isFormVisible) {
                setAppointmentForm({
                  timeSlots: [''],
                  purpose: 'Student Registration',
                  maxAppointments: 5
                });
              }
            }}
            disabled={isLoading}
          >
            {isFormVisible ? 'Cancel' : 'Add Availability'}
          </button>
          
          {isFormVisible && (
            <div className="appointment-form">
              <h4>
                {editingAppointmentId ? 'Edit Appointment Availability' : 'New Appointment Availability'}
              </h4>
              
              <div className="form-group">
                <label>Purpose:</label>
                <input 
                  type="text" 
                  name="purpose" 
                  value={appointmentForm.purpose}
                  onChange={handleInputChange}
                  placeholder="e.g., Student Registration, Document Submission"
                />
              </div>
              
              <div className="form-group">
                <label>Time Slots:</label>
                {appointmentForm.timeSlots.map((timeSlot, index) => (
                  <div key={index} className="time-slot-input">
                    <select
                      value={timeSlot}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      required
                      className="time-slot-select"
                    >
                      <option value="">Select a time</option>
                      {availableTimeSlots.map(slot => {
                        const hour = parseInt(slot.split(':')[0]);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour > 12 ? hour - 12 : hour;
                        return (
                          <option key={slot} value={slot}>
                            {`${displayHour}:00 ${ampm}`}
                          </option>
                        );
                      })}
                    </select>
                    <button 
                      type="button" 
                      className="remove-slot-button"
                      onClick={() => removeTimeSlot(index)}
                      disabled={appointmentForm.timeSlots.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-slot-button"
                  onClick={addTimeSlot}
                  disabled={appointmentForm.timeSlots.length >= availableTimeSlots.length}
                >
                  + Add Time Slot
                </button>
              </div>
              
              <div className="form-group">
                <label>Max Appointments Per Time Slot:</label>
                <input 
                  type="number" 
                  name="maxAppointments" 
                  min="1" 
                  max="20"
                  value={appointmentForm.maxAppointments}
                  onChange={handleInputChange}
                />
                <small>Maximum number of students that can book each time slot</small>
              </div>
              
              <button 
                onClick={saveAppointment}
                disabled={isLoading}
                className="save-button"
              >
                {isLoading ? 'Saving...' : 'Save Availability'}
              </button>
            </div>
          )}
        </div>
      )}
      
      {selectedDate && !isLoading && !error && viewMode === 'bookings' && (
        <div className="bookings-section">
          <div className="bookings-header">
            <h3>
              <Users size={20} />
              Bookings for {selectedDate.toLocaleDateString('default', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </h3>
          </div>
          
          {renderBookings()}
        </div>
      )}
    </div>
  );
};

UpdateAppointment.propTypes = {
  studentData: PropTypes.array,
  onViewStudentDetails: PropTypes.func,
};

UpdateAppointment.defaultProps = {
  studentData: [],
  onViewStudentDetails: null,
};

export default UpdateAppointment;