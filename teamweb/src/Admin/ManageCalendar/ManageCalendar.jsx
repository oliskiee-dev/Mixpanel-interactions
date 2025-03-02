import React, { useState, useEffect } from 'react';
import './ManageCalendar.css';
import AdminHeader from '../Component/AdminHeader.jsx';

// Main Calendar component
const ManageCalendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [action, setAction] = useState('add'); // 'add' or 'edit'
  const [notification, setNotification] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  // Add today's date for reference
  const [today, setToday] = useState('');

  useEffect(() => {
    // Set today's date in ISO format (YYYY-MM-DD)
    setToday(new Date().toISOString().split('T')[0]);
    
    const fetchCalendarData = async () => {
      try {
        const response = await fetch('http://localhost:3000/calendar'); // Adjust API URL if needed
        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        
        // Extract events and holidays from the calendar data
        const eventsData = data.calendar ? data.calendar.filter(item => item.type === "event") : [];
        const holidaysData = data.calendar ? data.calendar.filter(item => item.type === "holiday") : [];
        
        // Format data to match the existing structure
        const formattedEvents = eventsData.map(item => ({
          id: item._id,
          date: item.date.slice(0, 10),
          name: item.title
        }));
        
        const formattedHolidays = holidaysData.map(item => ({
          id: item._id,
          date: item.date.slice(0, 10),
          name: item.title
        }));
        
        setEvents(formattedEvents);
        setHolidays(formattedHolidays);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setNotification({ message: 'Failed to load calendar data.', isError: true });
      }
    };

    fetchCalendarData();
  }, []);
  
  // Navigation functions
  const prevYear = () => setCurrentYear(currentYear - 1);
  const nextYear = () => setCurrentYear(currentYear + 1);

  // Modal handling
  const openAddModal = (date) => {
    setCurrentEvent(null); // Ensure currentEvent is null for add mode
    setNewEventDate(date);
    setNewEventName('');
    setAction('add');
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    if (!event || !event.id) {
      // If no valid event data, fall back to add mode
      openAddModal(event?.date || new Date().toISOString().split('T')[0]);
      return;
    }
    
    setCurrentEvent(event);
    setNewEventDate(event.date);
    setNewEventName(event.name);
    setAction('edit');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewEventDate('');
    setNewEventName('');
    setCurrentEvent(null);
  };

  // Tooltip handling
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

  // Event management
  const addEvent = async () => {
    if (newEventName.trim() === '') return;
  
    const newEvent = { date: newEventDate, title: newEventName.trim(), type: "event" };
  
    try {
      const response = await fetch('http://localhost:3000/calendar/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add event: ${errorText}`);
      }
  
      const responseData = await response.json();
      
      setEvents([...events, {
        id: responseData.id,
        date: newEventDate,
        name: newEventName.trim()
      }]);
  
      closeModal();
      showNotification('Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      showNotification('Failed to add event.', true);
    }
  };
  
  const updateEvent = async () => {
    if (newEventName.trim() === '' || !currentEvent) return;
  
    try {
      const response = await fetch(`http://localhost:3000/calendar/edit/${currentEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date: newEventDate, 
          title: newEventName,
          type: "event"
        }),
      });
  
      if (!response.ok) throw new Error('Failed to update event');
  
      const updatedEvents = events.map((event) =>
        event.id === currentEvent.id ? { ...event, date: newEventDate, name: newEventName } : event
      );
  
      setEvents(updatedEvents);
      closeModal();
      showNotification('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      showNotification('Failed to update event.', true);
    }
  };
  
  const deleteEvent = async (eventToDelete) => {
    if (!eventToDelete?.id) {
      console.error('Error: Missing event ID', eventToDelete);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/calendar/delete/${eventToDelete.id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete event: ${errorText}`);
      }
  
      // Remove the deleted event from state
      const updatedEvents = events.filter((event) => event.id !== eventToDelete.id);
      setEvents(updatedEvents);
      closeModal(); // Close modal if deleting from the edit modal
      showNotification('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      showNotification('Failed to delete event.', true);
    }
  };

  // Notification handling
  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Calendar generation functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const getEventOrHoliday = (dateStr) => {
    const event = events.find(item => item.date === dateStr);
    const holiday = holidays.find(item => item.date === dateStr);
    return { event, holiday };
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (year, month, day) => {
    if (!day) return false;
    const dateStr = formatDate(year, month, day);
    return dateStr === today;
  };

  // Month and day names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <AdminHeader/>
      <div className="calendar-container admin-calendar">
        <div className="calendar-header">
          <button onClick={prevYear}>❮ Prev Year</button>
          <h2>{currentYear}</h2>
          <button onClick={nextYear}>Next Year ❯</button>
        </div>

        {/* Current event/holiday display */}
        {currentEvent && (
          <div className="current-event">
            <h3>Current Event: {currentEvent.name}</h3>
          </div>
        )}

        {currentHoliday && (
          <div className="current-holiday">
            <h3>Current Holiday: {currentHoliday.name}</h3>
          </div>
        )}

        {/* Calendar grid */}
        <div className="full-year-calendar">
          {monthNames.map((monthName, monthIndex) => {
            const daysInMonth = getDaysInMonth(currentYear, monthIndex);
            const firstDay = getFirstDayOfMonth(currentYear, monthIndex);
            
            return (
              <div key={monthName} className="calendar-month">
                <h3>{monthName} {currentYear}</h3>
                <table>
                  <thead>
                    <tr>
                      {dayNames.map(day => (
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
                          const dateStr = isValidDate ? formatDate(currentYear, monthIndex, dateNumber) : "";
                          const { event, holiday } = getEventOrHoliday(dateStr);
                          const isTodayDate = dateStr === today;
                          
                          let className = '';
                          if (isTodayDate) className = 'today';
                          else if (event) className = 'event-day';
                          else if (holiday) className = 'holiday-day';
                          
                          const tooltipText = (event?.name && holiday?.name) 
                            ? `${event.name} & ${holiday.name}` 
                            : event?.name || holiday?.name || '';
                          
                          return (
                            <td
                              key={day}
                              className={className}
                              onClick={() => {
                                if (!isValidDate) return;
                                
                                if (event) {
                                  openEditModal(event);
                                } else if (!holiday) {
                                  openAddModal(dateStr);
                                }
                              }}
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

        {/* Upcoming events section */}
        <div className="events-section">
          <h3>Upcoming Events</h3>
          {events.length === 0 ? (
            <div className="empty-message">No events scheduled</div>
          ) : (
            <ul>
              {events
                .filter(event => {
                  const eventDate = new Date(event.date);
                  return eventDate >= new Date() && eventDate.getFullYear() === currentYear;
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event, index) => {
                  const dateObj = new Date(event.date);
                  const monthName = monthNames[dateObj.getMonth()];
                  const day = dateObj.getDate();
                  
                  return (
                    <li key={index} className="event-item">
                      <div className="event-info">
                        <span className="event-date">{monthName} {day}</span>
                        <span className="event-name">{event.name}</span>
                      </div>
                      <div className="item-actions">
                        <button 
                          onClick={() => openEditModal(event)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteEvent(event)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })
              }
            </ul>
          )}
        </div>

        {/* Upcoming holidays section */}
        <div className="events-section">
          <h3>Upcoming Holidays</h3>
          {holidays.length === 0 ? (
            <div className="empty-message">No holidays scheduled</div>
          ) : (
            <ul>
              {holidays
                .filter(holiday => {
                  const holidayDate = new Date(holiday.date);
                  return holidayDate >= new Date() && holidayDate.getFullYear() === currentYear;
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((holiday, index) => {
                  const dateObj = new Date(holiday.date);
                  const monthName = monthNames[dateObj.getMonth()];
                  const day = dateObj.getDate();
                  
                  return (
                    <li key={index} className="holiday-item">
                      <div className="holiday-info">
                        <span className="holiday-date">{monthName} {day}</span>
                        <span className="holiday-name">{holiday.name}</span>
                      </div>
                      <div className="fixed-label">Fixed</div>
                    </li>
                  );
                })
              }
            </ul>
          )}
        </div>

        {/* Modal for adding/editing events */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-header">
                {action === 'add' ? 'Add New Event' : 'Edit Event'}
              </h2>
              
              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input 
                  type="text" 
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="form-input"
                  placeholder="Enter event name"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={closeModal}
                  className="cancel-button"
                >
                  Cancel
                </button>
                
                {action === 'edit' && currentEvent && (
                  <button 
                    onClick={() => deleteEvent(currentEvent)}
                    className="delete-button"
                  >
                    Delete Event
                  </button>
                )}
                
                <button 
                  onClick={action === 'add' ? addEvent : updateEvent}
                  className="submit-button"
                >
                  {action === 'add' ? 'Add Event' : 'Update Event'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tooltip */}
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

        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.isError ? 'error' : 'success'}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCalendar;