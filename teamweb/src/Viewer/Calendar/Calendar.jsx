import React from "react";

const Calendar = () => {
  // Example months and years arrays
  const months = [
    "August", "September", "October", "November", "December", "January",
    "February", "March", "April", "May", "June", "July"
  ];
  const years = ["2024", "2025"];
  const events = [
    { year: "2024", date: "August 5", eventName: "Event Name" },
    { year: "2025", date: "January 13", eventName: "Event Name" },
  ];

  return (
    <div className="calendar-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-links">
          <button>HOME</button>
          <button>ANNOUNCEMENTS</button>
          <button className="active">SCHOOL CALENDAR</button>
          <button>PRE-REGISTRATION</button>
          <button>SCHOOL INFORMATION</button>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </nav>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {months.map((month, index) => (
          <div key={index} className="calendar-month">
            <h3>{month} {index < 5 ? years[0] : years[1]}</h3>
            <table>
              <thead>
                <tr>
                  {['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'].map(day => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Render a placeholder calendar */}
                {[...Array(5)].map((_, weekIdx) => (
                  <tr key={weekIdx}>
                    {[...Array(7)].map((_, dayIdx) => (
                      <td key={dayIdx} className="calendar-cell"></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Events Display */}
      <div className="events-section">
        {years.map((year, idx) => (
          <div key={idx} className="events-year">
            <h3>{year}</h3>
            <ul>
              {events
                .filter(event => event.year === year)
                .map((event, index) => (
                  <li key={index} className="event-item">
                    <span>{event.date}</span> <span>{event.eventName}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Calendar;
