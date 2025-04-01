import React, { useState, useEffect } from 'react';
import './updateappointment.css';
import { Calendar, Clock, AlertCircle, User, Users, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const UpdateAppointment = (props) => {
  // Initial state for calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
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
  const [viewMode, setViewMode] = useState('availability'); // 'availability' or 'bookings'

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Format date as YYYY-MM-DD
  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Load appointment data
  useEffect(() => {
    fetchAvailabilityData();
    fetchBookingsData();
  }, [props.studentData]); // Refetch when student data changes

  const fetchAvailabilityData = async () => {
    try {
      setIsLoading(true);
      
      // Mock availability data
      const mockData = {
        availability: [
          {
            _id: "1",
            date: new Date(2025, 3, 10), // April 10, 2025
            timeSlots: ["09:00", "10:30", "13:00", "14:30"],
            purpose: "Student Registration",
            maxAppointments: 5
          },
          {
            _id: "2",
            date: new Date(2025, 3, 15), // April 15, 2025
            timeSlots: ["09:30", "11:00", "13:30"],
            purpose: "Document Submission",
            maxAppointments: 3
          },
          {
            _id: "3",
            date: new Date(2025, 3, 22), // April 22, 2025
            timeSlots: ["10:00", "11:30", "14:00", "15:30"],
            purpose: "Parent Orientation",
            maxAppointments: 10
          }
        ]
      };
      
      setAvailabilityData(mockData.availability || []);
      
      // Process availability data to appointments format
      const formattedAppointments = {};
      mockData.availability?.forEach(item => {
        const dateStr = new Date(item.date).toISOString().split('T')[0];
        if (!formattedAppointments[dateStr]) {
          formattedAppointments[dateStr] = [];
        }
        
        formattedAppointments[dateStr].push({
          id: item._id,
          timeSlots: item.timeSlots || [],
          purpose: item.purpose || '',
          maxAppointments: item.maxAppointments || 5
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
      // Try to get real student data from props if available
      if (props.studentData && props.studentData.length > 0) {
        // Transform student data into booking format
        const studentBookings = props.studentData.map(student => {
          // Check if student has appointment data
          if (student.appointment_date) {
            return {
              _id: student._id,
              date: new Date(student.appointment_date),
              timeSlot: student.preferred_time || "09:00", // Default if not specified
              studentName: student.name,
              studentEmail: student.email,
              studentPhone: student.phone_number,
              purpose: student.purpose_of_visit || "Registration",
              status: student.status === "approved" ? "confirmed" : "pending",
              grade_level: student.grade_level,
              strand: student.strand,
              gender: student.gender,
              // Include any other relevant fields
            };
          }
          return null;
        }).filter(booking => booking !== null); // Remove nulls (students without appointments)
        
        if (studentBookings.length > 0) {
          setBookingsData(studentBookings);
          return; // Exit early if we have real data
        }
      }
      
      // Fall back to mock data if no real data available
      const today = new Date();
      
      // Create mock data for the past 7 days and upcoming days
      const mockBookings = [];
      for (let i = -7; i <= 14; i++) {
        const bookingDate = new Date(today);
        bookingDate.setDate(today.getDate() + i);
        
        // Create 1-5 random bookings for this date
        const numBookings = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < numBookings; j++) {
          // Generate random time 9AM - 4PM
          const hour = Math.floor(Math.random() * 8) + 9;
          const minute = Math.random() > 0.5 ? "00" : "30";
          const timeSlot = `${hour.toString().padStart(2, '0')}:${minute}`;
          
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

  // Handle click on a calendar day
  const handleDayClick = (day) => {
    if (!day) return; // Ignore clicks on empty cells
    
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateStr);
    setEditingAppointmentId(null);
    
    // Reset form values
    if (viewMode === 'availability') {
      setAppointmentForm({
        timeSlots: [''],
        purpose: '',
        maxAppointments: 5
      });
    }
    
    setIsFormVisible(false);
  };

  // Handle month navigation
  const navigateMonth = (step) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + step);
    setCurrentDate(newDate);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'maxAppointments') {
      // Ensure maxAppointments is a number between 1 and 20
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
      
      const appointmentData = {
        date: selectedDate,
        timeSlots: appointmentForm.timeSlots,
        purpose: appointmentForm.purpose,
        maxAppointments: appointmentForm.maxAppointments
      };
      
      // Skip API call for now and directly update local state
      const updatedAppointments = { ...appointments };
      
      if (!updatedAppointments[selectedDate]) {
        updatedAppointments[selectedDate] = [];
      }
      
      if (editingAppointmentId) {
        // Update existing appointment
        const apptIndex = updatedAppointments[selectedDate].findIndex(apt => apt.id === editingAppointmentId);
        if (apptIndex !== -1) {
          updatedAppointments[selectedDate][apptIndex] = {
            id: editingAppointmentId,
            ...appointmentForm
          };
        }
      } else {
        // Add new appointment with generated ID
        const newId = Date.now().toString();
        updatedAppointments[selectedDate].push({
          id: newId,
          ...appointmentForm
        });
      }
      
      setAppointments(updatedAppointments);
      setIsFormVisible(false);
      setEditingAppointmentId(null);
      
      toast.success(editingAppointmentId ? 'Appointment updated successfully' : 'Appointment created successfully');
      
      // Note: When your API is ready, replace with this API call:
      /*
      let url = 'http://localhost:3000/appointments/availability';
      let method = 'POST';
      
      if (editingAppointmentId) {
        url = `http://localhost:3000/appointments/availability/${editingAppointmentId}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Refresh data
      fetchAvailabilityData();
      */
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
      
      // Skip API call for now and directly update local state
      const updatedAppointments = { ...appointments };
      updatedAppointments[selectedDate] = updatedAppointments[selectedDate].filter(
        appointment => appointment.id !== appointmentId
      );
      setAppointments(updatedAppointments);
      
      toast.success('Appointment deleted successfully');
      
      // Note: When your API is ready, use this:
      /*
      const response = await fetch(`http://localhost:3000/appointments/availability/${appointmentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh data from server
      fetchAvailabilityData();
      */
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
  const getBookingsForDate = (dateStr) => {
    // Convert ISO string to date for comparison
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    // Filter bookings for the given date
    return bookingsData.filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === date.getTime();
    });
  };
  
  // Get bookings organized by time slot
  const getBookingsByTimeSlot = (dateStr) => {
    const bookings = getBookingsForDate(dateStr);
    const slotMap = {};
    
    bookings.forEach(booking => {
      if (!slotMap[booking.timeSlot]) {
        slotMap[booking.timeSlot] = [];
      }
      slotMap[booking.timeSlot].push(booking);
    });
    
    // Convert to sorted array
    return Object.entries(slotMap)
      .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
      .map(([time, bookings]) => ({ time, bookings }));
  };
  
  // Has bookings for the day
  const hasBookingsForDay = (day) => {
    if (!day) return false;
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getBookingsForDate(dateStr).length > 0;
  };

  // Has appointments for the day
  const hasAppointmentsForDay = (day) => {
    if (!day) return false;
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    return appointments[dateStr] && appointments[dateStr].length > 0;
  };
  
  // Get appointment counts for the day
  const getAppointmentCounts = (day) => {
    if (!day) return null;
    
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (!appointments[dateStr] || appointments[dateStr].length === 0) return null;
    
    // Count total time slots available
    let totalSlots = 0;
    appointments[dateStr].forEach(appointment => {
      totalSlots += appointment.timeSlots?.length || 0;
    });
    
    return totalSlots;
  };
  
  // Get bookings count for a day
  const getBookingsCount = (day) => {
    if (!day) return null;
    
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    const bookings = getBookingsForDate(dateStr);
    
    return bookings.length > 0 ? bookings.length : null;
  };

  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = generateCalendarDays();
    return days.map((day, index) => {
      const appointmentCount = getAppointmentCounts(day);
      const bookingCount = getBookingsCount(day);
      
      // Check if the day has appointments or bookings
      const hasContent = (viewMode === 'availability' && hasAppointmentsForDay(day)) || 
                         (viewMode === 'bookings' && hasBookingsForDay(day));
      
      // Check if this is today
      const isToday = day && 
        currentDate.getFullYear() === new Date().getFullYear() &&
        currentDate.getMonth() === new Date().getMonth() &&
        day === new Date().getDate();
      
      // Check if this is within the past week (for highlighting recent bookings)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      const thisDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
      const isRecentDay = thisDate && thisDate >= sevenDaysAgo && thisDate <= today;
      
      return (
        <div 
          key={index} 
          className={`calendar-day 
            ${!day ? 'empty' : ''} 
            ${hasContent ? 'has-content' : ''} 
            ${viewMode === 'bookings' && hasBookingsForDay(day) ? 'has-bookings' : ''}
            ${viewMode === 'availability' && hasAppointmentsForDay(day) ? 'has-appointments' : ''}
            ${isToday ? 'today' : ''}
            ${isRecentDay ? 'recent-day' : ''}`
          }
          onClick={() => day && handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
          {viewMode === 'availability' && appointmentCount && (
            <span className="appointment-count" title={`${appointmentCount} available time slots`}>
              {appointmentCount}
            </span>
          )}
          {viewMode === 'bookings' && bookingCount && (
            <span className="booking-count" title={`${bookingCount} bookings`}>
              {bookingCount}
            </span>
          )}
        </div>
      );
    });
  };

  // Render bookings for selected date
  const renderBookings = () => {
    const bookingsBySlot = getBookingsByTimeSlot(selectedDate);
    
    if (bookingsBySlot.length === 0) {
      return (
        <div className="no-bookings">
          <p>No bookings found for this date.</p>
        </div>
      );
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
                      onClick={() => navigateToStudentDetails(booking._id)}
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
  
  // Function to navigate to student details in the Student Records tab
  const navigateToStudentDetails = (studentId) => {
    // This function would be implemented to communicate with the parent component
    // to navigate to the Student Records tab and expand the student's details
    if (props.onViewStudentDetails) {
      props.onViewStudentDetails(studentId);
    } else {
      // If no parent handler is provided, just show a toast notification
      toast.info("View student details functionality requires integration with student records", {
        position: "top-center",
        autoClose: 3000
      });
    }
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
      
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)}>&lt;</button>
        <h2>{getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}</h2>
        <button onClick={() => navigateMonth(1)}>&gt;</button>
      </div>
      
      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      <div className="calendar-days">
        {renderCalendarDays()}
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
            Appointment Slots for {selectedDate}
          </h3>
          
          {appointments[selectedDate] && appointments[selectedDate].length > 0 ? (
            <div className="appointment-list">
              {appointments[selectedDate].map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <div className="appointment-purpose">
                      <strong>Purpose:</strong> {appointment.purpose || "General Registration"}
                    </div>
                    <div className="appointment-slots">
                      <strong>Available Time Slots:</strong>
                      <div className="time-slots-container">
                        {appointment.timeSlots && appointment.timeSlots.length > 0 ? (
                          appointment.timeSlots.map((slot, index) => (
                            <div key={index} className="time-slot">
                              <Clock size={14} />
                              <span>{slot}</span>
                            </div>
                          ))
                        ) : (
                          <span className="no-slots">No time slots defined</span>
                        )}
                      </div>
                    </div>
                    <div className="appointment-limit">
                      <strong>Max Appointments Per Slot:</strong> {appointment.maxAppointments || 5}
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
                    <input 
                      type="time" 
                      value={timeSlot}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      required
                    />
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
              Bookings for {selectedDate}
            </h3>
            
            {/* Check if the selected date is within past 7 days */}
            {(() => {
              const selectedDateObj = new Date(selectedDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const sevenDaysAgo = new Date(today);
              sevenDaysAgo.setDate(today.getDate() - 7);
              
              const isWithinPastWeek = selectedDateObj >= sevenDaysAgo && selectedDateObj <= today;
              
              if (isWithinPastWeek) {
                return (
                  <div className="recent-badge">
                    Within past 7 days
                  </div>
                );
              }
              return null;
            })()}
          </div>
          
          {renderBookings()}
        </div>
      )}
    </div>
  );
};

// PropTypes for component
UpdateAppointment.propTypes = {
  studentData: PropTypes.array,
  onViewStudentDetails: PropTypes.func,
  onSetActiveTab: PropTypes.func
};

// Default props
UpdateAppointment.defaultProps = {
  studentData: [],
  onViewStudentDetails: null,
  onSetActiveTab: null
};

export default UpdateAppointment;