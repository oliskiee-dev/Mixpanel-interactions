import React, { useState, useEffect } from "react";
import "./calendar.css";
import Header from "../Component/Header.jsx";
import Footer from "../Component/Footer.jsx";

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

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
    { date: "2025-02-27", eventName: "Tine's Friend Day" }, 
  ];

  const holidays = [
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-04-09", name: "Araw ng Kagitingan" },
    { date: "2025-06-12", name: "Independence Day" },
    { date: "2025-12-25", name: "Christmas Day" },
    { date: "2025-12-30", name: "Rizal Day" },
    { date: "2025-02-27", name: "Tine's Birthday" },
  ];

  const getHolidayName = (dateStr) => holidays.find(h => h.date === dateStr)?.name || "";
  
  const handleMouseEnter = (event, text) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      text,
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY - 30,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === currentYear && eventDate >= new Date();
  });

  const filteredHolidays = holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getFullYear() === currentYear && holidayDate >= new Date();
  });


  const currentEvent = events.find(event => event.date === today);
  const currentHoliday = holidays.find(holiday => holiday.date === today);

  return (
    <>
      <Header />
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => setCurrentYear(currentYear - 1)}>❮ Prev Year</button>
          <h2>{currentYear}</h2>
          <button onClick={() => setCurrentYear(currentYear + 1)}>Next Year ❯</button>
        </div>

        {currentEvent && (
          <div className="current-event">Current Event: {currentEvent.eventName}</div>
        )}
        {currentHoliday && (
          <div className="current-holiday">Current Holiday: {currentHoliday.name}</div>
        )}

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
                          const event = filteredEvents.find(event => event.date === dateStr);
                          const holidayName = getHolidayName(dateStr);
                          const isToday = dateStr === today;
                          const isHoliday = Boolean(holidayName);
                          const className = isToday ? "today" : event ? "event-day" : isHoliday ? "holiday-day" : "";
                          // Needs fix on tooltipText to show two events
                          const tooltipText = (event?.eventName && holidayName) 
                          ? `${event.eventName} & ${holidayName}` 
                          : event?.eventName || holidayName || '';






                          return (
                        <td
                          key={day}
                          className={className}
                          onMouseEnter={(e) => tooltipText && handleMouseEnter(e, tooltipText)}
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

        {filteredEvents.length > 0 && (
          <div className="events-section">
            <h3>Upcoming Events</h3>
            <ul>
              {filteredEvents.map((event, index) => {
                const dateObj = new Date(event.date);
                const monthName = months[dateObj.getMonth()];
                const day = dateObj.getDate();
                return (
                  <li key={index} className="event-item">
                    <span className="event-date">{monthName} {day}</span>
                    <span className="event-name">{event.eventName}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {filteredHolidays.length > 0 && (
          <div className="events-section">
            <h3>Upcoming Holidays</h3>
            <ul>
              {filteredHolidays.map((holiday, index) => {
                const dateObj = new Date(holiday.date);
                const monthName = months[dateObj.getMonth()];
                const day = dateObj.getDate();
                return (
                  <li key={index} className="holiday-item">
                    <span className="holiday-date">{monthName} {day}</span>
                    <span className="holiday-name">{holiday.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {tooltip.visible && (
        <div
          className="tooltip visible"
          style={{
            position: "absolute",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          {tooltip.text}
        </div>
      )}

      </div>
      <Footer />
    </>
  );
};

export default Calendar;
