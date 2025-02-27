import React, { useState, useEffect } from "react";
import "./calendar.css";
import Header from "../Component/Header.jsx";
import Footer from "../Component/Footer.jsx";

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const [today, setToday] = useState("");
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);

    // Fetch events and holidays from the API
    fetch("http://localhost:3000/calendar")
      .then((response) => response.json())
      .then((data) => {
        setCalendarData(data.calendar || []);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
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

  const getEventOrHoliday = (dateStr) => {
    const event = calendarData.find(item => item.date.slice(0, 10) === dateStr && item.type === "event");
    const holiday = calendarData.find(item => item.date.slice(0, 10) === dateStr && item.type === "holiday");
    return { event, holiday };
  };

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

  const currentEventOrHoliday = getEventOrHoliday(today);

  return (
    <>
      <Header />
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => setCurrentYear(currentYear - 1)}>❮ Prev Year</button>
          <h2>{currentYear}</h2>
          <button onClick={() => setCurrentYear(currentYear + 1)}>Next Year ❯</button>
        </div>

        {currentEventOrHoliday.event && (
          <div className="current-event">Current Event: {currentEventOrHoliday.event.title}</div>
        )}
        {currentEventOrHoliday.holiday && (
          <div className="current-holiday">Current Holiday: {currentEventOrHoliday.holiday.title}</div>
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
                          const { event, holiday } = getEventOrHoliday(dateStr);
                          const isToday = dateStr === today;
                          const isHoliday = Boolean(holiday);
                          const className = isToday ? "today" : event ? "event-day" : isHoliday ? "holiday-day" : "";
                          const tooltipText = (event?.title && holiday?.title) 
                            ? `${event.title} & ${holiday.title}` 
                            : event?.title || holiday?.title || '';

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

        <div className="events-section">
  {calendarData.filter(item => 
    item.type === "event" && 
    new Date(item.date).getFullYear() === currentYear && 
    new Date(item.date) >= new Date()
  ).length > 0 && (
    <>
      <h3>Upcoming Events</h3>
      <ul>
        {calendarData
          .filter(item => 
            item.type === "event" && 
            new Date(item.date).getFullYear() === currentYear && 
            new Date(item.date) >= new Date()
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date))  // Sorting by date
          .map((event, index) => {
            const dateObj = new Date(event.date);
            const monthName = months[dateObj.getMonth()];
            const day = dateObj.getDate();
            return (
              <li key={index} className="event-item">
                <span className="event-date">{monthName} {day}</span>
                <span className="event-name">{event.title}</span>
              </li>
            );
          })}
      </ul>
    </>
  )}
</div>

<div className="events-section">
  {calendarData.filter(item => 
    item.type === "holiday" && 
    new Date(item.date).getFullYear() === currentYear && 
    new Date(item.date) >= new Date()
  ).length > 0 && (
    <>
      <h3>Upcoming Holidays</h3>
      <ul>
        {calendarData
          .filter(item => 
            item.type === "holiday" && 
            new Date(item.date).getFullYear() === currentYear && 
            new Date(item.date) >= new Date()
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date))  // Sorting by date
          .map((holiday, index) => {
            const dateObj = new Date(holiday.date);
            const monthName = months[dateObj.getMonth()];
            const day = dateObj.getDate();
            return (
              <li key={index} className="holiday-item">
                <span className="holiday-date">{monthName} {day}</span>
                <span className="holiday-name">{holiday.title}</span>
              </li>
            );
          })}
      </ul>
    </>
  )}
</div>


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
