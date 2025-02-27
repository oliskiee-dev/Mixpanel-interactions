import React, { useState } from "react";
import "./calendar.css";
import Header from "../Component/Header.jsx";
import Footer from "../Component/Footer.jsx";

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const events = [
    { date: "2024-08-05", eventName: "Summer Festival" },
    { date: "2025-01-13", eventName: "New Year's Celebration" },
    { date: "2023-12-25", eventName: "Christmas Party" },
    { date: "2026-05-20", eventName: "Science Fair" },
  ];

  const holidays = [
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-04-09", name: "Araw ng Kagitingan" },
    { date: "2025-06-12", name: "Independence Day" },
    { date: "2025-12-25", name: "Christmas Day" },
    { date: "2025-12-30", name: "Rizal Day" },
  ];

  const getHolidayName = (dateStr) => holidays.find(h => h.date === dateStr)?.name || "";
  
  const handleMouseEnter = (event, text) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      text,
      x: rect.left + window.scrollX + rect.width / 2, // Center horizontally
      y: rect.top + window.scrollY - 30, // Above the cell
    });
  };
  

  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  const today = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) > today);
  const previousEvents = events.filter(event => new Date(event.date) < today);

  return (
    <>
      <Header />
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => setCurrentYear(currentYear - 1)}>❮ Prev Year</button>
          <h2>{currentYear}</h2>
          <button onClick={() => setCurrentYear(currentYear + 1)}>Next Year ❯</button>
        </div>

        <div className="full-year-calendar">
          {months.map((month, index) => {
            const daysInMonth = getDaysInMonth(currentYear, index);
            const firstDay = getFirstDayOfMonth(currentYear, index);
            return (
              <div key={index} className="calendar-month">
                <h3>{month} {currentYear}</h3>
                <table>
                  <thead>
                    <tr>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <th key={day}>{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 6 }).map((_, week) => (
                      <tr key={week}>
                        {Array.from({ length: 7 }).map((_, day) => {
                          const dateNumber = week * 7 + day - firstDay + 1;
                          const isValidDate = dateNumber > 0 && dateNumber <= daysInMonth;
                          const dateStr = isValidDate ? formatDate(currentYear, index, dateNumber) : "";
                          const event = events.find(event => event.date === dateStr);
                          const holidayName = getHolidayName(dateStr);
                          const isHoliday = Boolean(holidayName);
                          const className = event ? "event-day" : isHoliday ? "holiday-day" : "";
                          const tooltipText = event ? event.eventName : holidayName;

                          return (
                            <td
                              key={day}
                              className={className}
                              onMouseEnter={(e) => (tooltipText ? handleMouseEnter(e, tooltipText) : undefined)}
                              onMouseLeave={handleMouseLeave}
                            >
                              {isValidDate ? dateNumber : ""}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        <div className="events-section">
          <h3>Upcoming Events</h3>
          {upcomingEvents.length > 0 ? (
            <ul>
              {upcomingEvents.map((event, index) => (
                <li key={index} className="event-item">
                  <span className="event-date">{event.date}</span>
                  <span className="event-name">{event.eventName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming events.</p>
          )}
        </div>

        <div className="events-section">
          <h3>Previous Events</h3>
          {previousEvents.length > 0 ? (
            <ul>
              {previousEvents.map((event, index) => (
                <li key={index} className="event-item past-event">
                  <span className="event-date">{event.date}</span>
                  <span className="event-name">{event.eventName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No past events.</p>
          )}
        </div>
      </div>
      <Footer />

      {tooltip.visible && (
        <div className="tooltip" style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}>
          {tooltip.text}
        </div>
      )}
    </>
  );
};

export default Calendar;
