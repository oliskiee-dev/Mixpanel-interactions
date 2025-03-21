// import React, { useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

// const ManageAppointment = () => {
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [timeSlots, setTimeSlots] = useState([
//         { time: '9:00 AM', isAvailable: true },
//         { time: '10:00 AM', isAvailable: true },
//         { time: '11:00 AM', isAvailable: false },
//         { time: '1:00 PM', isAvailable: true },
//         { time: '2:00 PM', isAvailable: false },
//     ]);
//     const [appointments, setAppointments] = useState([]);

//     const handleDateChange = (date) => {
//         setSelectedDate(date);
//         // Fetch time slots based on the date (optional for dynamic systems)
//     };

//     const bookSlot = (slot) => {
//         if (slot.isAvailable) {
//             setAppointments([
//                 ...appointments,
//                 { date: selectedDate.toDateString(), time: slot.time },
//             ]);
//             setTimeSlots(
//                 timeSlots.map((s) =>
//                     s.time === slot.time ? { ...s, isAvailable: false } : s
//                 )
//             );
//         } else {
//             alert('This time slot is already booked.');
//         }
//     };

//     return (
//         <div className="manage-appointment">
//             <h2>Manage Appointments</h2>
//             <div className="scheduler">
//                 <Calendar
//                     onChange={handleDateChange}
//                     value={selectedDate}
//                 />
//                 <div className="time-slots">
//                     <h3>Available Slots for {selectedDate.toDateString()}</h3>
//                     <ul>
//                         {timeSlots.map((slot, index) => (
//                             <li key={index} className={slot.isAvailable ? 'available' : 'booked'}>
//                                 <button
//                                     disabled={!slot.isAvailable}
//                                     onClick={() => bookSlot(slot)}
//                                 >
//                                     {slot.time} {slot.isAvailable ? '' : '(Booked)'}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//             <div className="appointments">
//                 <h3>Booked Appointments</h3>
//                 <ul>
//                     {appointments.map((appointment, index) => (
//                         <li key={index}>
//                             {appointment.date} - {appointment.time}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default ManageAppointment;
