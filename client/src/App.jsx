import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Authentication
import LoginPage from './components/Login';
import Registration from './components/Registration';
import Logout from './components/Logout';

// Dashboard & User
import Dashboard from './components/Dashboard';
import Profile from './components/userInfo/Profile';
import UserInfo from './components/supervisor/UserInfo';

// Supervisor
import InquiryLocation from './components/supervisor/InquiryLocation';
import AssignSingleProductLocation from './components/supervisor/AssignSingleProductLocation';
import ReleasePickingTask from './components/supervisor/ReleasePickingTask';
import PrintPalletLabel from './components/supervisor/PrintPalletLabel';
import ReleaseLoadingTask from './components/supervisor/ReleasingLoadingTask';
import GenerateShippingLabel from './components/supervisor/GenerateShippingLabel';

// Employee - Docking
import DockingEntry from './employee/docking/DockingEntry';
import QueryDockingEntry from './employee/docking/QueryDockingEntry';

// Employee - Receiving
import ReceivingTask from './employee/receiving/ReceivingTask';

// Employee - Forklift
import PutAway from './employee/forks/PutAway';
import ReplenishTask from './employee/forks/ReplenishTask';

// Employee - Selector
import SelectingTaskDetails from './employee/selector/SelectingTaskDetails';
import SelectingTaskPick from './employee/selector/SelectingTaskPick';
import StageOrder from './employee/selector/StageOrder';

// Employee - Loader
import LoadingTaskDetails from './employee/loader/LoadingTaskDetails';
import LoadingTask from './employee/loader/LoadingTask';

// Error Page
import Error from './components/404';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/logout" element={<Logout />} />

                {/* Main Pages */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/userinfo" element={<UserInfo />} />

                {/* Supervisor Routes */}
                <Route path="/inquirelocation" element={<InquiryLocation />} />
                <Route path="/assignsingleproductlocation" element={<AssignSingleProductLocation />} />
                <Route path="/releasepickingtask" element={<ReleasePickingTask />} />
                <Route path="/printpalletlabel" element={<PrintPalletLabel />} />
                <Route path="/releaseloadingtask" element={<ReleaseLoadingTask />} />
                <Route path="/printshippinglabel" element={<GenerateShippingLabel />} />

                {/* Docking Routes */}
                <Route path="/dockingentry" element={<DockingEntry />} />
                <Route path="/querydockingentry" element={<QueryDockingEntry />} />

                {/* Receiving Routes */}
                <Route path="/receivingtask" element={<ReceivingTask />} />

                {/* Forklift Routes */}
                <Route path="/putaway" element={<PutAway />} />
                <Route path="/replenishtask" element={<ReplenishTask />} />

                {/* Selector Routes */}
                <Route path="/selectingtaskdetails" element={<SelectingTaskDetails />} />
                <Route path="/selectingtaskpick" element={<SelectingTaskPick />} />
                <Route path="/stageorder" element={<StageOrder />} />

                {/* Loader Routes */}
                <Route path="/loadingtaskdetails" element={<LoadingTaskDetails />} />
                <Route path="/loadingtask" element={<LoadingTask />} />

                {/* Catch-All Error Page */}
                <Route path="*" element={<Error />} />
            </Routes>
        </Router>
    );
};

export default App;
