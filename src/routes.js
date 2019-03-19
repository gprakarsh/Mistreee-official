import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Auth/Login/Login";
import Register from "./Components/Auth/Register/Register";
import UserWizard from './Components/Registration/UserWizard/UserWizard'
import MechanicWizard from './Components/Registration/MechanicWizard/MechanicWizard' 
import User1 from "./Components/Views/User/User1";
import User2 from "./Components/Views/User/User2";
import User3 from "./Components/Views/User/User3";
import Admin from './Components/Views/Admin/Admin'
import Mechanic from './Components/Views/Mechanic/Mechanic'
import NotApproved from './Components/Views/Mechanic/NotApproved/NotApproved'
import JobRequests from "./Components/Views/Admin/JobRequests/JobRequests";
import ServiceRequests from "./Components/Views/Mechanic/ServiceRequests/ServiceRequests";
import UserDashboard from './Components/Views/User/Dashboard/UserDashboard';
import PendingRequests from './Components/Views/User/PendingRequests/PendingRequests';
import ConfirmedRequests from './Components/Views/User/ConfirmedRequests/ConfirmedRequests'
import Appointments from "./Components/Views/Mechanic/Appointments/Appointments";
import Stats from "./Components/Views/Stats/Stats";
import Reason from "./Components/Views/Admin/JobRequests/Reason/Reason";
import AdminChat from "./Components/Views/Admin/AdminChat/AdminChat";

export default (
  <Switch>
      <Route path='/register/mechanic' component={MechanicWizard}/> 
      <Route path='/register/user' component={UserWizard}/>
      <Route path='/admin/chat' component={AdminChat}/>
      <Route path='/admin/apps' component={JobRequests}/>
      <Route path='/admin' component={Admin}/>
      <Route path='/applied/na' component={NotApproved}/>
      <Route path='/mech/reason' component={Reason}/>
      <Route path='/mechanic/appointments' component={Appointments}/>
      <Route path='/mechanic/req' component={ServiceRequests}/>
      <Route path='/mechanic' component={Mechanic}/>
      <Route path='/user/pending' component={PendingRequests}/>
      <Route path='/user/confirmed' component={ConfirmedRequests}/>
      <Route path='/user/dashboard' component={UserDashboard}/>
      <Route path='/user/3' component={User3}/>
      <Route path='/user/2' component={User2}/>
      <Route path='/stats' component={Stats}/>
      <Route path='/user' component={User1}/>
      <Route path='/login' component={Login}/>
      <Route path='/register' component={Register}/>
      <Route path='/' component={Home}/>
  </Switch>
);