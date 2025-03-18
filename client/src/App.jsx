import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login.jsx'; // Assuming you have LoginPage component

import Registration from "./components/Registration.jsx";
import Dashboard from "./components/Dashboard.jsx"; // Replace with actual page component
import Error from "./components/404.jsx";
import UserInfo from "./components/supervisor/UserInfo.jsx";
import Profile from "./components/userInfo/Profile.jsx";
import InquiryLocation from "./components/supervisor/InquiryLocation.jsx";
import DockingEntry from "./employee/docker/DockingEntry.jsx";
import QueryDockingEntry from "./employee/docker/QueryDockingEntry.jsx";
import ReceivingTask from "./employee/receiver/ReceivingTask.jsx";
import PutAway from "./employee/forks/PutAway.jsx";
import SelectingTaskDetails from "./employee/selector/SelectingTaskDetails.jsx";

import AssignSingleProductLocation from "./components/supervisor/AssignSingleProductLocation.jsx";
import ReplenishTask from "./employee/forks/ReplenishTask.jsx";
import ReleasePickingTask from "./components/supervisor/ReleasePickingTask.jsx";
import SelectingTaskPick from "./employee/selector/SelectingTaskPick.jsx";
import StageOrder from "./employee/selector/StageOrder.jsx";
import PrintPalletLabel from "./components/supervisor/PrintPalletLabel.jsx";
import ReleaseLoadingTask from "./components/supervisor/ReleasingLoadingTask.jsx";
import GenerateShippingLabel from "./components/supervisor/GenerateShippingLabel.jsx";
import LoadingTaskDetails from "./employee/loader/LoadingTaskDetails.jsx";
import LoadingTask from "./employee/loader/LoadingTask.jsx";
import Logout from "./components/Logout.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="*" element={<Error />} />

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
                <Route path="/assignsingleproductlocation" element={<AssignSingleProductLocation/>}/>
                <Route path="/replenishtask" element={<ReplenishTask/>}/>
                <Route path="/releasepickingtask" element={<ReleasePickingTask/>}/>
                <Route path="/selectingtaskpick" element={<SelectingTaskPick/>}/>
                <Route path="/stageorder" element={<StageOrder/>}/>
                <Route path="/printpalletlabel" element={<PrintPalletLabel/>}/>
                <Route path="/releaseloadingtask" element={<ReleaseLoadingTask/>}/>
                <Route path="/printshippinglabel" element={<GenerateShippingLabel/>}/>
                <Route path="/loadingtaskdetails" element={<LoadingTaskDetails/>}/>
                <Route path="/loadingtask" element={<LoadingTask/>}/>
                <Route path="/" element={<Dashboard />} />
                <Route path="/logout" element={<Logout/>}/>



            </Routes>
        </Router>
    );
};

export default App;
