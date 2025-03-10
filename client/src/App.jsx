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
import ReceivingTask from "./employee/receiver/ReceivingTask.jsx";
import PutAway from "./employee/forks/PutAway.jsx";
import SelectingTaskDetails from "./employee/selector/SelectingTaskDetails.jsx";
import ReadyPage from "./employee/selector/ReadyPage.jsx";
import AssignSingleProductLocation from "./components/supervisor/AssignSingleProductLocation.jsx";
import ReplenishTask from "./employee/forks/ReplenishTask.jsx";
import ReleasePickingTask from "./components/supervisor/ReleasePickingTask.jsx";
import SelectingTaskPick from "./employee/selector/SelectingTaskPick.jsx";

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
                <Route path="/receivingtask" element={<ReceivingTask/>}/>
                <Route path="/putaway" element={<PutAway/>}/>
                <Route path="/selectingtaskdetails" element={<SelectingTaskDetails/>}/>
                <Route path="/readypage" element={<ReadyPage/>}/>
                <Route path="/assignsingleproductlocation" element={<AssignSingleProductLocation/>}/>
                <Route path="/replenishtask" element={<ReplenishTask/>}/>
                <Route path="/releasepickingtask" element={<ReleasePickingTask/>}/>
                <Route path="/selectingtaskpick" element={<SelectingTaskPick/>}/>

                <Route path="/" element={<HomePage />} />



            </Routes>
        </Router>
    );
};

export default App;
