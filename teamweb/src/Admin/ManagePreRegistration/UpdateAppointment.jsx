import React, { useState, useEffect } from "react";
import "./UpdateAppointment.css";

const UpdateAppointment = () => {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [availability, setAvailability] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });
  const [bookingId, setBookingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleDates, setVisibleDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSeventhDay, setLastSeventhDay] = useState("");

  useEffect(() => {
    // Generate only 7 days from today
    generateVisibleDates();
    // Fetch existing availability
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/bookingAvailability');
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Use the first availability document (or you could implement a selector if multiple exist)
        setAvailability(data[0].availability || {});
        setBookingId(data[0]._id);
        
        // Extract unavailable dates from the data
        // A date is unavailable if all time slots for that day are booked (not in availability)
        const allTimeSlots = generateTimeSlots().map(time => `${time} - ${getEndTime(time)}`);
        const unavailableDatesList = [];
        
        // Check visible dates against availability
        visibleDates.forEach(date => {
          const formattedDate = date.toISOString().split("T")[0];
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
          const daySlots = data[0].availability[dayOfWeek] || [];
          
          // If the day has no available slots or is marked as unavailable
          if (daySlots.length === 0 || data[0].unavailableDates?.includes(formattedDate)) {
            unavailableDatesList.push(formattedDate);
          }
        });
        
        setUnavailableDates(unavailableDatesList);
      }
      
      // Check for a new 7th day and reset it to available if needed
      checkAndResetSeventhDay();
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setIsLoading(false);
    }
  };

  const generateVisibleDates = () => {
    const today = new Date();
    const dates = [];
    
    // Add today and next 6 days (total 7 days)
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    setVisibleDates(dates);
    
    // Store the 7th day for comparison
    const seventhDay = new Date();
    seventhDay.setDate(today.getDate() + 6);
    setLastSeventhDay(seventhDay.toISOString().split("T")[0]);
  };

  // New function to check if there's a new 7th day and reset it
  const checkAndResetSeventhDay = async () => {
    // Get the current 7th day
    const today = new Date();
    const seventhDay = new Date();
    seventhDay.setDate(today.getDate() + 6);
    const seventhDayFormatted = seventhDay.toISOString().split("T")[0];
    
    // Get the day of week for the 7th day
    const dayOfWeek = seventhDay.toLocaleDateString('en-US', { weekday: 'long' });
    
    // If we have a stored last seventh day and it's different from current seventh day
    // or if this is the first time we're setting up (no last seventh day stored)
    if (lastSeventhDay !== seventhDayFormatted) {
      console.log(`New 7th day detected: ${dayOfWeek} (${seventhDayFormatted})`);
      
      // Create a new availability object
      const newAvailability = { ...availability };
      
      // Reset the availability for the 7th day to include all time slots
      const allTimeSlots = generateTimeSlots().map(time => `${time} - ${getEndTime(time)}`);
      newAvailability[dayOfWeek] = allTimeSlots;
      
      // Create a new unavailable dates array, removing the 7th day if it exists
      const newUnavailableDates = unavailableDates.filter(date => date !== seventhDayFormatted);
      
      try {
        // Only update if we have a booking ID
        if (bookingId) {
          // Format data for the API
          const availabilityData = {
            availability: newAvailability,
            unavailableDates: newUnavailableDates
          };
          
          // Update existing document
          await fetch(`http://localhost:3000/editBookingAvailability/${bookingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(availabilityData),
          });
          
          // Update state
          setAvailability(newAvailability);
          setUnavailableDates(newUnavailableDates);
          
          console.log(`Reset availability for ${dayOfWeek} (${seventhDayFormatted})`);
          console.log("New availability:", newAvailability);
        }
        
        // Update the last seventh day
        setLastSeventhDay(seventhDayFormatted);
      } catch (error) {
        console.error("Error resetting 7th day availability:", error);
      }
    }
  };

  const toggleUnavailableDate = async (date) => {
    if (!date) return; // Prevent toggling if no date is selected
    
    // Create a date object from the selected date
    const dateObj = new Date(date);
    // Get the day of week
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Create a new availability object to avoid direct state mutation
    const newAvailability = { ...availability };
    // Create a new unavailable dates array
    const newUnavailableDates = [...unavailableDates];
    
    if (unavailableDates.includes(date)) {
      // If currently unavailable, make it available
      newUnavailableDates.splice(newUnavailableDates.indexOf(date), 1);
      
      // Reset the availability for that day to include all time slots (making them all available)
      const allTimeSlots = generateTimeSlots().map(time => `${time} - ${getEndTime(time)}`);
      newAvailability[dayOfWeek] = allTimeSlots;
    } else {
      // If currently available, make it unavailable
      newUnavailableDates.push(date);
      
      // Remove all time slots for that day (making them all booked)
      newAvailability[dayOfWeek] = [];
    }
    
    try {
      // Format data for the API
      const availabilityData = {
        availability: newAvailability,
        unavailableDates: newUnavailableDates
      };
      
      let response;
      if (bookingId) {
        // Update existing document
        response = await fetch(`http://localhost:3000/editBookingAvailability/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(availabilityData),
        });
      } else {
        // Create new document
        response = await fetch('http://localhost:3000/addBookingAvailability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(availabilityData),
        });
        
        const result = await response.json();
        
        // Save the new booking ID
        if (result.data && result.data._id) {
          setBookingId(result.data._id);
        }
      }
      
      // Update the state with the new availability and unavailable dates
      setAvailability(newAvailability);
      setUnavailableDates(newUnavailableDates);
      
      console.log(`Updated availability for ${dayOfWeek}`);
      console.log("New availability:", newAvailability);
      console.log("Unavailable dates:", newUnavailableDates);
      
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const toggleBookingStatus = async (date, time) => {
    if (unavailableDates.includes(date)) return; // Prevent toggling for unavailable dates

    // Create a date object from the ISO date string
    const dateObj = new Date(date);
    // Get the correct day of week
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Create a formatted time slot string (e.g., "9:00 AM - 10:00 AM")
    const formattedTimeSlot = `${time} - ${getEndTime(time)}`;
    
    // Check if this time slot is NOT in the availability (meaning it's booked)
    const isBooked = !availability[dayOfWeek]?.includes(formattedTimeSlot);
    
    // Create a new availability object to avoid direct state mutation
    const newAvailability = { ...availability };
    
    // Ensure the day array exists
    if (!newAvailability[dayOfWeek]) {
      newAvailability[dayOfWeek] = [];
    }
    
    // Toggle the time slot status
    if (isBooked) {
      // If it's currently booked, make it available by adding to availability
      newAvailability[dayOfWeek] = [...newAvailability[dayOfWeek], formattedTimeSlot];
    } else {
      // If it's currently available, make it booked by removing from availability
      newAvailability[dayOfWeek] = newAvailability[dayOfWeek].filter(slot => slot !== formattedTimeSlot);
    }
    
    try {
      let response;
      
      // Format data for the API
      const availabilityData = {
        availability: newAvailability,
        unavailableDates: unavailableDates
      };
      
      if (bookingId) {
        // Update existing document
        response = await fetch(`http://localhost:3000/editBookingAvailability/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(availabilityData),
        });
      } else {
        // Create new document
        response = await fetch('http://localhost:3000/addBookingAvailability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(availabilityData),
        });
        
        const result = await response.json();
        
        // Save the new booking ID
        if (result.data && result.data._id) {
          setBookingId(result.data._id);
        }
      }
      
      // Update the state with the new availability
      setAvailability(newAvailability);
      
      console.log(`Updated ${dayOfWeek} with time slot: ${formattedTimeSlot}`);
      console.log("New availability:", newAvailability);
      
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  // Helper function to calculate end time (assuming 1 hour slots)
  const getEndTime = (startTime) => {
    const [hour, minutePart] = startTime.split(':');
    const [minute, period] = minutePart.split(' ');
    
    let hourNum = parseInt(hour);
    if (period === 'PM' && hourNum < 12) hourNum += 12;
    if (period === 'AM' && hourNum === 12) hourNum = 0;
    
    hourNum += 1; // Add one hour
    
    if (hourNum === 24) {
      hourNum = 12;
      return `${hourNum}:${minute} AM`;
    } else if (hourNum > 12) {
      hourNum -= 12;
      return `${hourNum}:${minute} PM`;
    } else if (hourNum === 12) {
      return `${hourNum}:${minute} PM`;
    } else {
      return `${hourNum}:${minute} ${period}`;
    }
  };

  const generateTimeSlots = () => {
    // Only specific time slots are included
    return ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  };

  const formatDate = (date) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const getMonthName = (date) => {
    const options = { month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const groupDatesByMonth = () => {
    const groupedDates = {};
    
    visibleDates.forEach(date => {
      const monthYear = getMonthName(date);
      if (!groupedDates[monthYear]) {
        groupedDates[monthYear] = [];
      }
      groupedDates[monthYear].push(date);
    });
    
    return groupedDates;
  };

  // Check if a time slot is available (not booked)
  const isTimeSlotAvailable = (date, time) => {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedTimeSlot = `${time} - ${getEndTime(time)}`;
    
    return availability[dayOfWeek]?.includes(formattedTimeSlot);
  };

  const timeSlots = generateTimeSlots();
  const groupedDates = groupDatesByMonth();

  // Get button text and class based on booking status
  const getButtonText = (isAvailable) => {
    return isAvailable ? "Available" : "Booked";
  };

  const getButtonClass = (isAvailable) => {
    return isAvailable ? "time-button-available" : "time-button-booked";
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="appointment-container">
      <h1 className="appointment-title">Appointment Calendar</h1>

      <div className="admin-control">
        <h3 className="control-title">Admin Controls</h3>
        <div className="control-input">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
          <button
            className="toggle-button"
            onClick={() => toggleUnavailableDate(selectedDate)}
          >
            {unavailableDates.includes(selectedDate)
              ? "Mark as Available"
              : "Mark as Unavailable"}
          </button>
        </div>
      </div>

      {Object.entries(groupedDates).map(([monthYear, dates]) => (
        <div key={monthYear} className="month-section">
          <h2 className="month-title">{monthYear}</h2>
          <div className="appointment-grid">
            {dates.map((date) => {
              const formattedDate = date.toISOString().split("T")[0];
              const isUnavailable = unavailableDates.includes(formattedDate);
              const isSeventhDay = formattedDate === lastSeventhDay;

              return (
                <div
                  key={formattedDate}
                  className={`appointment-card ${
                    isUnavailable ? "unavailable-card" : ""
                  } ${isSeventhDay ? "seventh-day-card" : ""}`}
                >
                  <h3 className="appointment-date">{formatDate(date)}</h3>
                  <h4 className="appointment-day-of-week">{date.toLocaleDateString('en-US', { weekday: 'long' })}</h4>
                  {isUnavailable ? (
                    <p className="unavailable-message">Not Available</p>
                  ) : (
                    <ul className="appointment-time-list">
                      {timeSlots.map((time) => {
                        const isAvailable = isTimeSlotAvailable(formattedDate, time);
                        
                        return (
                          <li key={time} className="appointment-time-item">
                            <span className="time-text">{time}</span>
                            <button
                              className={`time-button ${getButtonClass(isAvailable)}`}
                              onClick={() => toggleBookingStatus(formattedDate, time)}
                            >
                              {getButtonText(isAvailable)}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpdateAppointment;