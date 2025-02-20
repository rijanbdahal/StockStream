import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login.jsx'; // Assuming you have LoginPage component
import HomePage from './components/Home.jsx';
import Registration from "./components/Registration.jsx";
import Dashboard from "./components/Dashboard.jsx"; // Replace with actual page component
import Error from "./components/404.jsx";
import UserInfo from "./components/supervisor/UserInfo.jsx";
import Profile from "./components/userInfo/Profile.jsx";
import InquiryLocation from "./components/supervisor/InquiryLocation.jsx";
import DockingEntry from "./components/supervisor/DockingEntry.jsx";
import QueryDockingEntry from "./components/supervisor/QueryDockingEntry.jsx";
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="*" element={<Error />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/inquirelocation" element={<InquiryLocation/>}/>
                <Route path="/dockingentry" element={<DockingEntry/>}/>
                <Route path="/querydockingentry" element={<QueryDockingEntry/>}/>

                <Route path="/" element={<HomePage />} />



            </Routes>
        </Router>
    );
};

export default App;
