import { useEffect, useState } from 'react';
import './index.css'
import {BrowserRouter,Routes, Route, Navigate } from 'react-router'
import Viewer from './Viewer.jsx'
import Login from './Admin/Login.jsx'
import ForgotPassword from './Admin/ForgotPassword.jsx';
import ResetPassword from './Admin/ResetPassword.jsx'

import Announcement from './Viewer/Announcement/Announcement.jsx';
import Calendar from './Viewer/Calendar/Calendar.jsx';


import PreRegistration from './Viewer/PreRegistration/Pre-registration.jsx';
import Appointment from './Viewer/PreRegistration/Appointment.jsx';
import ConfirmRegistration from './Viewer/PreRegistration/ConfirmRegistration.jsx';
import Success from './Viewer/PreRegistration/Success.jsx';

import SchoolInfo from './Viewer/SchoolInfo/SchoolInfo.jsx';

import Homepage from './Admin/Homepage.jsx';

import ManageAnnouncement from './Admin/ManageAnnouncement/ManageAnnouncement.jsx';
import CreateAnnouncement from './Admin/ManageAnnouncement/CreateAnnouncement.jsx';
import DeleteAnnouncement from './Admin/ManageAnnouncement/DeleteAnnouncement.jsx';
import ModifyAnnouncement from './Admin/ManageAnnouncement/ModifyAnnouncement.jsx';


import ManageCalendar from './Admin/ManageCalendar/ManageCalendar.jsx';
import ManagePreRegistration from './Admin/ManagePreRegistration/ManagePreRegistration.jsx';
import UpdateAppointment from './Admin/ManagePreRegistration/UpdateAppointment.jsx';
import ManageAccount from './Admin/ManageAccount/ManageAccount.jsx';

import ViewReport from './Admin/ViewReport/ViewReport.jsx'

function App(){
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token); // Set to true if token exists
  }, []);

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
};

  return(
    <BrowserRouter>
      <Routes>
        {/* Viewers */}
        <Route path="/" element={<Viewer/>}></Route>
        <Route path="Login" element={<Login/>}></Route>
        <Route path="forgot-password" element={<ForgotPassword/>}></Route>
        <Route path="reset-password" element={<ResetPassword/>}></Route>
        <Route path="announcement" element={<Announcement/>}></Route>
        <Route path="calendar" element={<Calendar/>}></Route>


        <Route path="preregistration" element={<PreRegistration/>}></Route>
        <Route path="appointment" element={<Appointment/>}></Route>
        <Route path="confirmRegistration" element={<ConfirmRegistration/>}></Route>
        <Route path="success" element={<Success/>}></Route>



        <Route path="schoolinfo" element={<SchoolInfo/>}></Route>

        {/* Admin Route for Designing */}
        {/* <Route path="/admin-homepage" element={<Homepage />} />


        <Route path="/manage-announcement" element={<ManageAnnouncement />} />
        <Route path="/create-announcement" element={<CreateAnnouncement/>} />
        <Route path="/delete-announcement" element={<DeleteAnnouncement />} />
        <Route path="/modify-announcement" element={<ModifyAnnouncement />} />

        <Route path="/manage-calendar" element={<ManageCalendar />} />

        <Route path="/manage-preregistration" element={<ManagePreRegistration />} />
        <Route path="/update-appointment" element={<UpdateAppointment />} />

        <Route path="/manage-account" element={<ManageAccount />} /> 
        <Route path="/view-report" element={<ViewReport />} /> */}
        

        {/* Admins */}
        {/* Temporary Disable Restrictions */}
        <Route path="/admin-homepage" element={<PrivateRoute><Homepage /></PrivateRoute>} />

        <Route path="/manage-announcement" element={<PrivateRoute><ManageAnnouncement /></PrivateRoute>} />
        <Route path="/create-announcement" element={<PrivateRoute><CreateAnnouncement/></PrivateRoute>} />
        <Route path="/delete-announcement" element={<PrivateRoute><DeleteAnnouncement /></PrivateRoute>} />
        <Route path="/modify-announcement" element={<PrivateRoute><ModifyAnnouncement /></PrivateRoute>} />

        <Route path="/manage-calendar" element={<PrivateRoute><ManageCalendar /></PrivateRoute>} />

        <Route path="/manage-preregistration" element={<PrivateRoute><ManagePreRegistration /></PrivateRoute>} />
        <Route path="/update-appointment" element={<PrivateRoute><UpdateAppointment /></PrivateRoute>} />

        <Route path="/manage-account" element={<PrivateRoute><ManageAccount /></PrivateRoute>} />
        <Route path="/view-report" element={<PrivateRoute><ViewReport /></PrivateRoute>} />
      
      </Routes>
    </BrowserRouter>
  )
}

export default App;