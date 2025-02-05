import { useEffect, useState } from 'react';
import './index.css'
import {BrowserRouter,Routes, Route} from 'react-router'
import Viewer from './Viewer.jsx'
import Login from './Admin/Login.jsx'
import ForgotPassword from './Admin/ForgotPassword.jsx';

import Announcement from './Viewer/Announcement/Announcement.jsx';
import Calendar from './Viewer/Calendar/Calendar.jsx';
import PreRegistration from './Viewer/PreRegistration/Pre-registration.jsx';
import SchoolInfo from './Viewer/SchoolInfo/SchoolInfo.jsx';

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Viewer/>}></Route>
        <Route path="Login" element={<Login/>}></Route>
        <Route path="reset-password" element={<ForgotPassword/>}></Route>
        <Route path="announcements" element={<Announcement/>}></Route>
        <Route path="calendar" element={<Calendar/>}></Route>
        <Route path="preregistration" element={<PreRegistration/>}></Route>
        <Route path="schoolinfo" element={<SchoolInfo/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;



// function App() {
//   const [items,setItems] = useState([])
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch('http://localhost:3000');
//         const data = await res.json();
//         //console.log(data);//Show in Console [Debugging Purposes]
//         setItems(data.items)
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <>
//     {items.map(i =>(
//       <p>{i.name},{i.description}</p>
//     ))}
//     </>
//   );
// }

// export default App;