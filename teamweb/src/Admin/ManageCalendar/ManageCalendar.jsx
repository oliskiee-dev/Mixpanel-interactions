import React, { useState, useEffect } from 'react';
import './ManageCalendar.css';
import AdminHeader from '../Component/AdminHeader.jsx';

// Initial data setup
const initialHolidays = [
  { date: '2025-05-01', name: 'International Workers\' Day' },
  { date: '2025-05-30', name: 'Memorial Day' },
  { date: '2025-06-12', name: 'National Day' },
  { date: '2025-07-04', name: 'Independence Day' },
  { date: '2025-09-01', name: 'Labor Day' },
  { date: '2025-11-27', name: 'Thanksgiving' },
  { date: '2025-12-25', name: 'Christmas Day' }
];

const initialEvents = [
  { date: '2025-02-27', name: 'Tine\'s Birthday' },
  { date: '2025-08-10', name: 'Music Fest' },
  { date: '2025-09-30', name: 'Charity Run' },
  { date: '2025-11-22', name: 'Tech Expo' }
];

// Main Calendar component
const ManageCalendar = () => {
  const [currentYear, setCurrentYear] = useState(2025);
  const [events, setEvents] = useState(initialEvents);
  const [holidays, setHolidays] = useState(initialHolidays);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [action, setAction] = useState('add'); // 'add' or 'edit'
  const [notification, setNotification] = useState(null);

  // Navigation functions
  const prevYear = () => setCurrentYear(currentYear - 1);
  const nextYear = () => setCurrentYear(currentYear + 1);

  // Modal handling
  const openAddModal = (date) => {
    setNewEventDate(date);
    setNewEventName('');
    setAction('add');
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
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

  // Event management
  const addEvent = () => {
    if (newEventName.trim() === '') return;
    
    const newEvent = {
      date: newEventDate,
      name: newEventName.trim()
    };
    
    setEvents([...events, newEvent]);
    closeModal();
    showNotification('Event added successfully!');
  };

  const updateEvent = () => {
    if (newEventName.trim() === '' || !currentEvent) return;
    
    const updatedEvents = events.map(event => 
      event === currentEvent ? { ...event, date: newEventDate, name: newEventName } : event
    );
    
    setEvents(updatedEvents);
    closeModal();
    showNotification('Event updated successfully!');
  };

  const deleteEvent = (eventToDelete) => {
    const updatedEvents = events.filter(event => event !== eventToDelete);
    setEvents(updatedEvents);
    showNotification('Event deleted successfully!');
  };

  // Notification handling
  const showNotification = (message, isError = false) => {
    setNotification({
      message,
      isError
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Calendar generation functions
  const getMonthData = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const monthData = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      monthData.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      monthData.push(day);
    }
    
    return monthData;
  };

  const isDateHighlighted = (year, month, day) => {
    if (!day) return false;
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => event.date === dateStr) || holidays.some(holiday => holiday.date === dateStr);
  };

  const getHighlightType = (year, month, day) => {
    if (!day) return null;
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (events.some(event => event.date === dateStr)) {
      return 'event';
    }
    
    if (holidays.some(holiday => holiday.date === dateStr)) {
      return 'holiday';
    }
    
    return null;
  };

  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getCurrentEvent = (year, month, day) => {
    if (!day) return null;
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(event => event.date === dateStr);
  };

  const getCurrentHoliday = (year, month, day) => {
    if (!day) return null;
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find(holiday => holiday.date === dateStr);
  };

  const isToday = (year, month, day) => {
    if (!day) return false;
    
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  return (
    <div>
    <AdminHeader/>
    <div className = "admin-calendar-container">
      <div className = "admin-calendar-header">
        {/* Header and navigation */}
        <div className="calendar-header">
          <button 
            onClick={prevYear}
            className="nav-button"
          >
            ❮ Prev Year
          </button>
          <h1 className="year-display">{currentYear}</h1>
          <button 
            onClick={nextYear}
            className="nav-button"
          >
            Next Year ❯
          </button>
        </div>

        {/* Current event/holiday display
        <div className="current-display">
          <h2>Current Event: {events.length > 0 ? events[0].name : 'None'}</h2>
        </div>
        <div className="current-display holiday">
          <h2>Current Holiday: {
            holidays.length > 0 && new Date().getMonth() === new Date(holidays[0].date).getMonth() 
              ? holidays[0].name 
              : 'No Class Day'
          }</h2>
        </div> */}

        {/* Calendar grid */}
        <div className="months-grid">
          {monthNames.map((monthName, monthIndex) => (
            <div key={monthName} className="month-card">
                <h3>{monthName} {currentYear}</h3>
              <div className="days-grid">
                {dayNames.map(day => (
                  <div key={day} className="day-name">
                    {day}
                  </div>
                ))}
                
                {getMonthData(currentYear, monthIndex).map((day, index) => {
                  const highlightType = getHighlightType(currentYear, monthIndex, day);
                  const today = isToday(currentYear, monthIndex, day);
                  
                  return (
                    <div 
                      key={index}
                      className={`day-cell 
                        ${!day ? 'empty-cell' : ''} 
                        ${highlightType === 'event' ? 'event-cell' : ''} 
                        ${highlightType === 'holiday' ? 'holiday-cell' : ''}
                        ${today ? 'today' : ''}
                      `}
                      onClick={() => {
                        if (!day) return;
                        
                        const currentEvent = getCurrentEvent(currentYear, monthIndex, day);
                        const currentHoliday = getCurrentHoliday(currentYear, monthIndex, day);
                        
                        if (currentEvent) {
                          openEditModal(currentEvent);
                        } else if (!currentHoliday) {
                          const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          openAddModal(dateStr);
                        }
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>


        {/* Upcoming events section */}
        <div className="events-list-section">
            <div>
          <h2 className="section-title">Upcoming Events</h2>
          <div className="list-card">
            {events.length === 0 ? (
              <div className="list-item">
                <p>No events scheduled</p>
              </div>
            ) : (
              events.map((event, index) => (
                <div key={index} className="list-item">
                  <div className="flex items-center">
                    <div className="item-indicator event-indicator"></div>
                    <div className="item-details">
                      <p className="item-date">{event.date.split('-')[2]} {monthNames[parseInt(event.date.split('-')[1]) - 1]}</p>
                      <p className="item-name">{event.name}</p>
                    </div>
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
                </div>
              ))
            )}
          </div>
        </div>
    </div>

        {/* Upcoming holidays section */}
        <div className="holiday-list-section">
          <h2 className="section-title">Upcoming Holidays</h2>
          <div className="list-card">
            {holidays.map((holiday, index) => (
              <div key={index} className="list-item">
                <div className="flex items-center">
                  <div className="item-indicator holiday-indicator"></div>
                  <div className="item-details">
                    <p className="item-date">{holiday.date.split('-')[2]} {monthNames[parseInt(holiday.date.split('-')[1]) - 1]}</p>
                    <p className="item-name">{holiday.name}</p>
                  </div>
                </div>
                <div className="fixed-label">Fixed</div>
              </div>
            ))}
          </div>
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

        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.isError ? 'error' : ''}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ManageCalendar;