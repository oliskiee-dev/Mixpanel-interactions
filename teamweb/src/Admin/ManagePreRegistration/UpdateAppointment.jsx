import React, { useState, useEffect } from "react";
import "./UpdateAppointment.css";

const UpdateAppointment = () => {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [appointments, setAppointments] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleDates, setVisibleDates] = useState([]);

  useEffect(() => {
    // Generate only dates from current month and next month
    generateVisibleDates();
  }, []);

  const generateVisibleDates = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get the last day of next month
    const lastDayNextMonth = new Date(currentYear, currentMonth + 2, 0);
    
    const dates = [];
    let currentDate = new Date(currentYear, currentMonth, 1); // Start from 1st of current month
    
    while (currentDate <= lastDayNextMonth) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setVisibleDates(dates);
  };

  const toggleUnavailableDate = (date) => {
    if (unavailableDates.includes(date)) {
      setUnavailableDates((prev) => prev.filter((d) => d !== date));
    } else {
      setUnavailableDates((prev) => [...prev, date]);
    }
  };

  const toggleAppointment = (date, time) => {
    if (unavailableDates.includes(date)) return; // Prevent toggling for unavailable dates

    setAppointments((prev) => {
      const updated = { ...prev };
      if (!updated[date]) {
        updated[date] = {};
      }
      updated[date] = {
        ...updated[date],
        [time]: !updated[date][time], // Toggle only the specific time slot
      };
      return updated;
    });
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

  const timeSlots = generateTimeSlots();
  const groupedDates = groupDatesByMonth();

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

              return (
                <div
                  key={formattedDate}
                  className={`appointment-card ${
                    isUnavailable ? "unavailable-card" : ""
                  }`}
                >
                  <h3 className="appointment-date">{formatDate(date)}</h3>
                  {isUnavailable ? (
                    <p className="unavailable-message">Not Available</p>
                  ) : (
                    <ul className="appointment-time-list">
                      {timeSlots.map((time) => (
                        <li key={time} className="appointment-time-item">
                          <span className="time-text">{time}</span>
                          <button
                            className={`time-button ${
                              appointments[formattedDate]?.[time]
                                ? "time-button-booked"
                                : "time-button-available"
                            }`}
                            onClick={() => toggleAppointment(formattedDate, time)}
                          >
                            {appointments[formattedDate]?.[time]
                              ? "Booked"
                              : "Available"}
                          </button>
                        </li>
                      ))}
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